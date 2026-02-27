import React, { useState } from 'react';
import { X, Music4, Microchip as Mic } from 'lucide-react';
import { Metronome } from './Metronome';
import { Tuner } from './Tuner';

interface ToolsModalProps {
    onClose: () => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'metronome' | 'tuner'>('metronome');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>
                        <Music4 className="text-[var(--jam-red)]" />
                        Practice Tools
                    </h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--app-border)] bg-[var(--app-surface-elevated)]">
                    <button
                        onClick={() => setActiveTab('metronome')}
                        className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'metronome'
                            ? 'border-[var(--jam-red)] text-[var(--jam-red)] bg-[var(--app-active-bg)]'
                            : 'border-transparent text-[var(--app-fg-dim)] hover:text-[var(--app-fg)]'
                            }`}
                    >
                        Metronome
                    </button>
                    <button
                        onClick={() => setActiveTab('tuner')}
                        className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'tuner'
                            ? 'border-[var(--jam-red)] text-[var(--jam-red)] bg-[var(--app-active-bg)]'
                            : 'border-transparent text-[var(--app-fg-dim)] hover:text-[var(--app-fg)]'
                            }`}
                    >
                        Tuner
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[400px]">
                    <div className="w-full">
                        {activeTab === 'metronome' ? <Metronome /> : <Tuner />}
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="modal-footer">
                    <p className="text-[10px] text-[var(--app-fg-dim)] uppercase tracking-widest font-bold">
                        {activeTab === 'metronome'
                            ? "Stay on beat with Tone.js"
                            : "Microphone access is required for pitch detection"}
                    </p>
                </div>
            </div>
        </div>
    );
};
