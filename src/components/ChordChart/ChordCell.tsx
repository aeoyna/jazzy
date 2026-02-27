import React, { useState, useRef, useEffect } from 'react';
import { Bar } from '@/types/song';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { formatChord } from '@/lib/music-theory/format';

interface ChordCellProps {
    bar: Bar;
    isActive?: boolean;
    index: number;
    sectionIndex: number;
    isLastInBlock?: boolean;
}

export const ChordCell: React.FC<ChordCellProps> = ({ bar, isActive, index, sectionIndex, isLastInBlock }) => {
    const {
        transpose,
        fontSize,
        minorDisplay,
        useGermanB,
        highlightingEnabled,
        highlightColor,
        updateBarLyrics
    } = useAppStore();

    const { chords } = bar;
    const chordCount = chords.length;
    // We want the grid to show empty subdivisions if there are multiple chords, some empty
    const visibleChords = chords.length > 0 ? chords : [];

    // Active class using ring for rounded highlighting
    const activeClass = isActive
        ? (highlightingEnabled
            ? 'bg-[var(--app-active-bg)] z-10'
            : 'bg-[var(--app-surface-elevated)] z-10')
        : 'bg-transparent hover:bg-white/5';

    const lyricsLines = bar.lyrics ? bar.lyrics.split('/').map(l => l.trim()) : [];
    const hasMultipleLyrics = lyricsLines.length > 1;

    // Inline Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(bar.lyrics || '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditValue(bar.lyrics || '');
    }, [bar.lyrics]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleLyricsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleSaveLyrics = () => {
        if (editValue !== (bar.lyrics || '')) {
            updateBarLyrics(sectionIndex, index, editValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveLyrics();
        } else if (e.key === 'Escape') {
            setEditValue(bar.lyrics || ''); // Revert
            setIsEditing(false);
        }
    };

    return (
        <div
            data-active-cell={isActive ? "true" : undefined}
            className={clsx(
                'flex flex-col w-full transition-all duration-300 relative',
                !isLastInBlock && 'border-r border-white/10',
                hasMultipleLyrics ? 'h-[4.6rem]' : 'h-16',
                activeClass
            )}
        >
            {isActive && highlightingEnabled && (
                <div className="absolute inset-0 ring-2 ring-inset ring-[var(--app-active-border)] shadow-[inset_0_0_10px_rgba(255,51,102,0.2)] pointer-events-none z-20" />
            )}
            {/* Chords Area */}
            <div className="flex-1 relative flex w-full items-center justify-around px-2">
                {/* Repeat Start: ||: */}
                {bar.repeatStart && (
                    <div className="absolute left-0 inset-y-0 flex items-center z-10">
                        <div className="h-full w-[4px] bg-zinc-400 border-l-2 border-zinc-950" />
                        <div className="flex flex-col gap-1 ml-1">
                            <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                            <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        </div>
                    </div>
                )}

                {/* Repeat End: :|| */}
                {bar.repeatEnd && (
                    <div className="absolute right-0 inset-y-0 flex items-center z-10">
                        <div className="flex flex-col gap-1 mr-1">
                            <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                            <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                        </div>
                        <div className="h-full w-[4px] bg-zinc-400 border-r-2 border-zinc-950" />
                        <span className="absolute -top-1 -right-2 text-[10px] sm:text-xs font-bold text-zinc-400 bg-zinc-950 px-1 rounded-sm">x{bar.repeatEnd}</span>
                    </div>
                )}



                {/* Chords Rendering */}
                <div className="flex w-full h-full items-center justify-around px-1">
                    {visibleChords.some(c => c === '%') ? (
                        <div className="flex w-full h-full items-center justify-center text-[var(--app-chord-txt)]">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                                <circle cx="14" cy="14" r="3" fill="currentColor" />
                                <circle cx="26" cy="26" r="3" fill="currentColor" />
                                <line x1="12" y1="28" x2="28" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                    ) : visibleChords.length === 0 || visibleChords.every(c => c === '') ? (
                        <div className="flex w-full h-full items-center justify-center text-zinc-500/40">
                            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                                <circle cx="28" cy="28" r="3.5" fill="currentColor" />
                                <line x1="10" y1="30" x2="30" y2="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                    ) : (
                        visibleChords.map((chord, idx) => {
                            const { root, bass, superscript, subscript } = formatChord(chord, { transpose, minorDisplay, useGermanB });

                            // Extract accidentals from root and bass to render as superscript
                            const rootMatch = root.match(/^([A-H])([#b♭]?)(.*)$/);
                            const rootBase = rootMatch ? rootMatch[1] : root;
                            const rootAccRaw = rootMatch ? rootMatch[2] : '';
                            const rootAcc = rootAccRaw === 'b' ? '♭' : rootAccRaw === '#' ? '♯' : rootAccRaw;

                            const bassMatch = bass ? bass.match(/^([A-H])([#b♭]?)(.*)$/) : null;
                            const bassBase = bassMatch ? bassMatch[1] : bass;
                            const bassAccRaw = bassMatch ? bassMatch[2] : '';
                            const bassAcc = bassAccRaw === 'b' ? '♭' : bassAccRaw === '#' ? '♯' : bassAccRaw;

                            return (
                                <div key={idx} className="flex-1 flex justify-center items-center h-full">
                                    <div className="flex items-baseline font-bold text-[var(--app-chord-txt)] transition-all whitespace-nowrap">
                                        {/* Root Note - Largest */}
                                        <span style={{ fontSize: `${fontSize}pt` }} className="tracking-tight leading-none">
                                            {rootBase}
                                            {rootAcc && (
                                                <sup style={{ fontSize: '0.6em' }}>{rootAcc}</sup>
                                            )}
                                        </span>

                                        {/* Subscript (e.g. m, -) */}
                                        {subscript && (
                                            <span
                                                style={{ fontSize: `${fontSize * 0.55}pt` }}
                                                className={clsx("tracking-tight leading-none", minorDisplay === 'small' ? 'font-normal' : '')}
                                            >
                                                {subscript}
                                            </span>
                                        )}

                                        {/* Superscript / Extensions (e.g. 7, △7, ♭9) */}
                                        {superscript && (
                                            <span
                                                style={{
                                                    fontSize: `${fontSize * 0.55}pt`,
                                                }}
                                                className="tracking-tight leading-none inline-flex items-baseline ml-0.5"
                                            >
                                                {superscript.split(/(\d+)/).map((part, i) => {
                                                    if (/\d/.test(part)) {
                                                        // Making numbers slightly smaller (70% of previous 1.65em is ~1.15em)
                                                        return <span key={i} style={{ fontSize: '1.15em' }} className="font-bold">{part}</span>;
                                                    }
                                                    // For text parts like △ or b or #, use proper symbols
                                                    const displayPart = part === 'b' ? '♭' : part === '#' ? '♯' : part;
                                                    return <span key={i}>{displayPart}</span>;
                                                })}
                                            </span>
                                        )}

                                        {/* Bass Note (e.g. /G) */}
                                        {bass && (
                                            <div className="flex flex-col justify-center ml-0.5" style={{ fontSize: `${fontSize * 0.6}pt` }}>
                                                <span className="leading-none transform -translate-y-1">/</span>
                                                <span className="leading-none transform -translate-y-1">
                                                    {bassBase}
                                                    {bassAcc && <sup style={{ fontSize: '0.6em' }}>{bassAcc}</sup>}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Lyrics Strip */}
            <div
                onClick={handleLyricsClick}
                className={clsx(
                    "w-full border-t border-[var(--app-border)] flex flex-col justify-center px-1.5 overflow-hidden shrink-0 cursor-text transition-colors group",
                    hasMultipleLyrics && !isEditing ? "h-[32px] py-0.5 space-y-[1px]" : "h-[18px]",
                    isEditing ? "bg-[var(--jam-red-dark)]/40 border-[var(--jam-red)]/50" : "bg-[var(--app-bg)]/40 hover:bg-[var(--app-surface-elevated)]"
                )}
            >
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveLyrics}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-[10.5px] font-medium text-[var(--jam-red)] outline-none font-sans tracking-wide leading-none"
                        placeholder="Lyrics... (use / for multiple lines)"
                    />
                ) : (
                    <>
                        {lyricsLines.map((line, idx) => (
                            <div key={idx} className="flex items-center">
                                {hasMultipleLyrics && (
                                    <span className="text-[8px] font-bold text-zinc-500 w-3 shrink-0">{idx + 1}.</span>
                                )}
                                <span className={clsx(
                                    "font-medium text-red-200/90 truncate font-sans tracking-wide leading-none",
                                    hasMultipleLyrics ? "text-[9.5px]" : "text-[10.5px]"
                                )}>
                                    {line || ''}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
