import React, { useState } from 'react';
import { X, Music, GripHorizontal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { parseIRealUri } from '@/lib/ireal';
import { Song } from '@/types/song';
import { useDraggable } from '@/hooks/useDraggable';
import clsx from 'clsx';

interface ImportSongModalProps {
    onClose: () => void;
}

export const ImportSongModal: React.FC<ImportSongModalProps> = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { addImportedSong } = useAppStore();

    // Dragging
    const { position, handleMouseDown, isDragging } = useDraggable();

    const handleImport = () => {
        setError(null);
        const trimmed = input.trim();

        if (!trimmed) {
            return;
        }

        // Rudimentary check
        if (!trimmed.startsWith('irealbook://')) {
            setError('Invalid format. Must start with "irealbook://"');
            return;
        }

        const song = parseIRealUri(trimmed);
        if (song) {
            addImportedSong(song);
            onClose();
        } else {
            setError('Failed to parse song data. Please check the format.');
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className={clsx(
                    "bg-red-900 border border-red-800 rounded-lg w-11/12 max-w-md p-6 shadow-2xl transition-transform duration-75",
                    isDragging ? "cursor-grabbing" : ""
                )}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    backgroundColor: '#000000'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="flex justify-between items-center mb-4 cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                >
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 pointer-events-none">
                        <Music className="w-5 h-5 text-cyan-400" />
                        Import Song
                    </h2>
                    <div className="flex items-center gap-2">
                        <GripHorizontal size={20} className="text-zinc-600 opacity-50" />
                        <button
                            onClick={onClose}
                            onMouseDown={e => e.stopPropagation()}
                            className="text-zinc-400 hover:text-white"
                        >
                            <X />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">
                            Paste iReal Pro URI (irealbook://...)
                        </label>
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-zinc-300 font-mono text-xs focus:outline-none focus:border-cyan-500 min-h-[150px]"
                            placeholder="irealbook://Title=Composer=..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900/50">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded text-zinc-300 hover:bg-zinc-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            className="px-4 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim()}
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
