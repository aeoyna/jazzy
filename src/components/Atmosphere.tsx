'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState, useMemo } from 'react';

// Mapping of root notes to distinct, atmospheric colors
const ROOT_COLOR_MAP: Record<string, string> = {
    'C': '#22c55e', // Emerald
    'C#': '#10b981', // Teal
    'Db': '#10b981',
    'D': '#3b82f6', // Blue
    'D#': '#6366f1', // Indigo
    'Eb': '#6366f1',
    'E': '#8b5cf6', // Violet
    'F': '#a855f7', // Purple
    'F#': '#d946ef', // Fuchsia
    'Gb': '#d946ef',
    'G': '#f43f5e', // Rose
    'G#': '#ef4444', // Red
    'Ab': '#ef4444',
    'A': '#f59e0b', // Amber
    'A#': '#eab308', // Yellow
    'Bb': '#eab308',
    'B': '#84cc16', // Lime
};

export const Atmosphere = () => {
    const isPlaying = useAppStore((state) => state.isPlaying);
    const activeBar = useAppStore((state) => state.activeBar);
    const currentSong = useAppStore((state) => state.currentSong);
    const tempo = useAppStore((state) => state.tempo);

    const [currentColor, setCurrentColor] = useState('#18181b'); // Default zinc-900

    // Animation duration based on tempo (one beat pulse)
    const pulseDuration = useMemo(() => {
        return (60 / tempo).toFixed(3);
    }, [tempo]);

    useEffect(() => {
        if (!isPlaying || !activeBar || !currentSong) {
            setCurrentColor('#18181b');
            return;
        }

        const section = currentSong.sections[activeBar.sectionIndex];
        if (!section) return;

        const bar = section.bars[activeBar.barIndex];
        if (!bar || !bar.chords[0]) return;

        // Extract root note (first part of chord string, e.g., "Am7" -> "A")
        const chordSymbol = bar.chords[0];
        const match = chordSymbol.match(/^([A-G][#b]?)/);
        const root = match ? match[1] : null;

        if (root && ROOT_COLOR_MAP[root]) {
            setCurrentColor(ROOT_COLOR_MAP[root]);
        }
    }, [isPlaying, activeBar, currentSong]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Dynamic Background Layer */}
            <div
                className="absolute inset-0 transition-colors duration-1000 ease-in-out"
                style={{
                    backgroundColor: currentColor,
                    opacity: isPlaying ? 0.15 : 0.05
                }}
            />

            {/* Pulse Layer */}
            {isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        animation: `pulse-bg ${pulseDuration}s ease-in-out infinite`,
                    }}
                >
                    <div
                        className="w-[150%] h-[150%] rounded-full opacity-20 blur-[120px]"
                        style={{
                            background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`
                        }}
                    />
                </div>
            )}

            {/* Decorative Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>
    );
};
