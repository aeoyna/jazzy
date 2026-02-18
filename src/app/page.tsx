'use client';

import { ChordGrid } from '@/components/ChordChart';
import { SongList } from '@/components/SongList';
import { Mixer } from '@/components/Mixer';
import { BottomNav } from '@/components/BottomNav';
import { SettingsModal } from '@/components/SettingsModal';
import { autumnLeaves } from '@/data/songs';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const setSong = useAppStore((state) => state.setSong);
  const currentSong = useAppStore((state) => state.currentSong);

  const [showSongList, setShowSongList] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Placeholder

  useEffect(() => {
    // Load default if none
    if (!currentSong) setSong(autumnLeaves);
  }, [setSong, currentSong]);

  if (!currentSong) return null;

  return (
    <main className="flex h-[100dvh] flex-col bg-zinc-950 text-amber-500 overflow-hidden relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <ChordGrid song={currentSong} />
      </div>

      {/* Modals */}
      {showSongList && <SongList onClose={() => setShowSongList(false)} />}
      {showMixer && <Mixer onClose={() => setShowMixer(false)} />}

      {/* Bottom Navigation */}
      <BottomNav
        onSearchClick={() => setShowSongList(true)}
        onMixerClick={() => setShowMixer(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </main>
  );
}
