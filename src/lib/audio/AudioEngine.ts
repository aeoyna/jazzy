import * as Tone from 'tone';
import { Song, Section, Bar } from '@/types/song';
import { getChordNotes, getBassNote } from '../music-theory/chords';
import { useAppStore } from '@/store/useAppStore';

export class AudioEngine {
    private static instance: AudioEngine;
    private isInitialized = false;

    private piano: Tone.Sampler;
    private bass: Tone.Sampler;
    private drums: Tone.MembraneSynth;
    private cymbal: Tone.MetalSynth;
    private hihat: Tone.MetalSynth;
    private bassEQ: Tone.EQ3;
    private reverb: Tone.Freeverb;

    private metronome: Tone.MembraneSynth;

    // Master Bus & Effects
    private masterGain: Tone.Gain;
    private gate: Tone.Gate;

    private constructor() {
        // Initialize context if not exists to avoid early access errors
        if (!Tone.context) {
            Tone.setContext(new Tone.Context());
        }
        this.masterGain = new Tone.Gain(1).toDestination();
        this.reverb = new Tone.Freeverb({ roomSize: 0.6, dampening: 4000 }).connect(this.masterGain);
        this.reverb.wet.value = 0.2; // 20% Reverb
        this.gate = new Tone.Gate(-40, 0.1).connect(this.reverb);

        this.piano = new Tone.Sampler({
            urls: {
                A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", A1: "A1.mp3",
                C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3", C3: "C3.mp3",
                "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3", A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
                A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", A6: "A6.mp3",
                C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", A7: "A7.mp3", C8: "C8.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            volume: -2,
        }).connect(this.reverb);

        this.bassEQ = new Tone.EQ3({
            low: 6, // Boost low frequencies (+6dB)
            mid: 0,
            high: 0,
            lowFrequency: 250,
        }).connect(this.reverb);

        this.bass = new Tone.Sampler({
            urls: {
                "E1": "e1-3.wav",
                "F1": "f1-3.wav",
                "G1": "g1-3.wav",
                "A1": "a3.wav",
                "Ab1": "ab1.wav", // Added more mappings
                "Bb1": "b1-3.wav",
                "C2": "c1-3.wav",
                "D2": "d1-3.wav",
                "Eb2": "eb3.wav",
                "F2": "f2-3.wav",
                "G2": "g2-3.wav",
                "Ab2": "ab3.wav",
                "Bb2": "b2-3.wav",
                "C3": "c2-3.wav",
                "D3": "d2-3.wav",
                "E3": "e2-3.wav"
            },
            baseUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/samples/bass/mybass/samples/`,
            volume: 0,
        }).connect(this.bassEQ);

        this.drums = new Tone.MembraneSynth({
            pitchDecay: 0.02,
            octaves: 6,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 1.2, attackCurve: 'exponential' },
            volume: -8,
        }).connect(this.reverb);

        this.cymbal = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.6, release: 0.1 },
            harmonicity: 5.1,
            modulationIndex: 40,
            resonance: 6000,
            octaves: 1.5,
            volume: -18,
        }).connect(this.reverb);

        this.hihat = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 8000,
            octaves: 1.5,
            volume: -18,
        }).connect(this.reverb);

        // Metronome doesn't go through effects
        this.metronome = new Tone.MembraneSynth({
            pitchDecay: 0.005,
            octaves: 2,
            envelope: {
                attack: 0.0005,
                decay: 0.08,
                sustain: 0,
            },
            volume: -10,
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
            try {
                await Tone.start();
                await Tone.loaded();
                console.log('AudioEngine: Tone.js Context Started and Samples Loaded');
                this.applyVolumes(); // Initial sync
                this.isInitialized = true;
            } catch (error) {
                console.error('AudioEngine: Initialization failed', error);
                throw error;
            }
        }
    }

    public applyVolumes() {
        const store = useAppStore.getState();
        const vols = store.instrumentVolumes;

        this.masterGain.gain.value = Tone.dbToGain(store.masterVolume);
        this.piano.volume.value = vols.piano;
        this.bass.volume.value = vols.bass + 6; // Adding a base boost
        this.drums.volume.value = vols.drums;
        this.cymbal.volume.value = vols.drums - 10;
        this.hihat.volume.value = vols.drums - 10;
        this.metronome.volume.value = vols.metronome;
        this.reverb.wet.value = store.reverbWet;
    }

    public stop() {
        Tone.Transport.stop();
        Tone.Transport.cancel(); // Clear all scheduled events
    }

    public setInstrumentVolume(instrument: 'piano' | 'bass' | 'drums' | 'metronome', volume: number) {
        // Map abstract instruments to actual Tone nodes
        switch (instrument) {
            case 'piano':
                this.piano.volume.value = volume;
                break;
            case 'bass':
                this.bass.volume.value = volume + 6; // Apply boost here too
                break;
            case 'drums':
                this.drums.volume.value = volume;
                this.cymbal.volume.value = volume - 10;
                this.hihat.volume.value = volume - 10;
                break;
            case 'metronome':
                this.metronome.volume.value = volume;
                break;
        }
    }

    public setMasterVolume(volume: number) {
        this.masterGain.gain.value = Tone.dbToGain(volume);
    }

    public setReverbWet(wet: number) {
        this.reverb.wet.value = wet;
    }

    public setGateParams(enabled: boolean, threshold: number) {
        if (enabled) {
            // Route through gate
            this.piano.disconnect();
            this.bassEQ.disconnect();
            this.drums.disconnect();
            this.cymbal.disconnect();
            this.hihat.disconnect();
            this.piano.connect(this.gate);
            this.bassEQ.connect(this.gate);
            this.drums.connect(this.gate);
            this.cymbal.connect(this.gate);
            this.hihat.connect(this.gate);
            this.gate.threshold = threshold;
        } else {
            // Bypass gate
            this.piano.disconnect();
            this.bassEQ.disconnect();
            this.drums.disconnect();
            this.cymbal.disconnect();
            this.hihat.disconnect();
            this.piano.connect(this.reverb);
            this.bassEQ.connect(this.reverb);
            this.drums.connect(this.reverb);
            this.cymbal.connect(this.reverb);
            this.hihat.connect(this.reverb);
        }
    }

    public async playSong(song: Song) {
        if (!this.isInitialized) await this.initialize();

        const store = useAppStore.getState();
        const loopCount = store.loopCount;

        this.applyVolumes(); // Ensure volumes are up to date when playing

        this.stop();
        Tone.Transport.bpm.value = store.tempo;

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

        // Track the last played chord to fill in empty bars (simile marks)
        let lastValidChord = 'C';

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
                    const count = bar.repeatEnd - 1;
                    const segment = section.bars.slice(repeatStartIndex, i + 1);

                    for (let r = 0; r < count; r++) {
                        sectionBars.push(...segment);
                    }
                }
            }
            flatBars.push(...sectionBars);
        });

        const totalIterations = loopCount === 0 ? 1 : loopCount;

        // Track the last played chords to fill in simile marks (%)
        let lastPlayedChords: string[] = ['C'];

        for (let iter = 0; iter < totalIterations; iter++) {
            flatBars.forEach((bar: Bar) => {
                // If bar contains simile mark %, use chords from the previous bar
                let barChords = bar.chords;
                if (barChords.length === 1 && barChords[0] === '%') {
                    barChords = [...lastPlayedChords];
                } else if (barChords.length > 0) {
                    // Update last played chords (ignore empty strings if they are just placeholders)
                    lastPlayedChords = barChords.filter(c => c !== '');
                }

                // Fill in empty chords with fallback if necessary
                let effectiveChords = barChords.length > 0 ? [...barChords] : lastPlayedChords;
                effectiveChords = effectiveChords.map((c: string) => {
                    if (c === '' || c === undefined || c === '%') return lastPlayedChords[0] || 'C';
                    return c;
                });

                // 0. Update Active Bar (UI) & Metronome

                let currentSectionIndex = -1;
                let currentBarIndex = -1;

                for (let s = 0; s < song.sections.length; s++) {
                    const section = song.sections[s];
                    const bIndex = section.bars.indexOf(bar);
                    if (bIndex !== -1) {
                        currentSectionIndex = s;
                        currentBarIndex = bIndex;
                        break;
                    }
                }

                if (currentSectionIndex !== -1) {
                    Tone.Transport.schedule((time) => {
                        Tone.Draw.schedule(() => {
                            import('@/store/useAppStore').then(({ useAppStore }) => {
                                useAppStore.getState().setActiveBar({
                                    sectionIndex: currentSectionIndex,
                                    barIndex: currentBarIndex
                                });
                            });
                        }, time);
                    }, `${absoluteBarIndex}:0:0`);
                }

                // 0. Metronome (Quarter notes)
                for (let beat = 0; beat < 4; beat++) {
                    Tone.Transport.schedule((time) => {
                        // High click on beat 1, low click on others
                        const note = beat === 0 ? "C5" : "C4";
                        this.metronome.triggerAttackRelease(note, "32n", time);
                    }, `${absoluteBarIndex}:${beat}:0`);
                }

                // 1. Chords (Piano Comping)
                const numChords = effectiveChords.length;
                effectiveChords.forEach((chord: string, i: number) => {
                    if (chord === 'N.C.') return; // Do not play notes for N.C.
                    const notes = getChordNotes(chord);
                    const split = 4 / numChords;
                    const timeOffset = i * split;

                    if (split === 4) {
                        // Charleston style: 1, 2&, 4
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '4n', time); }, `${absoluteBarIndex}:0:0`);
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '8n', time); }, `${absoluteBarIndex}:1:2`); // beat 2 And
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '8n', time); }, `${absoluteBarIndex}:3:2`); // beat 4 And
                    } else if (split === 2) {
                        // Play on beat 1 and beat 2& of the chord's duration
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '4n', time); }, `${absoluteBarIndex}:${timeOffset}:0`);
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '8n', time); }, `${absoluteBarIndex}:${timeOffset + 1}:2`);
                    } else {
                        Tone.Transport.schedule((time) => { this.piano.triggerAttackRelease(notes, '8n', time); }, `${absoluteBarIndex}:${timeOffset}:0`);
                    }
                });

                // 2. Bass - 4-Beat Walking Bass
                effectiveChords.forEach((chord: string, i: number) => {
                    if (chord === 'N.C.') return;
                    const split = 4 / numChords;
                    const timeOffset = i * split;
                    const bassNotes = getChordNotes(chord, 2); // Get notes in lower octave

                    for (let b = 0; b < split; b++) {
                        const beatOffset = timeOffset + b;
                        // Simple walking pattern using chord tones
                        const note = bassNotes[b % bassNotes.length];
                        Tone.Transport.schedule((time) => {
                            this.bass.triggerAttackRelease(note, '4n', time);
                        }, `${absoluteBarIndex}:${beatOffset}:0`);
                    }
                });

                // 3. Drums - Swing Pattern
                const swingOffset = Tone.Time('8n').toSeconds() * 0.66;

                // Kick on 1, 2, 3, 4 (feathering)
                for (let b = 0; b < 4; b++) {
                    Tone.Transport.schedule((time) => { this.drums.triggerAttackRelease('C1', '8n', time); }, `${absoluteBarIndex}:${b}:0`);
                }

                // Ride Cymbal
                Tone.Transport.schedule((time) => { this.cymbal.triggerAttackRelease('32n', time); }, `${absoluteBarIndex}:0:0`);
                Tone.Transport.schedule((time) => {
                    this.cymbal.triggerAttackRelease('32n', time);
                    this.cymbal.triggerAttackRelease('32n', time + swingOffset);
                }, `${absoluteBarIndex}:1:0`);
                Tone.Transport.schedule((time) => { this.cymbal.triggerAttackRelease('32n', time); }, `${absoluteBarIndex}:2:0`);
                Tone.Transport.schedule((time) => {
                    this.cymbal.triggerAttackRelease('32n', time);
                    this.cymbal.triggerAttackRelease('32n', time + swingOffset);
                }, `${absoluteBarIndex}:3:0`);

                // Hi-hat on 2 and 4
                Tone.Transport.schedule((time) => { this.hihat.triggerAttackRelease('32n', time); }, `${absoluteBarIndex}:1:0`);
                Tone.Transport.schedule((time) => { this.hihat.triggerAttackRelease('32n', time); }, `${absoluteBarIndex}:3:0`);

                absoluteBarIndex++;
            });
        }

        if (loopCount === 0) {
            // Infinite loop
            Tone.Transport.loop = true;
            Tone.Transport.loopEnd = `${absoluteBarIndex}:0:0`;
        } else {
            // Loop a specific number of times (already scheduled dynamically)
            Tone.Transport.loop = false;

            // Schedule a stop at the end of all repeats
            Tone.Transport.schedule((time) => {
                Tone.Transport.stop(time);
                import('@/store/useAppStore').then(({ useAppStore }) => {
                    useAppStore.getState().setIsPlaying(false);
                });
            }, `${absoluteBarIndex}:0:0`);
        }

        Tone.Transport.start();
    }
}
