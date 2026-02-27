import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Tag, Search, Check } from 'lucide-react';
import { Song } from '@/types/song';
import { useAppStore } from '@/store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { parseChordData, songToIRealString } from '@/lib/ireal';
import { LICENSED_SONGS, LicensedSong } from '@/data/licensedSongs';
import clsx from 'clsx';

interface ScoreEditorProps {
    song: Song;
    onClose: () => void;
}

export const ScoreEditor: React.FC<ScoreEditorProps> = ({ song, onClose }) => {
    const { myScores, addMyScore, updateMyScore, userProfile } = useAppStore();

    // Check if this song is already one of "My Scores"
    const isMyScore = myScores.some(s => s.id === song.id);

    const [title, setTitle] = useState(isMyScore ? song.title : `${song.title} (My Arrange)`);
    const [composer, setComposer] = useState(song.composer);
    const [arranger, setArranger] = useState(song.arranger || (isMyScore ? '' : userProfile.displayName));
    const [style, setStyle] = useState(song.style);
    const [defaultKey, setDefaultKey] = useState(song.defaultKey);
    const [tempo, setTempo] = useState(song.defaultTempo.toString());
    const [rawString, setRawString] = useState(songToIRealString(song));
    const [error, setError] = useState('');

    // Song tag (licensed song association)
    const [songTag, setSongTag] = useState(song.songTag || '');
    const [tagSearch, setTagSearch] = useState('');
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const tagRef = useRef<HTMLDivElement>(null);

    // Close tag dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
                setShowTagDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTags = LICENSED_SONGS.filter(s =>
        s.label.toLowerCase().includes(tagSearch.toLowerCase())
    );

    const selectedTag = LICENSED_SONGS.find(s => s.id === songTag);

    const handleSave = () => {
        setError('');
        try {
            const parsedTempo = parseInt(tempo, 10) || 120;
            const sections = parseChordData(rawString);

            if (sections.length === 0) {
                setError('コード進行が正しく入力されていません。');
                return;
            }

            if (!songTag) {
                setError('楽曲タグを選択してください。契約楽曲のタグが必須です。');
                return;
            }

            const updatedSong: Song = {
                id: isMyScore ? song.id : uuidv4(),
                title,
                composer,
                arranger: arranger.trim() || undefined,
                style,
                defaultKey,
                defaultTempo: parsedTempo,
                songTag: songTag || undefined,
                sections
            };

            if (isMyScore) {
                updateMyScore(updatedSong.id, updatedSong);
            } else {
                addMyScore(updatedSong);
            }

            onClose();
        } catch (e) {
            setError('コードの解析に失敗しました。フォーマットを確認してください。');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm sm:p-4 animate-fade-in text-white font-sans">
            <div className="w-full h-[95vh] sm:h-[85vh] sm:max-w-2xl bg-[var(--app-surface-elevated)] sm:border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col relative animate-slide-up">

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-[var(--app-surface-elevated)] sticky top-0 z-10 shrink-0">
                    <button onClick={onClose} className="p-2 -ml-2 text-white hover:text-zinc-300 transition-colors">
                        <X size={26} />
                    </button>

                    <h2 className="font-bold text-[17px] tracking-wide">楽譜エディタ</h2>

                    <button
                        onClick={handleSave}
                        className="p-2 -mr-2 text-[var(--jam-red)] hover:text-[var(--jam-red-hover)] font-bold transition-colors flex items-center gap-1"
                    >
                        保存
                    </button>
                </header>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 flex flex-col gap-6">

                    {error && (
                        <div className="bg-[var(--jam-red)]/10 border border-[var(--jam-red)]/20 text-[var(--jam-red-hover)] px-4 py-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">曲名 Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">作曲者 Composer</label>
                            <input
                                type="text"
                                value={composer}
                                onChange={(e) => setComposer(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">作成者/アレンジ Arranger</label>
                            <input
                                type="text"
                                value={arranger}
                                onChange={(e) => setArranger(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors text-[var(--jam-red)]"
                            />
                        </div>

                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">スタイル Style</label>
                            <input
                                type="text"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">キー Key</label>
                            <input
                                type="text"
                                value={defaultKey}
                                onChange={(e) => setDefaultKey(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider">テンポ Tempo</label>
                            <input
                                type="number"
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-lg px-4 py-2.5 text-[15px] outline-none transition-colors font-mono"
                            />
                        </div>
                    </div>

                    {/* Song Tag (Licensed Song) */}
                    <div className="space-y-2" ref={tagRef}>
                        <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider flex items-center gap-1.5">
                            <Tag size={12} className="text-[var(--jam-red)]" />
                            楽曲タグ Song Tag
                            <span className="text-[10px] text-red-400 ml-1">必須</span>
                            <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full ml-auto font-normal normal-case">契約楽曲のみ</span>
                        </label>

                        {/* Selected tag display */}
                        {selectedTag ? (
                            <div className="flex items-center gap-2 bg-[var(--jam-red)]/10 border border-[var(--jam-red)]/30 rounded-xl px-4 py-2.5">
                                <Tag size={14} className="text-[var(--jam-red)] shrink-0" />
                                <span className="text-[14px] text-[var(--jam-red)] font-medium flex-1">{selectedTag.label}</span>
                                <button
                                    onClick={() => { setSongTag(''); setTagSearch(''); }}
                                    className="text-zinc-500 hover:text-white transition-colors p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={tagSearch}
                                    onChange={(e) => { setTagSearch(e.target.value); setShowTagDropdown(true); }}
                                    onFocus={() => setShowTagDropdown(true)}
                                    placeholder="楽曲名で検索..."
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-xl pl-10 pr-4 py-2.5 text-[15px] outline-none transition-colors"
                                />
                            </div>
                        )}

                        {/* Dropdown */}
                        {showTagDropdown && !selectedTag && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-h-[200px] overflow-y-auto shadow-xl">
                                {filteredTags.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-zinc-500 text-center">該当する楽曲がありません</div>
                                ) : (
                                    filteredTags.map((ls) => (
                                        <button
                                            key={ls.id}
                                            onClick={() => {
                                                setSongTag(ls.id);
                                                setTagSearch('');
                                                setShowTagDropdown(false);
                                            }}
                                            className={clsx(
                                                "w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 border-b border-zinc-800/50 last:border-0",
                                                songTag === ls.id && "text-[var(--jam-red)]"
                                            )}
                                        >
                                            <Tag size={12} className="text-zinc-600 shrink-0" />
                                            <span className="flex-1">
                                                <span className="text-white font-medium">{ls.title}</span>
                                                <span className="text-zinc-500 ml-1.5">— {ls.composer}</span>
                                            </span>
                                            {songTag === ls.id && <Check size={14} className="text-[var(--jam-red)]" />}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Moderation Warning */}
                    <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
                        <span className="text-amber-400 text-sm mt-0.5">⚠</span>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                            楽曲タグと内容が一致しない投稿は<span className="text-amber-400 font-medium">運営により削除</span>されます。
                            タグに対応する楽曲のアレンジのみ投稿してください。
                        </p>
                    </div>

                    {/* Chord Data */}
                    <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
                        <label className="text-[12px] font-bold text-zinc-500 px-1 uppercase tracking-wider flex justify-between items-center">
                            <span>コード進行 Chord Progression</span>
                            <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">iReal Pro 形式</span>
                        </label>
                        <textarea
                            value={rawString}
                            onChange={(e) => setRawString(e.target.value)}
                            className="w-full flex-1 bg-zinc-900 border border-zinc-800 focus:border-[var(--jam-red)] rounded-xl p-4 text-[16px] outline-none transition-colors resize-none font-mono leading-relaxed"
                            placeholder="*A [Cm7 | F7 | Bbmaj7 | Ebmaj7 ]"
                            spellCheck={false}
                        />
                        <p className="text-[12px] text-zinc-500 px-1 leading-snug">
                            記号リファレンス: <code className="text-zinc-300 bg-zinc-800 px-1 rounded">*A</code> (セクション), <code className="text-zinc-300 bg-zinc-800 px-1 rounded">|</code> (小節線), <code className="text-zinc-300 bg-zinc-800 px-1 rounded">[ ]</code> (反復記号なし), <code className="text-zinc-300 bg-zinc-800 px-1 rounded">{'{'}{'}'}</code> (反復記号)
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
