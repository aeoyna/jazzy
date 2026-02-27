import { useState } from 'react';
import { songLibrary } from '@/data/songs';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';
import { AudioEngine } from '@/lib/audio/AudioEngine';
import { X, Import, GripHorizontal } from 'lucide-react';
import { ImportSongModal } from './ImportSongModal';
import { useDraggable } from '@/hooks/useDraggable';

export const SongList: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { currentSong, setSong, setIsPlaying, importedSongs } = useAppStore();
    const [showImport, setShowImport] = useState(false);

    // Dragging
    const { position, handleMouseDown, isDragging } = useDraggable();

    const handleSelect = (song: typeof songLibrary[0]) => {
        AudioEngine.getInstance().stop();
        setSong(song);
        setIsPlaying(false);
        onClose();
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div
                    className={clsx(
                        "modal-container w-11/12 max-w-md max-h-[80vh] flex flex-col",
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
                        <h2 className="pointer-events-none">Song Library</h2>
                        <div className="flex gap-2 items-center" onMouseDown={e => e.stopPropagation()}>
                            <button
                                onClick={() => setShowImport(true)}
                                className="bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-white/10 transition-colors"
                            >
                                <Import size={14} /> Import
                            </button>
                            <GripHorizontal size={18} className="text-zinc-600 opacity-50 pointer-events-none" />
                            <button onClick={onClose} className="modal-close">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 pt-4">
                        {songLibrary.map((song) => (
                            <button
                                key={song.id}
                                onClick={() => handleSelect(song)}
                                className={clsx(
                                    "w-full flex flex-col items-start rounded-xl p-3 text-left transition mb-1",
                                    currentSong?.id === song.id
                                        ? "border border-[var(--jam-red)]/30 text-[var(--jam-red)]"
                                        : "text-zinc-300 hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <span className="font-bold text-lg">{song.title}</span>
                                <span className="text-sm text-zinc-500">{song.composer} • {song.style}</span>
                            </button>
                        ))}

                        {importedSongs.length > 0 && (
                            <>
                                <div className="mt-4 mb-2 px-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    Imported Songs
                                </div>
                                {importedSongs.map((song) => (
                                    <button
                                        key={song.id}
                                        onClick={() => handleSelect(song)}
                                        className={clsx(
                                            "w-full flex flex-col items-start rounded-lg p-3 text-left transition mb-1",
                                            currentSong?.id === song.id
                                                ? "bg-cyan-900/30 text-cyan-400 border border-cyan-700/50"
                                                : "text-zinc-300 hover:bg-zinc-800"
                                        )}
                                    >
                                        <span className="font-bold text-lg">{song.title}</span>
                                        <span className="text-sm text-zinc-500">{song.composer} • {song.style}</span>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {showImport && <ImportSongModal onClose={() => setShowImport(false)} />}
        </>
    );
};
