import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Song } from '@/types/song';
import { useAppStore } from '@/store/useAppStore';
import { DrumPicker } from './DrumPicker';
import { ROOT_MAP } from '@/lib/music-theory/chords';

const COMMON_STYLES = ['Swing', 'Bossa Nova', 'Ballad', 'Even 8ths', 'Waltzes', 'Latin', 'Funk', 'Pop'];
const COMMON_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const TEMPOS = Array.from({ length: 261 }, (_, i) => (40 + i).toString()); // 40 to 300
const REPEATS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20', 'Infinite'];

interface SongInfoModalProps {
    song: Song;
    onClose: () => void;
}

export const SongInfoModal: React.FC<SongInfoModalProps> = ({ song, onClose }) => {
    const { setTempo, setTranspose, setLoopCount, loopCount, tempo, transpose } = useAppStore();

    // Calculate current displayed key from original key + transpose
    const originalSemitone = ROOT_MAP[song.defaultKey] ?? 0;
    const currentSemitone = ((originalSemitone + transpose) % 12 + 12) % 12;
    const currentKey = COMMON_KEYS.find(k => ROOT_MAP[k] === currentSemitone) ?? song.defaultKey;

    const [style, setStyle] = useState(song.style);
    const [key, setKey] = useState(currentKey);
    const [tempoVal, setTempoVal] = useState(tempo.toString());
    const [repeats, setRepeats] = useState<string>(loopCount === 0 ? 'Infinite' : loopCount.toString());

    const handleApply = () => {
        // Tempo: set store only (temporary)
        const parsedTempo = parseInt(tempoVal, 10) || 120;
        setTempo(parsedTempo);

        // Key: compute semitone diff from song's original key and set transpose
        const newSemitone = ROOT_MAP[key] ?? 0;
        const diff = ((newSemitone - originalSemitone) % 12 + 12) % 12;
        // Use shortest path (-6 to +6)
        setTranspose(diff > 6 ? diff - 12 : diff);

        // Repeats
        const parsedRepeats = repeats === 'Infinite' ? 0 : parseInt(repeats, 10) || 3;
        setLoopCount(parsedRepeats);

        onClose();
    };


    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in text-white font-sans" onClick={onClose}>
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col relative animate-slide-up" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-red-500" />
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
                            value={tempoVal}
                            onChange={(val) => setTempoVal(val as string)}
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
                        onClick={handleApply}
                        className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors text-sm"
                    >
                        完了
                    </button>
                </div>
            </div>
        </div>
    );
};
