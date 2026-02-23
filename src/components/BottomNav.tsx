import React from 'react';
import { Search, Mic, Play, Pause, Sliders, User } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { AudioEngine } from '@/lib/audio/AudioEngine';

interface BottomNavProps {
    onSearchClick: () => void;
    onMixerClick: () => void;
    onProfileClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onSearchClick, onMixerClick, onProfileClick }) => {
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
        <div className="bottom-nav">
            {/* 1. Search (Magnifying Glass) */}
            <button onClick={onSearchClick} className="bottom-nav-button">
                <Search size={28} strokeWidth={3} />
            </button>

            {/* 2. Mic (Recording) - Placeholder */}
            <button className="bottom-nav-button opacity-50 cursor-not-allowed">
                <Mic size={28} strokeWidth={3} />
            </button>

            {/* 3. Play/Pause */}
            <button onClick={togglePlay} className="bottom-nav-button bottom-nav-play">
                {isPlaying ? <Pause size={40} fill="currentColor" strokeWidth={0} /> : <Play size={40} fill="currentColor" strokeWidth={0} />}
            </button>

            {/* 4. Mixer */}
            <button onClick={onMixerClick} className="bottom-nav-button">
                <Sliders size={28} strokeWidth={3} />
            </button>

            {/* 5. My Page (User Profile) */}
            <button onClick={onProfileClick} className="bottom-nav-button">
                <User size={28} strokeWidth={3} />
            </button>
        </div>
    );
};
