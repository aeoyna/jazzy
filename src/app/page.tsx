'use client';

import { ChordGrid } from '@/components/ChordChart';
import { SongList } from '@/components/SongList';
import { Mixer } from '@/components/Mixer';
import { PlayerControls } from '@/components/PlayerControls';
import { BottomNav } from '@/components/BottomNav';
import { SettingsModal } from '@/components/SettingsModal';
import { ProfileModal } from '@/components/ProfileModal';
import { ScoreEditor } from '@/components/ScoreEditor';
import { SongInfoModal } from '@/components/SongInfoModal';
import { ToolsModal } from '@/components/ToolsModal';
import { WelcomeCard } from '@/components/WelcomeCard';
import { Atmosphere } from '@/components/Atmosphere';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';

export default function Home() {
  const currentSong = useAppStore((state) => state.currentSong);

  const [showSongList, setShowSongList] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScoreEditor, setShowScoreEditor] = useState(false);
  const [showSongInfo, setShowSongInfo] = useState(false);
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-[var(--app-bg)] lg:justify-between w-full relative">
      <Atmosphere />

      {/* Left Column (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between h-screen p-12 fixed left-0 top-0 w-80 z-0">
        <div>
          <h1 className="text-[var(--app-fg)] text-5xl font-bold tracking-tighter">jam</h1>
        </div>
        <div className="mb-12">
          {/* Logo Placeholder */}
          <div className="w-32 h-32 bg-[var(--app-surface)] rounded-full flex items-center justify-center text-[var(--app-fg-dim)] border border-[var(--app-border)]">
            <span className="text-xs">Logo</span>
          </div>
        </div>
      </div>

      {/* Main App Content - Centered */}
      <main className="flex h-[100dvh] w-full max-w-md flex-col bg-black/40 backdrop-blur-sm text-[var(--jam-red)] overflow-hidden relative shadow-2xl mx-auto z-10 border-x border-[var(--app-border)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto" data-chord-scroll>
          {currentSong ? (
            <ChordGrid song={currentSong} />
          ) : (
            <WelcomeCard />
          )}
        </div>

        {/* Modals */}
        {showSongList && <SongList onClose={() => setShowSongList(false)} />}
        {showMixer && <Mixer onClose={() => setShowMixer(false)} />}

        {/* Footer Controls */}
        <div className="shrink-0 bg-black pb-0 z-50 border-t border-[var(--app-border)]">
          {currentSong && (
            <PlayerControls
              song={currentSong}
              onEditClick={() => setShowScoreEditor(true)}
              onTitleClick={() => setShowSongInfo(true)}
            />
          )}
          <BottomNav
            onSearchClick={() => setShowSongList(true)}
            onMixerClick={() => setShowMixer(true)}
            onProfileClick={() => setShowProfile(true)}
            onToolsClick={() => setShowTools(true)}
          />
        </div>

        {/* Other Modals */}
        {showProfile && (
          <ProfileModal
            onClose={() => setShowProfile(false)}
            onSettingsClick={() => {
              setShowProfile(false);
              setShowSettings(true);
            }}
          />
        )}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showScoreEditor && currentSong && (
          <ScoreEditor
            song={currentSong}
            onClose={() => setShowScoreEditor(false)}
          />
        )}
        {showSongInfo && currentSong && (
          <SongInfoModal
            song={currentSong}
            onClose={() => setShowSongInfo(false)}
          />
        )}
        {showTools && <ToolsModal onClose={() => setShowTools(false)} />}
      </main>

      {/* Right Column (Desktop) */}
      <div className="hidden lg:flex flex-col justify-center h-screen p-12 fixed right-0 top-0 w-80 items-center z-0">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          {/* QR Code Placeholder */}
          <QrCode className="w-32 h-32 text-black" />
        </div>
        <p className="text-zinc-400 mt-4 text-sm font-medium tracking-wide">Instagram</p>
      </div>
    </div>
  );
}
