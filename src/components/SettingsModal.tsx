import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, Check, Monitor, Music, Settings as SettingsIcon, Info, GripHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useDraggable } from '@/hooks/useDraggable';

interface SettingsModalProps {
    onClose: () => void;
}

type Tab = 'display' | 'general' | 'about';

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('display');
    const {
        currentSong,
        transpose, setTranspose,
        fontSize, setFontSize,
        minorDisplay, setMinorDisplay,
        highlightColor, setHighlightColor,
        useGermanB, setUseGermanB,
        highlightingEnabled, setHighlightingEnabled
    } = useAppStore();

    // Dragging State
    const { position, handleMouseDown, isDragging } = useDraggable();

    const highlightColors = [
        { name: 'Yellow', value: 'Yellow', hex: '#fbbf24' },
        { name: 'Green', value: 'Green', hex: '#4ade80' },
        { name: 'Blue', value: 'Blue', hex: '#60a5fa' },
        { name: 'Pink', value: 'Pink', hex: '#f472b6' },
        { name: 'Orange', value: 'Orange', hex: '#fb923c' }
    ];

    const TabButton = ({ id, icon: Icon, label }: { id: Tab; icon: any; label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={clsx(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                activeTab === id ? "text-amber-500" : "text-zinc-400 hover:text-zinc-200"
            )}
        >
            <Icon size={16} />
            {label}
            {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            )}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}>
            <div
                className={clsx(
                    "w-[500px] max-w-[95vw] bg-red-950 border border-red-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200",
                    isDragging ? "cursor-grabbing" : ""
                )}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    backgroundColor: '#000000'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Draggable Area */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b border-red-800 bg-red-900 cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 pointer-events-none">
                        <SettingsIcon size={20} className="text-amber-500" />
                        Settings
                    </h2>
                    <div className="flex gap-2">
                        {/* Grip Icon hint */}
                        <GripHorizontal size={20} className="text-zinc-600 mr-2 opacity-50" />
                        <button
                            onClick={onClose}
                            onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-2 border-b border-red-800 bg-red-900">
                    <TabButton id="display" icon={Monitor} label="Display" />
                    <TabButton id="general" icon={SettingsIcon} label="General" />
                    <TabButton id="about" icon={Info} label="About" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-red-950">
                    {activeTab === 'display' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in">
                            {/* Transpose Section */}
                            <section>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Song Key</h3>
                                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-zinc-300">Transpose</div>
                                        <div className="text-xs px-2 py-1 rounded bg-black/30 text-amber-500 font-mono border border-amber-500/20">
                                            Original: {currentSong?.defaultKey || 'C'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => setTranspose(transpose - 1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 hover:bg-amber-500/20 hover:text-amber-500 border border-white/10 hover:border-amber-500/50 transition-all active:scale-95"
                                        >
                                            <span className="text-xl font-medium">-</span>
                                        </button>

                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
                                                {transpose > 0 ? `+${transpose}` : transpose}
                                            </span>
                                            <span className="text-xs text-zinc-500 mt-1">Semitones</span>
                                        </div>

                                        <button
                                            onClick={() => setTranspose(transpose + 1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 hover:bg-amber-500/20 hover:text-amber-500 border border-white/10 hover:border-amber-500/50 transition-all active:scale-95"
                                        >
                                            <span className="text-xl font-medium">+</span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Appearance Section */}
                            <section>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Appearance</h3>

                                {/* Font Size */}
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm text-zinc-300">Font Size</label>
                                        <span className="text-sm text-amber-500 font-mono">{fontSize}pt</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="40"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                                    />
                                </div>

                                {/* Highlight Color */}
                                <div className="mb-6 opacity-50 cursor-not-allowed filter grayscale" title="Available in future update"> {/* Disabled for now or implemented? Store supported it, so implementing. */}
                                    <label className="block text-sm text-zinc-300 mb-3">Highlight Color</label>
                                    <div className="flex gap-3">
                                        {highlightColors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setHighlightColor(color.value)}
                                                className={clsx(
                                                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900",
                                                    highlightColor === color.value
                                                        ? "border-white scale-110 shadow-[0_0_10px_currentColor]"
                                                        : "border-transparent opacity-70 hover:opacity-100"
                                                )}
                                                style={{ backgroundColor: color.hex, color: color.hex, boxShadow: highlightColor === color.value ? `0 0 10px ${color.hex}` : 'none' }}
                                                aria-label={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
                            <section>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Notation</h3>

                                {/* Minor Display */}
                                <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-4">
                                    <div className="p-4 border-b border-zinc-800">
                                        <label className="text-sm text-zinc-300">Minor Chord Notation</label>
                                    </div>
                                    <div className="flex bg-zinc-950 p-1 m-2 rounded-lg">
                                        {[
                                            { id: 'minus', label: 'Cm7-5' },
                                            { id: 'm', label: 'Cmm7b5' },
                                            { id: 'small', label: 'Cm7b5 (small)' } // Simplified labels for space
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setMinorDisplay(opt.id as any)}
                                                className={clsx(
                                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                                                    minorDisplay === opt.id
                                                        ? "bg-zinc-700 text-white shadow-sm"
                                                        : "text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* German B */}
                                <div
                                    className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                                    onClick={() => setUseGermanB(!useGermanB)}
                                >
                                    <div>
                                        <div className="text-sm text-zinc-200">German Notation</div>
                                        <div className="text-xs text-zinc-500">Use 'H' for B natural and 'B' for 'Bb'</div>
                                    </div>
                                    <div className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        useGermanB ? "bg-amber-600" : "bg-zinc-700"
                                    )}>
                                        <div className={clsx(
                                            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                                            useGermanB ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Behavior</h3>
                                {/* Highlight Toggle */}
                                <div
                                    className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                                    onClick={() => setHighlightingEnabled(!highlightingEnabled)}
                                >
                                    <div>
                                        <div className="text-sm text-zinc-200">Active Chord Highlight</div>
                                        <div className="text-xs text-zinc-500">Highlight the chord currently playing</div>
                                    </div>
                                    <div className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        highlightingEnabled ? "bg-amber-600" : "bg-zinc-700"
                                    )}>
                                        <div className={clsx(
                                            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                                            highlightingEnabled ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="animate-in slide-in-from-right-4 duration-300 fade-in text-center py-8">
                            <div className="w-20 h-20 mx-auto mb-6 rotate-3">
                                <img src="/logo.png" alt="jam logo" className="w-full h-full object-contain drop-shadow-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">jam</h3>
                            <p className="text-zinc-400 text-sm mb-8">
                                The ultimate jazz practice companion.
                            </p>

                            <div className="space-y-2 text-xs text-zinc-600 font-mono border-t border-white/5 pt-8">
                                <p>Version 0.1.0 (Alpha)</p>
                                <p>© 2026 YayDev</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
