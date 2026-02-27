import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const Tuner: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [note, setNote] = useState<string>("--");
    const [frequency, setFrequency] = useState<number>(0);
    const [cents, setCents] = useState<number>(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const startTuner = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            setIsActive(true);
            updatePitch();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access is required for the tuner.");
        }
    };

    const stopTuner = () => {
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();

        setIsActive(false);
        setNote("--");
        setFrequency(0);
        setCents(0);
    };

    const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
        const SIZE = buffer.length;
        let rms = 0;

        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);

        // Signal too weak
        if (rms < 0.01) return -1;

        let r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for (let i = 0; i < SIZE / 2; i++) {
            if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
        }
        for (let i = 1; i < SIZE / 2; i++) {
            if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
        }

        buffer = buffer.slice(r1, r2);
        const newSize = buffer.length;

        const c = new Array(newSize).fill(0);
        for (let i = 0; i < newSize; i++) {
            for (let j = 0; j < newSize - i; j++) {
                c[i] = c[i] + buffer[j] * buffer[j + i];
            }
        }

        let d = 0;
        while (c[d] > c[d + 1]) d++;
        let maxval = -1, maxpos = -1;
        for (let i = d; i < newSize; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        let T0 = maxpos;

        // Interpolation
        const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    };

    const updatePitch = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        const buffer = new Float32Array(analyserRef.current.fftSize);
        analyserRef.current.getFloatTimeDomainData(buffer);

        const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);

        if (freq !== -1) {
            setFrequency(Math.round(freq * 10) / 10);

            // Note calculation
            const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
            const roundedNoteNum = Math.round(noteNum) + 69;
            const noteName = NOTES[roundedNoteNum % 12];
            const octave = Math.floor(roundedNoteNum / 12) - 1;

            setNote(`${noteName}${octave}`);

            // Cents calculation
            const diff = noteNum - Math.round(noteNum);
            setCents(Math.round(diff * 100));
        }

        animationIdRef.current = requestAnimationFrame(updatePitch);
    };

    useEffect(() => {
        return () => {
            if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-[var(--app-surface-elevated)] rounded-2xl border border-[var(--app-border)] w-full max-w-sm mx-auto shadow-xl relative overflow-hidden">
            <h2 className="text-xl font-bold text-[var(--jam-red)] uppercase tracking-widest">Tuner</h2>

            {/* Visual Meter */}
            <div className="w-full h-32 flex flex-col items-center justify-center relative">
                {/* Needle Track */}
                <div className="w-full h-1 bg-[var(--app-border)] rounded-full relative overflow-visible">
                    {/* Markers */}
                    <div className="absolute left-1/2 -top-2 w-0.5 h-5 bg-[var(--jam-red)] -translate-x-1/2 z-10" />
                    <div className="absolute left-[calc(50%-50px)] -top-1 w-0.5 h-3 bg-zinc-600 -translate-x-1/2" />
                    <div className="absolute left-[calc(50%+50px)] -top-1 w-0.5 h-3 bg-zinc-600 -translate-x-1/2" />

                    {/* Active Needle */}
                    <div
                        className={`absolute top-0 w-0.5 h-12 -translate-y-1/2 transition-transform duration-100 ease-out origin-top ${isActive && Math.abs(cents) < 5 ? 'bg-emerald-400' : 'bg-white'
                            }`}
                        style={{
                            left: '50%',
                            transform: `translateX(${cents * 1.5}px) rotate(${cents * 0.5}deg)`,
                            opacity: isActive ? 1 : 0
                        }}
                    />
                </div>

                {/* Cent values */}
                <div className="mt-8 flex justify-between w-full px-4 text-[10px] uppercase font-bold text-[var(--app-fg-dim)]">
                    <span>-50</span>
                    <span className={Math.abs(cents) < 5 ? 'text-emerald-400' : ''}>0</span>
                    <span>+50</span>
                </div>
            </div>

            {/* Note Display */}
            <div className="flex flex-col items-center min-h-[100px] justify-center">
                <span className={`text-7xl font-black tabular-nums transition-colors ${isActive && Math.abs(cents) < 5 ? 'text-emerald-400' : 'text-[var(--app-fg)]'
                    }`}>
                    {note}
                </span>
                <span className="text-sm font-medium text-[var(--app-fg-dim)] mt-2">
                    {isActive ? `${frequency} Hz` : "Play a note"}
                </span>
            </div>

            {/* Start/Stop Button */}
            <button
                onClick={isActive ? stopTuner : startTuner}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isActive
                        ? 'bg-zinc-800 text-zinc-400 border border-[var(--app-border)]'
                        : 'bg-[var(--jam-red)] text-white shadow-lg active:scale-95'
                    }`}
            >
                {isActive ? (
                    <>
                        <MicOff size={20} />
                        STOP TUNER
                    </>
                ) : (
                    <>
                        <Mic size={20} />
                        START TUNER
                    </>
                )}
            </button>
        </div>
    );
};
