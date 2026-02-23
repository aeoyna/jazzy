import React, { useState } from 'react';
import { X, Info, Save } from 'lucide-react';
import { Song } from '@/types/song';
import { useAppStore } from '@/store/useAppStore';
import { DrumPicker } from './DrumPicker';

const COMMON_STYLES = ['Swing', 'Bossa Nova', 'Ballad', 'Even 8ths', 'Waltzes', 'Latin', 'Funk', 'Pop'];
const COMMON_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const TEMPOS = Array.from({ length: 261 }, (_, i) => (40 + i).toString()); // 40 to 300
const REPEATS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20', 'Infinite'];

interface SongInfoModalProps {
    song: Song;
    onClose: () => void;
}

export const SongInfoModal: React.FC<SongInfoModalProps> = ({ song, onClose }) => {
    const { updateMyScore, myScores, currentSong, setSong, loopCount, setLoopCount } = useAppStore();

    const [style, setStyle] = useState(song.style);
    const [key, setKey] = useState(song.defaultKey);
    const [tempo, setTempo] = useState(song.defaultTempo.toString());
    const [repeats, setRepeats] = useState<string>(loopCount === 0 ? 'Infinite' : loopCount.toString());

    const handleSave = () => {
        const parsedTempo = parseInt(tempo, 10) || 120;
        const updates = { style, defaultKey: key, defaultTempo: parsedTempo };

        const parsedRepeats = repeats === 'Infinite' ? 0 : parseInt(repeats, 10) || 3;
        setLoopCount(parsedRepeats);

        const isMyScore = myScores.some(s => s.id === song.id);
        if (isMyScore) {
            updateMyScore(song.id, updates);
        } else if (currentSong?.id === song.id) {
            // If it's a built-in song currently playing, we temporarily update it in state
            // Note: Ideally, modifying built-in songs should fork them to myScores, but for this quick edit we update current playing state.
            setSong({ ...song, ...updates });
            // And also update tempo in store directly
            useAppStore.getState().setTempo(parsedTempo);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in text-white font-sans" onClick={onClose}>
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col relative animate-slide-up" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-amber-500" />
                        <h2 className="font-bold text-[17px] tracking-wide text-zinc-100">曲の詳細 Info</h2>
                    </div>
                    <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </header>

                {/* Content */}
                <div className="p-5 flex flex-col gap-5">
                    <div>
                        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">曲名 Title</div>
                        <div className="text-[17px] font-medium text-zinc-100">{song.title}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">作曲者 Composer</div>
                            <div className="text-[15px] text-zinc-300">{song.composer}</div>
                        </div>
                        {song.arranger && (
                            <div>
                                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">アレンジ Arranger</div>
                                <div className="text-[15px] text-zinc-300">{song.arranger}</div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                        <DrumPicker
                            options={COMMON_STYLES}
                            value={COMMON_STYLES.includes(style) ? style : COMMON_STYLES[0]}
                            onChange={(val) => setStyle(val as string)}
                            label="STYLE"
                            itemHeight={34}
                            loop={true}
                        />
                        <DrumPicker
                            options={COMMON_KEYS}
                            value={COMMON_KEYS.includes(key) ? key : COMMON_KEYS[0]}
                            onChange={(val) => setKey(val as string)}
                            label="KEY"
                            itemHeight={34}
                            loop={true}
                        />
                        <DrumPicker
                            options={TEMPOS}
                            value={tempo}
                            onChange={(val) => setTempo(val as string)}
                            label="TEMPO"
                            itemHeight={34}
                        />
                        <DrumPicker
                            options={REPEATS}
                            value={repeats}
                            onChange={(val) => setRepeats(val as string)}
                            label="REPEATS"
                            itemHeight={34}
                        />
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-zinc-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-zinc-400 hover:text-white font-medium transition-colors text-sm"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors text-sm flex items-center gap-1"
                    >
                        <Save size={16} />
                        完了
                    </button>
                </div>
            </div>
        </div>
    );
};
