import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@/hooks/useDraggable';
import clsx from 'clsx';

interface MixerProps {
    onClose: () => void;
}

export const Mixer: React.FC<MixerProps> = ({ onClose }) => {
    const { tempo, setTempo, masterVolume, setMasterVolume } = useAppStore();

    // Dragging
    const { position, handleMouseDown, isDragging } = useDraggable();

    const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTempo = parseInt(e.target.value, 10);
        setTempo(newTempo);
        import('tone').then(Tone => {
            Tone.Transport.bpm.rampTo(newTempo, 0.1);
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className={clsx(
                    "bg-red-900 border border-red-800 rounded-lg p-6 w-80 shadow-2xl transition-transform duration-75",
                    isDragging ? "cursor-grabbing" : ""
                )}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    backgroundColor: '#000000'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="flex justify-between items-center mb-6 cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="text-xl font-bold text-white pointer-events-none">Mixer</h2>
                    <div className="flex items-center gap-2">
                        <GripHorizontal size={20} className="text-zinc-600 opacity-50" />
                        <button
                            onClick={onClose}
                            onMouseDown={e => e.stopPropagation()}
                            className="text-zinc-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Tempo Control */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-cyan-500 mb-2 uppercase tracking-wide">Tempo ({tempo} BPM)</label>
                    <input
                        type="range"
                        min="40"
                        max="300"
                        value={tempo}
                        onChange={handleTempoChange}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                {/* Master Volume (Mock for MVP functionality, would hook up to Gain node) */}
                {/* <div className="mb-6">
           <label className="block text-sm font-bold text-cyan-500 mb-2 uppercase tracking-wide">Master Volume</label>
           <input
             type="range"
             min="-60"
             max="0"
             defaultValue={-10}
             className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
           />
        </div> */}

                <p className="text-xs text-zinc-500 text-center mt-4">More mixer controls coming soon...</p>
            </div>
        </div>
    );
};
