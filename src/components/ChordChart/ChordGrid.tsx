import React from 'react';
import { Song, Section } from '@/types/song';
import { ChordCell } from './ChordCell';
import { useAppStore } from '@/store/useAppStore';
import { ScaleGuide } from '../ScaleGuide';
import clsx from 'clsx';

interface ChordGridProps {
    song: Song;
}

const SectionGrid: React.FC<{ section: Section; sectionIndex: number; activeBar: { sectionIndex: number; barIndex: number } | null }> = ({ section, sectionIndex, activeBar }) => {
    // Group bars into blocks of 4
    const chunks: any[][] = [];
    for (let i = 0; i < section.bars.length; i += 4) {
        chunks.push(section.bars.slice(i, i + 4));
    }

    return (
        <div className="relative mb-3">
            {/* Section Label - More prominent circular badge */}
            <div className="absolute -left-1 -top-3 z-30">
                <span className="flex h-7 w-7 items-center justify-center bg-[var(--jam-red)] font-black text-white text-sm border-2 border-black rounded-full shadow-[0_0_12px_rgba(255,51,102,0.4)]">
                    {section.label}
                </span>
            </div>

            <div className="flex flex-col gap-1">
                {chunks.map((chunk, chunkIdx) => (
                    <div
                        key={chunkIdx}
                        className="grid grid-cols-4 bg-[var(--app-surface)]/20 border border-white/10 rounded-xl overflow-hidden shadow-sm"
                    >
                        {chunk.map((bar, idx) => {
                            const globalIdx = chunkIdx * 4 + idx;
                            const isActive = activeBar?.sectionIndex === sectionIndex && activeBar?.barIndex === globalIdx;
                            return (
                                <ChordCell
                                    key={`${section.label}-${globalIdx}`}
                                    bar={bar}
                                    index={globalIdx}
                                    sectionIndex={sectionIndex}
                                    isActive={isActive}
                                    isLastInBlock={idx === chunk.length - 1}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ChordGrid: React.FC<ChordGridProps> = ({ song }) => {
    const { activeBar } = useAppStore();

    return (
        <div className="mx-auto w-full max-w-lg px-2 py-4 flex flex-col gap-1.5 relative">
            {song.sections.map((section, idx) => (
                <SectionGrid
                    key={idx}
                    section={section}
                    sectionIndex={idx}
                    activeBar={activeBar}
                />
            ))}
            <ScaleGuide />
        </div>
    );
};
