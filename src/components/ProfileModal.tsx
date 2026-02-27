import React, { useState } from 'react';
import {
    ChevronDown,
    Settings,
    X,
    Twitter,
    Bookmark,
    FileText,
    Mic,
    Globe,
    ListMusic,
    FolderHeart
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { EditProfileModal } from '@/components/EditProfileModal';

interface ProfileModalProps {
    onClose: () => void;
    onSettingsClick?: () => void; // Optional flow to original settings
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onSettingsClick }) => {
    const { userProfile, myScores, setSong } = useAppStore();
    const [activeTab, setActiveTab] = useState<'scores' | 'recordings'>('scores');
    const [activeSubTab, setActiveSubTab] = useState<'public' | 'saved' | 'list'>('public');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 animate-fade-in text-white font-sans">
            <div
                className="w-full h-[95vh] sm:h-[80vh] sm:max-w-md bg-zinc-950 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-slide-up"
            >
                {/* Drag Handle (Mobile) */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
                </div>

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-900">
                    <button onClick={onClose} className="p-2 -ml-2 text-white/90 hover:text-white">
                        <X size={26} />
                    </button>

                    <button className="flex items-center gap-1 font-bold text-[17px] tracking-wide active:opacity-70">
                        {userProfile.displayName}
                        <ChevronDown size={18} className="text-zinc-500" />
                    </button>

                    <button
                        onClick={onSettingsClick || onClose} // Default close or go to settings
                        className="p-2 -mr-2 text-white/90 hover:text-white"
                    >
                        <Settings size={24} />
                    </button>
                </header>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-24">

                    {/* Profile Info Section */}
                    <div className="flex flex-col items-center pt-6 px-4">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-800 overflow-hidden mb-3">
                            {/* Placeholder for real User Avatar */}
                            <div className="w-full h-full bg-gradient-to-tr from-[var(--jam-red)] to-[var(--jam-red-hover)] flex items-center justify-center text-3xl font-bold">
                                K
                            </div>
                        </div>

                        {/* Username */}
                        <h2 className="text-[15px] font-semibold text-zinc-100 mb-5">
                            @{userProfile.handle}
                        </h2>

                        {/* Stats Row */}
                        <div className="flex w-full justify-center gap-8 mb-5">
                            <div className="flex flex-col items-center cursor-pointer">
                                <span className="font-bold text-lg leading-tight text-white/90">12</span>
                                <span className="text-[13px] text-zinc-500 font-medium">楽譜</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="flex flex-col items-center cursor-pointer">
                                <span className="font-bold text-lg leading-tight text-white/90">34</span>
                                <span className="text-[13px] text-zinc-500 font-medium">録音</span>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="flex flex-col items-center cursor-pointer">
                                <span className="font-bold text-lg leading-tight text-white/90">8.5k</span>
                                <span className="text-[13px] text-zinc-500 font-medium">いいね</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mb-4 w-full justify-center">
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 transition-colors text-[15px] font-semibold py-2.5 px-10 rounded-xl border border-zinc-700"
                            >
                                プロフィールを編集
                            </button>
                            <button className="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-xl border border-zinc-700 transition-colors">
                                <Twitter size={20} className="text-white/90" />
                            </button>
                            <button className="bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-xl border border-zinc-700 transition-colors">
                                <Bookmark size={20} className="text-white/90" />
                            </button>
                        </div>

                        {/* Bio */}
                        <p className="text-[14px] text-center text-zinc-300 w-full px-6 mb-4 whitespace-pre-wrap">
                            {userProfile.bio}
                        </p>
                    </div>

                    {/* Tabs / Content Area */}
                    <div className="w-full border-t border-zinc-900 mt-2 flex flex-col min-h-[400px]">
                        {/* Tab Headers */}
                        <div className="flex w-full border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10 shrink-0">
                            <button
                                onClick={() => setActiveTab('scores')}
                                className={`flex-1 flex justify-center items-center py-3 relative ${activeTab === 'scores' ? 'text-[var(--jam-red)]' : 'text-zinc-600'}`}
                            >
                                <FileText size={24} strokeWidth={activeTab === 'scores' ? 2 : 1.5} />
                                {activeTab === 'scores' && <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[var(--jam-red)] rounded-t" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('recordings')}
                                className={`flex-1 flex justify-center items-center py-3 relative ${activeTab === 'recordings' ? 'text-[var(--jam-red)]' : 'text-zinc-600'}`}
                            >
                                <Mic size={24} strokeWidth={activeTab === 'recordings' ? 2 : 1.5} />
                                {activeTab === 'recordings' && <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[var(--jam-red)] rounded-t" />}
                            </button>
                        </div>

                        {/* Sub-Tab Headers */}
                        <div className="flex w-full border-b border-zinc-900 bg-zinc-950 px-2 py-2 sticky top-[53px] z-10 shrink-0 gap-2 overflow-x-auto hide-scrollbar">
                            <button
                                onClick={() => setActiveSubTab('public')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap ${activeSubTab === 'public'
                                    ? 'bg-[var(--jam-red)] text-white'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                                    }`}
                            >
                                <Globe size={14} /> 公開
                            </button>
                            <button
                                onClick={() => setActiveSubTab('saved')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap ${activeSubTab === 'saved'
                                    ? 'bg-[var(--jam-red)] text-white'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                                    }`}
                            >
                                <Bookmark size={14} /> 保存
                            </button>
                            <button
                                onClick={() => setActiveSubTab('list')}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap ${activeSubTab === 'list'
                                    ? 'bg-[var(--jam-red)] text-white'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                                    }`}
                            >
                                <ListMusic size={14} /> リスト
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex flex-col flex-1 items-center justify-center px-8 py-16 text-center">

                            {/* SCORES CONTENT */}
                            {activeTab === 'scores' && activeSubTab === 'public' && (
                                myScores.length === 0 ? (
                                    <div className="animate-fade-in flex flex-col items-center mt-8">
                                        <Globe size={48} className="mx-auto mb-4 text-zinc-600 opacity-50" />
                                        <h3 className="text-zinc-100 font-bold text-[17px] mb-2">公開中の楽譜はありません</h3>
                                        <p className="text-zinc-500 text-[14px] leading-snug mb-6 max-w-xs mx-auto">
                                            作成したコード進行を公開して、他のユーザーとセッションしましょう。
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="bg-[var(--jam-red)] hover:bg-[var(--jam-red-hover)] active:bg-[var(--jam-red-dark)] text-white font-bold text-[15px] py-2.5 px-8 rounded-full flex items-center justify-center mx-auto transition-all shadow-md"
                                        >
                                            楽譜を探す
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-start gap-3 animate-fade-in mt-2 pb-6">
                                        {myScores.map(score => (
                                            <button
                                                key={score.id}
                                                onClick={() => { setSong(score); onClose(); }}
                                                className="w-full text-left bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl transition-colors flex justify-between items-center group shadow-sm"
                                            >
                                                <div>
                                                    <h4 className="text-zinc-100 font-bold text-[16px] mb-1 group-hover:text-[var(--jam-red)] transition-colors">{score.title}</h4>
                                                    <div className="flex gap-2 text-zinc-500 text-[13px] font-medium">
                                                        <span>{score.style || 'スタイル無し'}</span>
                                                        <span>•</span>
                                                        <span>Key: {score.defaultKey || '?'}</span>
                                                    </div>
                                                </div>
                                                <FileText size={20} className="text-zinc-600 group-hover:text-[var(--jam-red)] transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )
                            )}

                            {activeTab === 'scores' && activeSubTab === 'saved' && (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <FolderHeart size={48} className="mx-auto mb-4 text-zinc-600 opacity-50" />
                                    <h3 className="text-zinc-100 font-bold text-[17px] mb-2">保存した楽譜</h3>
                                    <p className="text-zinc-500 text-[14px] leading-snug mb-6 max-w-xs mx-auto">
                                        他のユーザーの楽譜をここにブックマークして、いつでも練習に呼び出せます。
                                    </p>
                                    <button className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 text-white font-bold text-[15px] py-2.5 px-8 rounded-full flex items-center justify-center mx-auto transition-all shadow-md">
                                        楽譜を探す
                                    </button>
                                </div>
                            )}

                            {activeTab === 'scores' && activeSubTab === 'list' && (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <ListMusic size={48} className="mx-auto mb-4 text-zinc-600 opacity-50" />
                                    <h3 className="text-zinc-100 font-bold text-[17px] mb-2">セットリスト</h3>
                                    <p className="text-zinc-500 text-[14px] leading-snug mb-6 max-w-xs mx-auto">
                                        ライブや練習用に、お気に入りの楽譜をリストにまとめて管理できます。
                                    </p>
                                    <button className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 text-white font-bold text-[15px] py-2.5 px-8 rounded-full flex items-center justify-center mx-auto transition-all shadow-md">
                                        リストを作成
                                    </button>
                                </div>
                            )}

                            {/* RECORDINGS CONTENT */}
                            {activeTab === 'recordings' && activeSubTab === 'public' && (
                                <div className="animate-fade-in flex flex-col items-center text-zinc-500">
                                    <Mic size={48} className="mx-auto mb-4 opacity-20" />
                                    <h3 className="text-zinc-100 font-bold text-[17px] mb-2">公開中の録音はありません</h3>
                                    <p className="text-[14px] max-w-xs mx-auto mb-6">録音したセッションやベストテイクをプロフィールに公開しましょう。</p>
                                    <button className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 text-white font-bold text-[15px] py-2.5 px-8 rounded-full flex items-center justify-center mx-auto transition-all shadow-md">
                                        録音を始める
                                    </button>
                                </div>
                            )}

                            {activeTab === 'recordings' && activeSubTab === 'saved' && (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <FolderHeart size={48} className="mx-auto mb-4 text-zinc-600 opacity-50" />
                                    <p className="text-[14px] text-zinc-500 max-w-xs mx-auto mb-6">お気に入りの演奏テイクを保存して、聴き返すことができます。</p>
                                </div>
                            )}

                            {activeTab === 'recordings' && activeSubTab === 'list' && (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <ListMusic size={48} className="mx-auto mb-4 text-zinc-600 opacity-50" />
                                    <p className="text-[14px] text-zinc-500 max-w-xs mx-auto mb-6">自分の演奏をアルバムやプレイリストのようにまとめることができます。</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Close absolute button (mostly for desktop overlay mode, or when needed) */}
                <button
                    onClick={onClose}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-zinc-700 sm:hidden z-20 border border-zinc-700"
                >
                    <span className="sr-only">Close Profile</span>
                    <ChevronDown size={28} />
                </button>
            </div>

            {/* Edit Profile Sub-Modal */}
            {isEditingProfile && (
                <EditProfileModal onClose={() => setIsEditingProfile(false)} />
            )}
        </div>
    );
};
