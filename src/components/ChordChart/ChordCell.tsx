import React from 'react';
import { Bar } from '@/types/song';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { formatChordString } from '@/lib/music-theory/format';

interface ChordCellProps {
    bar: Bar;
    isActive?: boolean;
    index: number;
}

export const ChordCell: React.FC<ChordCellProps> = ({ bar, isActive, index }) => {
    const {
        transpose,
        fontSize,
        minorDisplay,
        useGermanB,
        highlightingEnabled,
        highlightColor
    } = useAppStore();

    const { chords } = bar;
    const chordCount = chords.length;

    // Highlight Color Map
    const getHighlightClass = () => {
        if (!isActive || !highlightingEnabled) return '';
        switch (highlightColor) {
            case 'Yellow': return 'bg-yellow-500/40 text-yellow-100';
            case 'Green': return 'bg-green-600/40 text-green-100';
            case 'Blue': return 'bg-blue-600/40 text-blue-100';
            case 'Pink': return 'bg-pink-600/40 text-pink-100';
            case 'Orange': return 'bg-orange-600/40 text-orange-100';
            default: return 'bg-amber-900/30';
        }
    };

    // If highlighting is disabled, we might still want a subtle indication of position? 
    // Default was 'bg-amber-900/30'.
    const activeClass = isActive
        ? (highlightingEnabled ? getHighlightClass() : 'bg-zinc-800')
        : '';

    return (
        <div
            className={clsx(
                'relative flex h-20 w-full items-center justify-center border-r border-b border-zinc-500 bg-zinc-950 transition-colors duration-100',
                activeClass
            )}
        >
            {/* Repeat Start: ||: */}
            {bar.repeatStart && (
                <div className="absolute left-0 inset-y-0 flex items-center">
                    <div className="h-full w-[4px] bg-zinc-400 border-l-2 border-zinc-950" />
                    <div className="flex flex-col gap-1 ml-1">
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                    </div>
                </div>
            )}

            {/* Repeat End: :|| */}
            {bar.repeatEnd && (
                <div className="absolute right-0 inset-y-0 flex items-center">
                    <div className="flex flex-col gap-1 mr-1">
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                    </div>
                    <div className="h-full w-[4px] bg-zinc-400 border-r-2 border-zinc-950" />
                    <span className="absolute -top-1 -right-2 text-xs text-zinc-500 bg-zinc-950 px-1">x{bar.repeatEnd}</span>
                </div>
            )}

            {/* Visual divider for multiple chords */}
            {chordCount === 2 && (
                <div className="absolute inset-0 flex justify-center">
                    <div className="h-full w-[1px] bg-zinc-500" />
                </div>
            )}

            {/* Chords Rendering */}
            <div className="flex w-full items-center justify-around px-1">
                {chords.map((chord, idx) => (
                    <span
                        key={idx}
                        style={{ fontSize: `${fontSize}pt` }}
                        className={clsx(
                            "z-10 font-bold tracking-tight text-white transition-all",
                            minorDisplay === 'small' && chord.includes('m') ? "tracking-normal" : "" // Handle small m manually if needed?
                            // formatChordString handles the text replacement.
                        )}
                    >
                        {formatChordString(chord, { transpose, minorDisplay, useGermanB })}
                    </span>
                ))}
            </div>
        </div>
    );
};
