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
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
                <div
                    className={clsx(
                        "bg-zinc-950 border border-zinc-800 rounded-lg w-11/12 max-w-md max-h-[80vh] flex flex-col shadow-2xl transition-transform duration-75",
                        isDragging ? "cursor-grabbing" : ""
                    )}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        backgroundColor: '#000000'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div
                        className="flex justify-between items-center p-4 border-b border-zinc-800 cursor-grab active:cursor-grabbing select-none"
                        onMouseDown={handleMouseDown}
                    >
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 pointer-events-none">
                            Song Library
                        </h2>
                        <div className="flex gap-2 items-center">
                            <GripHorizontal size={20} className="text-zinc-600 mr-2 opacity-50" />
                            <div onMouseDown={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowImport(true)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-sm flex items-center gap-1 mr-2"
                                >
                                    <Import size={16} /> Import
                                </button>
                                <button onClick={onClose} className="text-zinc-400 hover:text-white">
                                    <X />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {songLibrary.map((song) => (
                            <button
                                key={song.id}
                                onClick={() => handleSelect(song)}
                                className={clsx(
                                    "w-full flex flex-col items-start rounded-lg p-3 text-left transition mb-1",
                                    currentSong?.id === song.id
                                        ? "bg-yellow-900/20 text-[#FFD700] border border-yellow-500/30"
                                        : "text-zinc-300 hover:bg-zinc-800"
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
                                                ? "bg-yellow-900/20 text-[#FFD700] border border-yellow-500/30"
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
