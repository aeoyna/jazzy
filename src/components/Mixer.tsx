import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';
import clsx from 'clsx';

interface MixerProps {
    onClose: () => void;
}

export const Mixer: React.FC<MixerProps> = ({ onClose }) => {
    const { masterVolume, setMasterVolume, instrumentVolumes, setInstrumentVolume } = useAppStore();

    // Dragging
    const { position, handleMouseDown, isDragging } = useDraggable();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={clsx(
                    "modal-container w-80 p-6 flex flex-col",
                    isDragging ? "cursor-grabbing" : ""
                )}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="modal-header cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="pointer-events-none">Mixer</h2>
                    <div className="flex items-center gap-2">
                        <GripHorizontal size={18} className="text-zinc-600 opacity-50" />
                        <button
                            onClick={onClose}
                            onMouseDown={e => e.stopPropagation()}
                            className="modal-close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Instrument Volumes */}
                <div className="space-y-4">
                    {/* Piano */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-[var(--jam-red)] uppercase tracking-wide">Piano</label>
                            <span className="text-xs text-zinc-400">{Math.round(instrumentVolumes.piano + 60)}%</span>
                        </div>
                        <input
                            type="range"
                            min="-60"
                            max="0"
                            value={instrumentVolumes.piano}
                            onChange={(e) => {
                                const vol = parseInt(e.target.value, 10);
                                setInstrumentVolume('piano', vol);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setInstrumentVolume('piano', vol);
                                });
                            }}
                            className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                        />
                    </div>

                    {/* Bass */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-[var(--jam-red)] uppercase tracking-wide">Bass</label>
                            <span className="text-xs text-zinc-400">{Math.round(instrumentVolumes.bass + 60)}%</span>
                        </div>
                        <input
                            type="range"
                            min="-60"
                            max="0"
                            value={instrumentVolumes.bass}
                            onChange={(e) => {
                                const vol = parseInt(e.target.value, 10);
                                setInstrumentVolume('bass', vol);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setInstrumentVolume('bass', vol);
                                });
                            }}
                            className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                        />
                    </div>

                    {/* Drums */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-[var(--jam-red)] uppercase tracking-wide">Drums</label>
                            <span className="text-xs text-zinc-400">{Math.round(instrumentVolumes.drums + 60)}%</span>
                        </div>
                        <input
                            type="range"
                            min="-60"
                            max="0"
                            value={instrumentVolumes.drums}
                            onChange={(e) => {
                                const vol = parseInt(e.target.value, 10);
                                setInstrumentVolume('drums', vol);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setInstrumentVolume('drums', vol);
                                });
                            }}
                            className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                        />
                    </div>

                    {/* Metronome */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-[var(--jam-red)] uppercase tracking-wide">Metronome</label>
                            <span className="text-xs text-zinc-400">{Math.round(instrumentVolumes.metronome + 60)}%</span>
                        </div>
                        <input
                            type="range"
                            min="-60"
                            max="0"
                            value={instrumentVolumes.metronome}
                            onChange={(e) => {
                                const vol = parseInt(e.target.value, 10);
                                setInstrumentVolume('metronome', vol);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setInstrumentVolume('metronome', vol);
                                });
                            }}
                            className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                        />
                    </div>

                    {/* Reverb */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-[var(--jam-red)] uppercase tracking-wide">Reverb</label>
                            <span className="text-xs text-zinc-400">{Math.round(useAppStore.getState().reverbWet * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={useAppStore.getState().reverbWet * 100}
                            onChange={(e) => {
                                const valStr = e.target.value;
                                const wet = parseInt(valStr, 10) / 100;
                                useAppStore.getState().setReverbWet(wet);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setReverbWet(wet);
                                });
                            }}
                            className="w-full h-2 bg-[var(--app-border)] rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                        />
                    </div>
                </div>

                {/* Gate Effect */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-[var(--jam-red)] uppercase tracking-wide">Gate Effect</label>
                        <button
                            onClick={() => {
                                const newEnabled = !useAppStore.getState().gateEnabled;
                                useAppStore.getState().setGateEnabled(newEnabled);
                                import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                    AudioEngine.getInstance().setGateParams(newEnabled, useAppStore.getState().gateThreshold);
                                });
                            }}
                            className={clsx(
                                "w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out flex shadow-inner",
                                useAppStore.getState().gateEnabled ? "bg-[var(--jam-red)]" : "bg-[var(--app-border)]"
                            )}
                        >
                            <div
                                className={clsx(
                                    "w-3 h-3 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out",
                                    useAppStore.getState().gateEnabled ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </button>
                    </div>
                    {useAppStore.getState().gateEnabled && (
                        <div className="mt-3">
                            <div className="flex justify-between mb-1">
                                <label className="text-xs text-zinc-400">Threshold</label>
                                <span className="text-xs text-zinc-400">{useAppStore.getState().gateThreshold} dB</span>
                            </div>
                            <input
                                type="range"
                                min="-100"
                                max="0"
                                value={useAppStore.getState().gateThreshold}
                                onChange={(e) => {
                                    const threshold = parseInt(e.target.value, 10);
                                    useAppStore.getState().setGateThreshold(threshold);
                                    import('@/lib/audio/AudioEngine').then(({ AudioEngine }) => {
                                        AudioEngine.getInstance().setGateParams(useAppStore.getState().gateEnabled, threshold);
                                    });
                                }}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[var(--jam-red)]"
                            />
                        </div>
                    )}
                </div>

                <p className="text-xs text-zinc-500 text-center mt-6">その他の設定は順次追加予定...</p>
            </div>
        </div>
    );
};
