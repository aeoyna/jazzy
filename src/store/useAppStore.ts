import { create } from 'zustand';
import { Song } from '@/types/song';

interface AppState {
    currentSong: Song | null;
    isPlaying: boolean;
    tempo: number;
    transpose: number; // Semitones
    masterVolume: number;
    instrumentVolumes: {
        piano: number;
        bass: number;
        drums: number;
        metronome: number;
    };
    reverbWet: number;
    loopCount: number; // Number of times to repeat the song. 0 means loop forever.

    // Display Settings
    fontSize: number;
    minorDisplay: 'minus' | 'm' | 'small';
    highlightColor: string;
    useGermanB: boolean;
    highlightingEnabled: boolean;

    // Effects
    gateEnabled: boolean;
    gateThreshold: number; // in decibels

    // Playback State
    activeBar: { sectionIndex: number; barIndex: number } | null;

    // Imported Songs
    importedSongs: Song[];

    // User Profile
    userProfile: {
        displayName: string;
        handle: string;
        bio: string;
        avatarUrl?: string; // Optional for now
    };

    // Actions
    setSong: (song: Song) => void;
    updateBarLyrics: (sectionIndex: number, barIndex: number, newLyrics: string) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setTempo: (tempo: number) => void;
    setTranspose: (transpose: number) => void;
    setMasterVolume: (vol: number) => void;
    setInstrumentVolume: (inst: 'piano' | 'bass' | 'drums' | 'metronome', vol: number) => void;
    setActiveBar: (bar: { sectionIndex: number; barIndex: number } | null) => void;
    setReverbWet: (wet: number) => void;
    setLoopCount: (count: number) => void;

    setFontSize: (size: number) => void;
    setMinorDisplay: (mode: 'minus' | 'm' | 'small') => void;
    setHighlightColor: (color: string) => void;
    setUseGermanB: (use: boolean) => void;
    setHighlightingEnabled: (enabled: boolean) => void;

    // Effects Actions
    setGateEnabled: (enabled: boolean) => void;
    setGateThreshold: (threshold: number) => void;

    // Import Actions
    addImportedSong: (song: Song) => void;

    // My Scores (User Edited) Actions
    myScores: Song[];
    addMyScore: (song: Song) => void;
    updateMyScore: (id: string, updates: Partial<Song>) => void;
    removeMyScore: (id: string) => void;

    // Profile Actions
    updateUserProfile: (profile: Partial<AppState['userProfile']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentSong: null,
    isPlaying: false,
    tempo: 120,
    transpose: 0,
    masterVolume: -10,
    instrumentVolumes: {
        piano: -8,
        bass: 2,
        drums: -10,
        metronome: -10,
    },
    reverbWet: 0.2, // Default 20%
    loopCount: 3, // Default repeats

    // Default Settings
    fontSize: 18,
    minorDisplay: 'minus',
    highlightColor: 'Yellow',
    useGermanB: false,
    highlightingEnabled: true, // Enable by default

    // Effects Default
    gateEnabled: false,
    gateThreshold: -40,

    activeBar: null,

    importedSongs: [],

    userProfile: {
        displayName: 'Nishino Koki',
        handle: 'koki_nishino_jazz',
        bio: 'session - ジャズの演奏とコード進行の研究。セッション参加記録など。',
    },

    setSong: (song) => set({ currentSong: song, tempo: song.defaultTempo, activeBar: null }),
    updateBarLyrics: (sectionIndex, barIndex, newLyrics) => set((state) => {
        if (!state.currentSong) return state;

        // Create a deep copy of the sections and bars to avoid mutating state directly
        // Ensure section and bar exist
        if (!state.currentSong.sections[sectionIndex] || !state.currentSong.sections[sectionIndex].bars[barIndex]) {
            return state;
        }

        const newSections = state.currentSong.sections.map((sec, sIdx) => {
            if (sIdx !== sectionIndex) return sec;
            return {
                ...sec,
                bars: sec.bars.map((bar, bIdx) => {
                    if (bIdx !== barIndex) return bar;
                    return { ...bar, lyrics: newLyrics }; // Update lyrics
                })
            };
        });

        const updatedSong = { ...state.currentSong, sections: newSections };

        // If this song is in myScores, update it there too so changes are saved
        let updatedMyScores = state.myScores;
        const isMyScore = state.myScores.some(s => s.id === state.currentSong?.id);
        if (isMyScore) {
            updatedMyScores = state.myScores.map(s =>
                s.id === state.currentSong?.id ? updatedSong : s
            );
        }

        return { currentSong: updatedSong, myScores: updatedMyScores };
    }),
    setIsPlaying: (isPlaying) => set({ isPlaying, activeBar: isPlaying ? null : null }), // Clear on stop?
    setTempo: (tempo) => set({ tempo }),
    setTranspose: (transpose) => set({ transpose }),
    setMasterVolume: (vol) => set({ masterVolume: vol }),
    setInstrumentVolume: (inst: 'piano' | 'bass' | 'drums' | 'metronome', vol: number) =>
        set((state) => ({
            instrumentVolumes: { ...state.instrumentVolumes, [inst]: vol },
        })),
    setActiveBar: (activeBar) => set({ activeBar }),
    setReverbWet: (reverbWet: number) => set({ reverbWet }),
    setLoopCount: (loopCount: number) => set({ loopCount }),

    setFontSize: (fontSize) => set({ fontSize }),
    setMinorDisplay: (minorDisplay) => set({ minorDisplay }),
    setHighlightColor: (highlightColor) => set({ highlightColor }),
    setUseGermanB: (useGermanB) => set({ useGermanB }),
    setHighlightingEnabled: (highlightingEnabled) => set({ highlightingEnabled }),

    setGateEnabled: (gateEnabled) => set({ gateEnabled }),
    setGateThreshold: (gateThreshold) => set({ gateThreshold }),

    addImportedSong: (song) => set((state) => ({
        importedSongs: [...state.importedSongs, song],
        currentSong: song, // Auto-select imported song
        tempo: song.defaultTempo
    })),

    myScores: [],
    addMyScore: (song) => set((state) => ({
        myScores: [...state.myScores, song],
        currentSong: song,
        tempo: song.defaultTempo
    })),
    updateMyScore: (id, updates) => set((state) => {
        const updatedScores = state.myScores.map(s =>
            s.id === id ? { ...s, ...updates } : s
        );
        // Also update current song if it's the one being edited
        const updatedCurrent = state.currentSong?.id === id
            ? { ...state.currentSong, ...updates }
            : state.currentSong;

        return { myScores: updatedScores, currentSong: updatedCurrent };
    }),
    removeMyScore: (id) => set((state) => ({
        myScores: state.myScores.filter(s => s.id !== id),
        currentSong: state.currentSong?.id === id ? null : state.currentSong
    })),

    updateUserProfile: (profileUpdates) => set((state) => ({
        userProfile: { ...state.userProfile, ...profileUpdates }
    })),
}));
