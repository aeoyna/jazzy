'use client';

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getSuggestedScales, detect251 } from '@/lib/music-theory/chords';
import { Music2, Sparkles } from 'lucide-react';

export const ScaleGuide: React.FC = () => {
    const { isPlaying, activeBar, currentSong } = useAppStore();
    const [position, setPosition] = useState<{ top: number; width: number } | null>(null);
    const prevRowKey = useRef<string>('');
    const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Current row index (each row = 4 bars)
    const currentRowKey = useMemo(() => {
        if (!activeBar) return '';
        const rowIdx = Math.floor(activeBar.barIndex / 4);
        return `${activeBar.sectionIndex}-${rowIdx}`;
    }, [activeBar]);

    // Is this the last bar in the current 4-bar row?
    const isLastBarInRow = useMemo(() => {
        if (!activeBar || !currentSong) return false;
        const section = currentSong.sections[activeBar.sectionIndex];
        if (!section) return false;
        const rowIdx = Math.floor(activeBar.barIndex / 4);
        const rowEnd = Math.min((rowIdx + 1) * 4, section.bars.length);
        return activeBar.barIndex === rowEnd - 1;
    }, [activeBar, currentSong]);

    // Show CURRENT bar's scale info
    const suggestions = useMemo<{ chord: string; scales: string[] } | null>(() => {
        if (!isPlaying || !activeBar || !currentSong) return null;

        const section = currentSong.sections[activeBar.sectionIndex];
        if (!section) return null;

        const bar = section.bars[activeBar.barIndex];
        if (!bar || !bar.chords[0]) return null;

        return {
            chord: bar.chords[0],
            scales: getSuggestedScales(bar.chords[0])
        };
    }, [isPlaying, activeBar, currentSong]);

    // Detect ii-V-I (251) from current position
    const twoFiveOne = useMemo(() => {
        if (!activeBar || !currentSong) return null;

        // Collect up to 3 consecutive chords starting from current bar
        const upcomingChords: string[] = [];
        let si = activeBar.sectionIndex;
        let bi = activeBar.barIndex;

        for (let i = 0; i < 3 && si < currentSong.sections.length; i++) {
            const section = currentSong.sections[si];
            if (!section || bi >= section.bars.length) break;
            const bar = section.bars[bi];
            if (bar?.chords[0] && bar.chords[0] !== '%') {
                upcomingChords.push(bar.chords[0]);
            }
            bi++;
            if (bi >= section.bars.length) {
                si++;
                bi = 0;
            }
        }

        return detect251(upcomingChords);
    }, [activeBar, currentSong]);

    // Get position below the active row
    const getActiveRowBottom = useCallback(() => {
        const activeCell = document.querySelector('[data-active-cell="true"]');
        const scrollContainer = document.querySelector('[data-chord-scroll]');
        if (!activeCell || !scrollContainer) return null;

        const activeRow = activeCell.closest('.grid');
        if (!activeRow) return null;

        const rowRect = activeRow.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        return {
            top: rowRect.bottom - containerRect.top + scrollContainer.scrollTop + 2,
            width: containerRect.width - 16,
        };
    }, []);

    // Get position below the NEXT row (for lead movement)
    const getNextRowBottom = useCallback(() => {
        const activeCell = document.querySelector('[data-active-cell="true"]');
        const scrollContainer = document.querySelector('[data-chord-scroll]');
        if (!activeCell || !scrollContainer) return null;

        const activeRow = activeCell.closest('.grid');
        if (!activeRow) return null;

        const containerRect = scrollContainer.getBoundingClientRect();

        // Find next row: could be next sibling grid, or first grid of next section
        let nextRow: Element | null = activeRow.nextElementSibling;
        if (!nextRow) {
            const sectionContainer = activeRow.closest('.relative');
            if (sectionContainer) {
                const nextSection = sectionContainer.nextElementSibling;
                if (nextSection) {
                    nextRow = nextSection.querySelector('.grid');
                }
            }
        }

        if (nextRow) {
            const nextRowRect = nextRow.getBoundingClientRect();
            return {
                top: nextRowRect.bottom - containerRect.top + scrollContainer.scrollTop + 2,
                width: containerRect.width - 16,
            };
        }

        return null;
    }, []);

    useEffect(() => {
        if (!isPlaying || !activeBar || !currentSong) {
            setPosition(null);
            if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
            prevRowKey.current = '';
            return;
        }

        // Clear any pending move timer
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);

        // Only update position when the ROW changes (not every bar)
        if (currentRowKey !== prevRowKey.current) {
            prevRowKey.current = currentRowKey;

            const pos = getActiveRowBottom();
            if (pos) setPosition(pos);

            // Auto-scroll
            const activeCell = document.querySelector('[data-active-cell="true"]');
            const scrollContainer = document.querySelector('[data-chord-scroll]');
            if (activeCell && scrollContainer) {
                const cellRect = activeCell.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                const cellBottom = cellRect.bottom - containerRect.top;
                const viewportHeight = containerRect.height;

                if (cellBottom > viewportHeight * 0.55) {
                    scrollContainer.scrollBy({
                        top: cellBottom - viewportHeight * 0.3,
                        behavior: 'smooth'
                    });
                }
            }
        }

        // When we're on the LAST bar of a 4-bar row, schedule lead movement
        // BUT skip if this row contains a repeat end (playback will jump back up)
        if (isLastBarInRow) {
            const section = currentSong.sections[activeBar.sectionIndex];
            const currentBar = section?.bars[activeBar.barIndex];
            const hasRepeatEnd = currentBar?.repeatEnd;

            if (!hasRepeatEnd) {
                const tempo = currentSong.defaultTempo || 120;
                const barDurationMs = (4 * 60 * 1000) / tempo;
                const leadTimeMs = 1000;
                const moveDelay = Math.max(100, barDurationMs - leadTimeMs);

                moveTimerRef.current = setTimeout(() => {
                    const nextPos = getNextRowBottom();
                    if (nextPos) setPosition(nextPos);
                }, moveDelay);
            }
        }

        return () => {
            if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        };
    }, [isPlaying, activeBar, currentSong, currentRowKey, isLastBarInRow, getActiveRowBottom, getNextRowBottom]);

    if (!isPlaying || !suggestions || !position) {
        return null;
    }

    return (
        <div
            className="absolute z-40 left-2"
            style={{
                top: `${position.top}px`,
                width: `${position.width}px`,
                transition: 'top 300ms ease-out',
            }}
        >
            <div className="bg-black/75 backdrop-blur-lg border border-[var(--jam-red)]/25 rounded-lg px-3 py-1.5 shadow-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <Music2 className="text-[var(--jam-red)] w-3.5 h-3.5 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                        {suggestions.scales.map((scale, i) => (
                            <span
                                key={i}
                                className="px-1.5 py-0 bg-white/5 border border-white/8 rounded text-[10px] font-semibold text-zinc-400"
                            >
                                {scale}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {twoFiveOne && (
                        <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-[10px] font-bold text-amber-400 tracking-wide">
                            251→{twoFiveOne.key}
                        </span>
                    )}
                    <div className="text-sm font-black text-[var(--jam-red)] leading-none tracking-tighter">
                        {suggestions.chord}
                    </div>
                </div>
            </div>
        </div>
    );
};
