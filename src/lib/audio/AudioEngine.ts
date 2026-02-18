import * as Tone from 'tone';
import { Song, Section, Bar } from '@/types/song';
import { getChordNotes, getBassNote } from '../music-theory/chords';

export class AudioEngine {
    private static instance: AudioEngine;
    private isInitialized = false;

    private piano: Tone.PolySynth;
    private bass: Tone.MonoSynth;
    private drums: Tone.MembraneSynth;
    private cymbal: Tone.MetalSynth;

    private constructor() {
        this.piano = new Tone.PolySynth(Tone.Synth, {
            envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
            volume: -5,
        }).toDestination();

        this.bass = new Tone.MonoSynth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.8 },
            filterEnvelope: { attack: 0.001, decay: 0.1, sustain: 0.8, baseFrequency: 200, octaves: 2 },
            volume: -2,
        }).toDestination();

        this.drums = new Tone.MembraneSynth({
            volume: -10,
        }).toDestination();

        this.cymbal = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5,
            volume: -15,
        }).toDestination();
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public async initialize() {
        if (!this.isInitialized) {
            await Tone.start();
            console.log('Tone.js Context Started');
            this.isInitialized = true;
        }
    }

    public stop() {
        Tone.Transport.stop();
        Tone.Transport.cancel(); // Clear all scheduled events
    }

    public async playSong(song: Song) {
        if (!this.isInitialized) await this.initialize();

        this.stop();
        Tone.Transport.bpm.value = song.defaultTempo;

        // Schedule events
        // We need to flatten the song structure into a timeline
        // For MVP, we'll just schedule one pass through the sections using Transport.scheduleRepeat or similar logic is tricky with variable chords per bar.
        // Easier approach: Tone.Sequence? But beats are variable?
        // Let's iterate through bars and calculate time.

        let currentTime = 0; // in Measures (Bars) if 4/4
        // Tone.Transport.position uses "bars:quarters:sixteenths"

        // Simple "Swing" pattern scheduler
        // Walk through every section

        // We will loop the entire song structure indefinitely for now? Or just once?
        // Let's implement Part/Sequence for one loop of the song.

        const events: any[] = [];
        let absoluteBarIndex = 0;

        // Helper to unroll repeats
        const flatBars: Bar[] = [];

        song.sections.forEach(section => {
            let sectionBars: Bar[] = [];
            let repeatStartIndex = 0;

            for (let i = 0; i < section.bars.length; i++) {
                const bar = section.bars[i];

                if (bar.repeatStart) {
                    repeatStartIndex = i;
                }

                sectionBars.push(bar);

                if (bar.repeatEnd) {
                    // Repeat the segment from repeatStartIndex to i
                    // how many times? bar.repeatEnd - 1 (since we just pushed it once)
                    // e.g. repeatEnd: 2 means play total 2 times.
                    const count = bar.repeatEnd - 1;
                    const segment = section.bars.slice(repeatStartIndex, i + 1);

                    for (let r = 0; r < count; r++) {
                        sectionBars.push(...segment);
                    }
                    // Reset repeat start? Usually repeats don't nest in simple charts
                    // If nested, this logic needs to be complex. MVP assumes no nesting.
                    // Reset repeatStartIndex for "next" loop? Usually it's fine.
                }
            }
            flatBars.push(...sectionBars);
        });

        flatBars.forEach(bar => {
            // 1. Chords (Piano)
            const numChords = bar.chords.length;
            bar.chords.forEach((chord, i) => {
                const notes = getChordNotes(chord);
                const split = 4 / numChords;
                const timeOffset = i * split;

                Tone.Transport.schedule((time) => {
                    this.piano.triggerAttackRelease(notes, numChords === 1 ? '1n' : '2n', time);
                }, `${absoluteBarIndex}:0:${timeOffset * 4}`);
            });

            // 2. Bass - Walking Bass
            bar.chords.forEach((chord, i) => {
                const root = getBassNote(chord);
                const split = 4 / numChords;
                const timeOffset = i * split;

                Tone.Transport.schedule((time) => {
                    this.bass.triggerAttackRelease(root, '4n', time);
                }, `${absoluteBarIndex}:${timeOffset}:0`);

                if (split >= 2) {
                    Tone.Transport.schedule((time) => {
                        // Simple 5th (7 semitones up)
                        const midi = Tone.Frequency(root).toMidi();
                        const fifth = Tone.Frequency(midi + 7, "midi").toNote();
                        this.bass.triggerAttackRelease(fifth, '4n', time);
                    }, `${absoluteBarIndex}:${timeOffset + 1}:0`);
                }
            });

            // 3. Drives - Swing Pattern
            Tone.Transport.schedule((time) => {
                this.cymbal.triggerAttackRelease('32n', time);
            }, `${absoluteBarIndex}:0:0`);
            Tone.Transport.schedule((time) => {
                this.cymbal.triggerAttackRelease('32n', time);
                this.cymbal.triggerAttackRelease('32n', time + Tone.Time('8n').toSeconds() * 0.66);
            }, `${absoluteBarIndex}:1:0`);
            Tone.Transport.schedule((time) => {
                this.cymbal.triggerAttackRelease('32n', time);
            }, `${absoluteBarIndex}:2:0`);
            Tone.Transport.schedule((time) => {
                this.cymbal.triggerAttackRelease('32n', time);
                this.cymbal.triggerAttackRelease('32n', time + Tone.Time('8n').toSeconds() * 0.66);
            }, `${absoluteBarIndex}:3:0`);

            absoluteBarIndex++;
        });

        Tone.Transport.loop = true;
        Tone.Transport.loopEnd = `${absoluteBarIndex}:0:0`;
        Tone.Transport.start();
    }
}
