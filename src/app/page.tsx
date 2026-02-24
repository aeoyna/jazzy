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
import { autumnLeaves } from '@/data/songs';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState } from 'react';

// ... imports

// Icons or placeholders can be used here. For now using text/divs.
import { QrCode } from 'lucide-react';

export default function Home() {
  const setSong = useAppStore((state) => state.setSong);
  const currentSong = useAppStore((state) => state.currentSong);

  const [showSongList, setShowSongList] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScoreEditor, setShowScoreEditor] = useState(false);
  const [showSongInfo, setShowSongInfo] = useState(false);

  useEffect(() => {
    // Load default if none
    if (!currentSong) setSong(autumnLeaves);
  }, [setSong, currentSong]);

  if (!currentSong) return null;

  return (
    <div className="flex justify-center min-h-screen bg-zinc-900 lg:justify-between w-full relative">
      {/* Left Column (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between h-screen p-12 fixed left-0 top-0 w-80 z-0">
        <div>
          <h1 className="text-white text-5xl font-bold tracking-tighter">jam</h1>
        </div>
        <div className="mb-12">
          {/* Logo Placeholder */}
          <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 border border-zinc-700">
            <span className="text-xs">Logo</span>
          </div>
        </div>
      </div>

      {/* Main App Content - Centered */}
      <main className="flex h-[100dvh] w-full max-w-md flex-col bg-black text-red-500 overflow-hidden relative shadow-2xl mx-auto z-10 border-x border-zinc-800">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ChordGrid song={currentSong} />
        </div>

        {/* Modals */}
        {showSongList && <SongList onClose={() => setShowSongList(false)} />}
        {showMixer && <Mixer onClose={() => setShowMixer(false)} />}

        {/* Footer Controls */}
        <div className="shrink-0 bg-black pb-0 z-50">
          <PlayerControls
            song={currentSong}
            onEditClick={() => setShowScoreEditor(true)}
            onTitleClick={() => setShowSongInfo(true)}
          />
          <BottomNav
            onSearchClick={() => setShowSongList(true)}
            onMixerClick={() => setShowMixer(true)}
            onProfileClick={() => setShowProfile(true)}
          />
        </div>

        {/* Modals triggered from within Profile */}
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
        {showScoreEditor && (
          <ScoreEditor
            song={currentSong}
            onClose={() => setShowScoreEditor(false)}
          />
        )}
        {showSongInfo && (
          <SongInfoModal
            song={currentSong}
            onClose={() => setShowSongInfo(false)}
          />
        )}
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

