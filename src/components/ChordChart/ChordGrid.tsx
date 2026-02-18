import React from 'react';
import { Song, Section } from '@/types/song';
import { ChordCell } from './ChordCell';

interface ChordGridProps {
    song: Song;
}

const SectionGrid: React.FC<{ section: Section }> = ({ section }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center">
                <span className="flex h-6 w-6 items-center justify-center bg-zinc-300 font-bold text-black text-sm border border-zinc-500 mb-[-1px] z-10">
                    {section.label}
                </span>
            </div>

            <div className="grid grid-cols-4 border-l border-t border-zinc-500 bg-zinc-950">
                {section.bars.map((bar, idx) => (
                    <ChordCell key={`${section.label}-${idx}`} bar={bar} index={idx} />
                ))}
            </div>
        </div >
    );
};

export const ChordGrid: React.FC<ChordGridProps> = ({ song }) => {
    return (
        <div className="mx-auto w-full max-w-4xl p-4">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-white">{song.title}</h1>
                <p className="text-zinc-400">
                    {song.composer} • {song.style} • {song.defaultKey}
                </p>
            </div>

            {song.sections.map((section, idx) => (
                <SectionGrid key={idx} section={section} />
            ))}
        </div>
    );
};
