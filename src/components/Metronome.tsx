import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { Play, Square, Settings2 } from 'lucide-react';

export const Metronome: React.FC = () => {
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beat, setBeat] = useState(0);

    // Refs for Tone.js elements to avoid re-renders
    const synthRef = useRef<Tone.MembraneSynth | null>(null);
    const loopRef = useRef<Tone.Loop | null>(null);

    useEffect(() => {
        // Initialize synth
        synthRef.current = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' }
        }).toDestination();

        return () => {
            if (isPlaying) {
                Tone.Transport.stop();
            }
            synthRef.current?.dispose();
            loopRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    const toggleMetronome = async () => {
        if (isPlaying) {
            Tone.Transport.stop();
            loopRef.current?.dispose();
            loopRef.current = null;
            setIsPlaying(false);
            setBeat(0);
        } else {
            await Tone.start();

            let beatCount = 0;
            loopRef.current = new Tone.Loop((time) => {
                const isDownbeat = beatCount % 4 === 0;
                synthRef.current?.triggerAttackRelease(isDownbeat ? "C4" : "G3", "32n", time);

                // Update beat visually (sync with transport)
                Tone.Draw.schedule(() => {
                    setBeat(beatCount % 4);
                    beatCount++;
                }, time);
            }, "4n").start(0);

            Tone.Transport.start();
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-[var(--app-surface-elevated)] rounded-2xl border border-[var(--app-border)] w-full max-w-sm mx-auto shadow-xl">
            <h2 className="text-xl font-bold text-[var(--jam-red)] uppercase tracking-widest">Metronome</h2>

            {/* Beat Vision */}
            <div className="flex gap-4 items-center justify-center py-4">
                {[0, 1, 2, 3].map((b) => (
                    <div
                        key={b}
                        className={`w-4 h-4 rounded-full transition-all duration-75 ${isPlaying && beat === b
                                ? 'bg-[var(--jam-red)] scale-125 shadow-[0_0_12px_var(--jam-red)]'
                                : 'bg-[var(--app-border)] opacity-50'
                            }`}
                    />
                ))}
            </div>

            {/* BPM Display */}
            <div className="flex flex-col items-center">
                <span className="text-5xl font-black text-[var(--app-fg)] tabular-nums">{bpm}</span>
                <span className="text-xs uppercase text-[var(--app-fg-dim)] font-bold tracking-tighter">BPM</span>
            </div>

            {/* BPM Slider */}
            <input
                type="range"
                min="40"
                max="240"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
            />

            {/* Controls */}
            <button
                onClick={toggleMetronome}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isPlaying
                        ? 'bg-zinc-800 text-[var(--jam-red)] border-2 border-[var(--jam-red)]'
                        : 'bg-[var(--jam-red)] text-white shadow-lg'
                    }`}
            >
                {isPlaying ? <Square size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
        </div>
    );
};
