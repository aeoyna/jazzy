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
        highlightingEnabled, setHighlightingEnabled,
        theme, setTheme
    } = useAppStore();

    // Dragging State
    const { position, handleMouseDown, isDragging } = useDraggable();

    const highlightColors = [
        { name: 'テーマ', value: 'Theme', hex: '#b83c58' },
        { name: 'グリーン', value: 'Green', hex: '#4ade80' },
        { name: 'ブルー', value: 'Blue', hex: '#60a5fa' },
        { name: 'ピンク', value: 'Pink', hex: '#f472b6' },
        { name: 'オレンジ', value: 'Orange', hex: '#fb923c' }
    ];

    const TabButton = ({ id, icon: Icon, label }: { id: Tab; icon: any; label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={clsx(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative",
                activeTab === id ? "text-[var(--jam-red)]" : "text-[var(--app-fg-dim)] hover:text-[var(--app-fg)]"
            )}
        >
            <Icon size={16} />
            {label}
            {activeTab === id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--jam-red)] shadow-[0_0_8px_rgba(147,46,68,0.5)]" />
            )}
        </button>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={clsx(
                    "modal-container w-[500px] max-w-[95vw] flex flex-col",
                    isDragging ? "cursor-grabbing" : ""
                )}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Draggable Area */}
                <div
                    className="modal-header cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="pointer-events-none">
                        <SettingsIcon size={20} className="text-[var(--jam-red)]" />
                        設定
                    </h2>
                    <div className="flex gap-2">
                        <GripHorizontal size={18} className="text-zinc-600 opacity-50" />
                        <button
                            onClick={onClose}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="modal-close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-2 border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)]">
                    <TabButton id="display" icon={Monitor} label="表示" />
                    <TabButton id="general" icon={SettingsIcon} label="全般" />
                    <TabButton id="about" icon={Info} label="情報" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[var(--app-surface)]">
                    {activeTab === 'display' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 fade-in">
                            {/* Theme Section */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--app-fg-dim)] uppercase tracking-wider mb-4">テーマ</h3>
                                <div className="bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] overflow-hidden">
                                    <div className="flex p-1">
                                        {[
                                            { id: 'dark', label: 'ダークモード' },
                                            { id: 'light', label: 'ライトモード' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setTheme(opt.id as any)}
                                                className={clsx(
                                                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                                    theme === opt.id
                                                        ? "bg-[var(--app-surface-elevated)] text-[var(--app-fg)] shadow-sm"
                                                        : "text-[var(--app-fg-dim)] hover:text-[var(--app-fg)]"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Transpose Section */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--app-fg-dim)] uppercase tracking-wider mb-4">キー</h3>
                                <div className="bg-[var(--app-bg)] rounded-xl p-5 border border-[var(--app-border)]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-[var(--app-fg-dim)]">移調</div>
                                        <div className="text-xs px-2 py-1 rounded bg-black/30 text-[var(--jam-red)] font-mono border border-[var(--jam-red)]/20">
                                            Original: {currentSong?.defaultKey || 'C'}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => setTranspose(transpose - 1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 hover:bg-red-500/20 hover:text-[var(--jam-red)] border border-white/10 hover:border-red-500/50 transition-all active:scale-95"
                                        >
                                            <span className="text-xl font-medium">-</span>
                                        </button>

                                        <div className="flex-1 flex flex-col items-center">
                                            <span className="text-3xl font-bold text-[var(--app-fg)] tabular-nums tracking-tight">
                                                {transpose > 0 ? `+${transpose}` : transpose}
                                            </span>
                                            <span className="text-xs text-[var(--app-fg-dim)] mt-1">半音</span>
                                        </div>

                                        <button
                                            onClick={() => setTranspose(transpose + 1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 hover:bg-red-500/20 hover:text-[var(--jam-red)] border border-white/10 hover:border-red-500/50 transition-all active:scale-95"
                                        >
                                            <span className="text-xl font-medium">+</span>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Appearance Section */}
                            <section>
                                <h3 className="text-xs font-bold text-[var(--app-fg-dim)] uppercase tracking-wider mb-4">外観</h3>

                                {/* Font Size */}
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm text-[var(--app-fg-dim)]">フォントサイズ</label>
                                        <span className="text-sm text-red-500 font-mono">{fontSize}pt</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="40"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)] hover:accent-[var(--jam-red-hover)]"
                                    />
                                </div>

                                {/* Highlight Color */}
                                <div className="mb-6">
                                    <label className="block text-sm text-[var(--app-fg-dim)] mb-3">ハイライトカラー</label>
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
                                <h3 className="text-xs font-bold text-[var(--app-fg-dim)] uppercase tracking-wider mb-4">記譜</h3>

                                {/* Minor Display */}
                                <div className="bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] overflow-hidden mb-4">
                                    <div className="p-4 border-b border-[var(--app-border)]">
                                        <label className="text-sm text-[var(--app-fg-dim)]">マイナーコードの表記</label>
                                    </div>
                                    <div className="flex bg-[var(--app-surface-elevated)] p-1 m-2 rounded-lg">
                                        {[
                                            { id: 'minus', label: '-' },
                                            { id: 'm', label: 'm' },
                                            { id: 'small', label: 'Small' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setMinorDisplay(opt.id as any)}
                                                className={clsx(
                                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                                                    minorDisplay === opt.id
                                                        ? "bg-[var(--app-bg)] text-[var(--app-fg)] shadow-sm"
                                                        : "text-[var(--app-fg-dim)] hover:text-[var(--app-fg)]"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* German B */}
                                <div
                                    className="flex items-center justify-between p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] hover:bg-[var(--app-surface-elevated)] transition cursor-pointer"
                                    onClick={() => setUseGermanB(!useGermanB)}
                                >
                                    <div>
                                        <div className="text-sm text-[var(--app-fg)]">ドイツ式記譜</div>
                                        <div className="text-xs text-[var(--app-fg-dim)]">BをH、BbをBと表記します</div>
                                    </div>
                                    <div className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        useGermanB ? "bg-[var(--jam-red)]" : "bg-zinc-700"
                                    )}>
                                        <div className={clsx(
                                            "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                                            useGermanB ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-[var(--app-fg-dim)] uppercase tracking-wider mb-4">動作</h3>
                                {/* Highlight Toggle */}
                                <div
                                    className="flex items-center justify-between p-4 bg-[var(--app-bg)] rounded-xl border border-[var(--app-border)] hover:bg-[var(--app-surface-elevated)] transition cursor-pointer"
                                    onClick={() => setHighlightingEnabled(!highlightingEnabled)}
                                >
                                    <div>
                                        <div className="text-sm text-[var(--app-fg)]">再生中のハイライト</div>
                                        <div className="text-xs text-[var(--app-fg-dim)]">現在演奏されているコードを強調表示します</div>
                                    </div>
                                    <div className={clsx(
                                        "w-11 h-6 rounded-full transition-colors relative",
                                        highlightingEnabled ? "bg-[var(--jam-red)]" : "bg-zinc-700"
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
                            <div className="w-20 h-20 bg-gradient-to-br from-[var(--jam-red)] to-[var(--jam-red-dark)] rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6 rotate-3">
                                <Music size={40} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--app-fg)] mb-2">JAM</h3>
                            <p className="text-[var(--app-fg-dim)] text-sm mb-8 px-4">
                                究極のジャズ練習パートナー
                            </p>

                            <div className="space-y-2 text-xs text-[var(--app-fg-dim)] font-mono border-t border-white/5 pt-8">
                                <p>Version 0.2.0 (Alpha)</p>
                                <p>© 2026 JAM Team</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
