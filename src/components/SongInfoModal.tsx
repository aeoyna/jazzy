import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Song } from '@/types/song';
import { useAppStore } from '@/store/useAppStore';
import { DrumPicker } from './DrumPicker';

const COMMON_STYLES = ['Swing', 'Bossa Nova', 'Ballad', 'Even 8ths', 'Waltzes', 'Latin', 'Funk', 'Pop'];
const COMMON_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const TEMPOS = Array.from({ length: 261 }, (_, i) => (40 + i).toString()); // 40 to 300
const REPEATS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '20', 'Infinite'];

const KEY_SEMITONES: Record<string, number> = {
    'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5,
    'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11,
};

function getSemitone(key: string): number {
    const match = key.match(/^([A-G][b#]?)/);
    return match ? (KEY_SEMITONES[match[1]] ?? 0) : 0;
}

interface SongInfoModalProps {
    song: Song;
    onClose: () => void;
}

export const SongInfoModal: React.FC<SongInfoModalProps> = ({ song, onClose }) => {
    const { setTempo, setTranspose, transpose, loopCount, setLoopCount, tempo } = useAppStore();

    // Compute the currently active key from the base key + current transpose
    const baseNote = getSemitone(song.defaultKey);
    const currentNoteIndex = ((baseNote + transpose) % 12 + 12) % 12;
    const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    const initialKey = NOTES[currentNoteIndex];

    const [style, setStyle] = useState(song.style);
    const [key, setKey] = useState(COMMON_KEYS.includes(initialKey) ? initialKey : COMMON_KEYS[0]);
    const [tempoStr, setTempoStr] = useState(tempo.toString());
    const [repeats, setRepeats] = useState<string>(loopCount === 0 ? 'Infinite' : loopCount.toString());

    // Key change → compute transposition in semitones from original key and apply immediately
    const handleKeyChange = (val: string) => {
        setKey(val);
        const diff = getSemitone(val) - getSemitone(song.defaultKey);
        const semitones = ((diff % 12) + 12) % 12;
        // Use -6~+5 range for minimal transposition
        setTranspose(semitones > 6 ? semitones - 12 : semitones);
    };

    // Tempo change → apply to store immediately
    const handleTempoChange = (val: string) => {
        setTempoStr(val);
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) setTempo(parsed);
    };

    // Repeats change → apply to store immediately
    const handleRepeatsChange = (val: string) => {
        setRepeats(val);
        const parsed = val === 'Infinite' ? 0 : parseInt(val, 10) || 3;
        setLoopCount(parsed);
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in text-white font-sans"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col relative animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
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
                            onChange={(val) => handleKeyChange(val as string)}
                            label="KEY"
                            itemHeight={34}
                            loop={true}
                        />
                        <DrumPicker
                            options={TEMPOS}
                            value={tempoStr}
                            onChange={(val) => handleTempoChange(val as string)}
                            label="TEMPO"
                            itemHeight={34}
                        />
                        <DrumPicker
                            options={REPEATS}
                            value={repeats}
                            onChange={(val) => handleRepeatsChange(val as string)}
                            label="REPEATS"
                            itemHeight={34}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold transition-colors text-sm"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};
