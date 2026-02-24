import React from 'react';
import { Song, Section } from '@/types/song';
import { ChordCell } from './ChordCell';
import { useAppStore } from '@/store/useAppStore';

interface ChordGridProps {
    song: Song;
}

const SectionGrid: React.FC<{ section: Section; sectionIndex: number; activeBar: { sectionIndex: number; barIndex: number } | null }> = ({ section, sectionIndex, activeBar }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center">
                <span className="flex h-6 w-6 items-center justify-center bg-zinc-300 font-bold text-black text-sm border border-zinc-500 mb-[-1px] z-10">
                    {section.label}
                </span>
            </div>

            <div className="grid grid-cols-4 border-l border-t border-zinc-500 bg-zinc-950">
                {section.bars.map((bar, idx) => {
                    const isActive = activeBar?.sectionIndex === sectionIndex && activeBar?.barIndex === idx;
                    return (
                        <ChordCell
                            key={`${section.label}-${idx}`}
                            bar={bar}
                            index={idx}
                            sectionIndex={sectionIndex}
                            isActive={isActive}
                        />
                    );
                })}
            </div>
        </div >
    );
};

export const ChordGrid: React.FC<ChordGridProps> = ({ song }) => {
    const { activeBar } = useAppStore();

    return (
        <div className="mx-auto w-full max-w-4xl p-4">
            {song.sections.map((section, idx) => (
                <SectionGrid
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    activeBar={activeBar}
                />
            ))}
        </div>
    );
};
