import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

interface DrumPickerProps<T extends string | number> {
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
    label: string;
    itemHeight?: number;
    className?: string;
    loop?: boolean;
}

export function DrumPicker<T extends string | number>({
    options,
    value,
    onChange,
    label,
    itemHeight = 40,
    className,
    loop = false
}: DrumPickerProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const baseIndex = options.indexOf(value) !== -1 ? options.indexOf(value) : 0;

    // For infinite looping, we create a much larger virtual list
    const REPEAT_COUNT = loop ? 100 : 1;
    const virtualIndex = loop ? (Math.floor(REPEAT_COUNT / 2) * options.length + baseIndex) : baseIndex;

    // Using a ref to track the last programmatic scroll to avoid loop-back jumps
    const lastSetScrollTop = useRef<number | null>(null);

    useEffect(() => {
        if (containerRef.current && !isDragging) {
            const targetScrollTop = virtualIndex * itemHeight;
            // Only update if it's the first time or the value changed externally
            if (lastSetScrollTop.current === null || Math.abs(containerRef.current.scrollTop - targetScrollTop) > itemHeight * 2) {
                containerRef.current.scrollTop = targetScrollTop;
                lastSetScrollTop.current = targetScrollTop;
            }
        }
    }, [virtualIndex, itemHeight, isDragging]);

    const getRealIndex = (virtualIdx: number) => {
        if (!loop) return Math.max(0, Math.min(virtualIdx, options.length - 1));
        return ((virtualIdx % options.length) + options.length) % options.length;
    };

    const handleScroll = () => {
        if (!containerRef.current || isDragging) return;

        // Timeout to snap after scrolling stops
        clearTimeout((containerRef.current as any).scrollTimeout);
        (containerRef.current as any).scrollTimeout = setTimeout(() => {
            if (!containerRef.current) return;
            const newIndex = Math.round(containerRef.current.scrollTop / itemHeight);
            const realIndex = getRealIndex(newIndex);

            // To prevent snapping jumping the scroll abruptly while they are viewing the repeating item
            lastSetScrollTop.current = newIndex * itemHeight;

            onChange(options[realIndex]);
        }, 150);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setStartY(e.clientY);
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const deltaY = startY - e.clientY;
        containerRef.current.scrollTop = scrollTop + deltaY;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        // Snap to nearest
        const newIndex = Math.round(containerRef.current.scrollTop / itemHeight);
        const realIndex = getRealIndex(newIndex);
        onChange(options[realIndex]);
    };

    // Construct the rendering list
    const displayItems = loop
        ? Array.from({ length: options.length * REPEAT_COUNT }, (_, i) => options[i % options.length])
        : options;

    const currentScrollIndex = containerRef.current ? Math.round(containerRef.current.scrollTop / itemHeight) : virtualIndex;

    return (
        <div className={clsx("flex flex-col relative", className)}>
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2 text-center">{label}</div>

            <div className="relative h-[120px] overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
                {/* Selection Highlight */}
                <div
                    className="absolute top-1/2 left-0 right-0 -translate-y-1/2 bg-zinc-800/80 border-y border-[var(--jam-red)]/30 pointer-events-none z-10"
                    style={{ height: itemHeight }}
                />

                {/* Scroll Container */}
                <div
                    ref={containerRef}
                    className="h-full overflow-y-auto custom-scrollbar snap-y snap-mandatory relative z-20 touch-none"
                    onScroll={handleScroll}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                        paddingTop: 120 / 2 - itemHeight / 2,
                        paddingBottom: 120 / 2 - itemHeight / 2
                    }}
                >
                    {displayItems.map((opt, i) => {
                        const distance = Math.abs(currentScrollIndex - i);
                        const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0.1;
                        const scale = distance === 0 ? 1 : distance === 1 ? 0.9 : 0.8;
                        const isSelected = distance === 0;

                        return (
                            <div
                                key={`${i}-${opt}`}
                                className={clsx(
                                    "flex items-center justify-center w-full snap-center transition-all duration-200 select-none",
                                    isSelected ? "text-[var(--jam-red)] font-bold" : "text-zinc-400 font-medium"
                                )}
                                style={{
                                    height: itemHeight,
                                    opacity: isDragging ? 1 : opacity, // Show all clearly while dragging
                                    transform: isDragging ? 'none' : `scale(${scale})`
                                }}
                            >
                                {opt}
                            </div>
                        );
                    })}
                </div>

                {/* Top/Bottom Gradient Fades */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-900 to-transparent pointer-events-none z-30" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-30" />
            </div>
        </div>
    );
}
