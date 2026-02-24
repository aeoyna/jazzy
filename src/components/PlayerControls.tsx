import React from 'react';
import { Song } from '@/types/song';
import { Pencil, Disc } from 'lucide-react';

interface PlayerControlsProps {
    song: Song;
    onEditClick?: () => void;
    onTitleClick?: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ song, onEditClick, onTitleClick }) => {
    return (
        <div className="player-controls">
            {/* Edit Button */}
            <button className="player-controls-button" title="Edit" onClick={onEditClick}>
                <Pencil size={26} strokeWidth={2.5} />
            </button>

            {/* Title / Composer */}
            <div
                className="player-mid-container cursor-pointer hover:bg-zinc-800/50 rounded-lg p-1 transition-colors group"
                onClick={onTitleClick}
            >
                <h2 className="player-title group-hover:text-[#FF3D00] transition-colors">{song.title}</h2>
                <p className="player-title-sub">
                    {song.composer}
                    {song.arranger && <span className="text-zinc-500 ml-1">/ Arr: {song.arranger}</span>}
                </p>
            </div>

            {/* Disc Button (Placeholder) */}
            <button className="player-controls-button" title="Backing Options">
                <Disc size={32} strokeWidth={2.5} fill="rgba(255,61,0,0.2)" />
            </button>
        </div>
    );
};
