import React, { useState, useRef } from 'react';
import { X, Music, GripHorizontal, Upload } from 'lucide-react';
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
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addImportedSong } = useAppStore();

    // Dragging
    const { position, handleMouseDown, isDragging } = useDraggable();

    const processUri = (uri: string) => {
        const song = parseIRealUri(uri);
        if (song) {
            addImportedSong(song);
            onClose();
        } else {
            setError('Failed to parse song data. Please check the format.');
        }
    };

    const handleImportText = () => {
        setError(null);
        const trimmed = input.trim();

        if (!trimmed) {
            return;
        }

        if (!trimmed.startsWith('irealbook://')) {
            setError('Invalid format. Must start with "irealbook://"');
            return;
        }

        processUri(trimmed);
    };

    const handleFile = (file: File) => {
        setError(null);
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
            setError('Please upload a valid HTML file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            // The iReal Pro export typically forms a link like <a href="irealbook://...">
            const match = content.match(/href="(irealbook:\/\/[^"]+)"/i) || content.match(/(irealbook:\/\/[^\s"'><]+)/i);

            if (match && match[1]) {
                const uri = match[1];
                // Decode HTML entities if any (like &amp; to &)
                const decodedUri = uri.replace(/&amp;/g, '&');
                processUri(decodedUri);
            } else {
                setError('No valid iReal Pro link (irealbook://) found in the HTML file.');
            }
        };
        reader.onerror = () => setError('Failed to read the file.');
        reader.readAsText(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
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

                <div className="space-y-6">
                    {/* Drag and Drop Area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={clsx(
                            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
                            isDragOver ? "border-cyan-500 bg-cyan-900/20" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
                        )}
                    >
                        <Upload className={clsx("w-8 h-8 mb-3", isDragOver ? "text-cyan-400" : "text-zinc-500")} />
                        <p className="text-zinc-300 font-medium mb-1">Click or drag HTML file here</p>
                        <p className="text-xs text-zinc-500">Finds irealbook:// links inside the file</p>
                        <input
                            type="file"
                            accept=".html,.htm,text/html"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    handleFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-zinc-800"></div>
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">OR PASTE URI</span>
                        <div className="flex-1 h-px bg-zinc-800"></div>
                    </div>

                    <div>
                        <textarea
                            className="w-full bg-zinc-950 border border-zinc-700 rounded p-3 text-zinc-300 font-mono text-xs focus:outline-none focus:border-cyan-500 min-h-[100px]"
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
                            onClick={handleImportText}
                            className="px-4 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim()}
                        >
                            Import URI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
