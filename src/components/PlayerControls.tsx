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
                className="player-mid-container cursor-pointer hover:bg-[var(--app-surface-elevated)]/50 rounded-lg p-1 transition-colors group"
                onClick={onTitleClick}
            >
                <h2 className="player-title group-hover:text-red-400 transition-colors">{song.title}</h2>
                <p className="player-title-sub">
                    {song.composer}
                    {song.arranger && <span className="text-[var(--app-fg-dim)] ml-1">/ Arr: {song.arranger}</span>}
                </p>
            </div>

            {/* Disc Button (Placeholder) */}
            <button className="player-controls-button" title="Backing Options">
                <Disc size={32} strokeWidth={2.5} fill="var(--jam-red)" fillOpacity={0.2} />
            </button>
        </div>
    );
};
