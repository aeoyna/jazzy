import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface EditProfileModalProps {
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { userProfile, updateUserProfile } = useAppStore();

    const [displayName, setDisplayName] = useState(userProfile.displayName);
    const [handle, setHandle] = useState(userProfile.handle);
    const [bio, setBio] = useState(userProfile.bio);

    const handleSave = () => {
        updateUserProfile({
            displayName,
            handle,
            bio
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm sm:p-4 animate-fade-in text-white font-sans">
            <div className="w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-md bg-zinc-950 sm:border border-zinc-800 sm:rounded-2xl shadow-2xl flex flex-col relative animate-slide-up">

                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950 sticky top-0 z-10">
                    <button onClick={onClose} className="p-2 -ml-2 text-white hover:text-zinc-300 transition-colors">
                        <X size={26} />
                    </button>

                    <h2 className="font-bold text-[17px] tracking-wide">プロフィールを編集</h2>

                    <button
                        onClick={handleSave}
                        className="p-2 -mr-2 text-amber-500 hover:text-amber-400 font-bold transition-colors flex items-center gap-1"
                    >
                        保存
                    </button>
                </header>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 space-y-6">

                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-zinc-400 px-1">名前</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 text-[15px] outline-none transition-colors"
                            placeholder="名前を入力"
                        />
                    </div>

                    {/* Handle / Username */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-zinc-400 px-1">ユーザーネーム</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">@</span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} // Restrict to alphanumeric + underscore
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl pl-9 pr-4 py-3 text-[15px] outline-none transition-colors font-mono"
                                placeholder="ユーザーネームを入力"
                            />
                        </div>
                        <p className="text-[12px] text-zinc-500 px-1">半角カナ数字とアンダースコアが使えます。</p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-zinc-400 px-1">自己紹介</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 text-[15px] outline-none transition-colors resize-none"
                            placeholder="自己紹介を入力"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};
