import React from 'react';
import { Search, FileText, Play, Pause, Sliders, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { AudioEngine } from '@/lib/audio/AudioEngine';

interface BottomNavProps {
    onSearchClick: () => void;
    onMixerClick: () => void;
    onSettingsClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onSearchClick, onMixerClick, onSettingsClick }) => {
    const { isPlaying, setIsPlaying, currentSong } = useAppStore();

    const togglePlay = async () => {
        const engine = AudioEngine.getInstance();
        if (isPlaying) {
            engine.stop();
            setIsPlaying(false);
        } else {
            if (currentSong) {
                await engine.playSong(currentSong);
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="w-full shrink-0 h-16 flex items-center justify-around px-4 z-50 relative" style={{ backgroundColor: '#000000', bottom: '30px' }}>
            <button onClick={onSearchClick} className="flex flex-col items-center justify-center" style={{ color: '#06b6d4', backgroundColor: '#000000' }}>
                <Search size={24} strokeWidth={2.5} />
            </button>

            <button className="flex flex-col items-center justify-center opacity-50 cursor-not-allowed" style={{ color: '#06b6d4', backgroundColor: '#000000' }}>
                <FileText size={24} strokeWidth={2.5} />
            </button>

            <button onClick={togglePlay} className="flex flex-col items-center justify-center transform hover:scale-110 transition" style={{ color: '#06b6d4', backgroundColor: '#000000' }}>
                {isPlaying ? <Pause size={32} fill="currentColor" strokeWidth={0} /> : <Play size={32} fill="currentColor" strokeWidth={0} />}
            </button>

            <button onClick={onMixerClick} className="flex flex-col items-center justify-center" style={{ color: '#06b6d4', backgroundColor: '#000000' }}>
                <Sliders size={24} strokeWidth={2.5} />
            </button>

            <button onClick={onSettingsClick} className="flex flex-col items-center justify-center" style={{ color: '#06b6d4', backgroundColor: '#000000' }}>
                <Settings size={24} strokeWidth={2.5} />
            </button>
        </div>
    );
};
