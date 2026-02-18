import { create } from 'zustand';
import { Song } from '@/types/song';

interface AppState {
    currentSong: Song | null;
    isPlaying: boolean;
    tempo: number;
    transpose: number; // Semitones
    masterVolume: number;
    instrumentVolumes: {
        keys: number;
        bass: number;
        drums: number;
    };

    // Display Settings
    fontSize: number;
    minorDisplay: 'minus' | 'm' | 'small';
    highlightColor: string;
    useGermanB: boolean;
    highlightingEnabled: boolean;

    // Imported Songs
    importedSongs: Song[];

    // Actions
    setSong: (song: Song) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setTempo: (tempo: number) => void;
    setTranspose: (transpose: number) => void;
    setMasterVolume: (vol: number) => void;
    setInstrumentVolume: (inst: 'keys' | 'bass' | 'drums', vol: number) => void;

    // Settings Actions
    setFontSize: (size: number) => void;
    setMinorDisplay: (mode: 'minus' | 'm' | 'small') => void;
    setHighlightColor: (color: string) => void;
    setUseGermanB: (use: boolean) => void;
    setHighlightingEnabled: (enabled: boolean) => void;

    // Import Actions
    addImportedSong: (song: Song) => void;
}

export const useAppStore = create<AppState>((set) => ({
    currentSong: null,
    isPlaying: false,
    tempo: 120,
    transpose: 0,
    masterVolume: -10,
    instrumentVolumes: {
        keys: 0,
        bass: 0,
        drums: 0,
    },

    // Default Settings
    fontSize: 18,
    minorDisplay: 'minus',
    highlightColor: 'Yellow',
    useGermanB: false,
    highlightingEnabled: false,

    importedSongs: [],

    setSong: (song) => set({ currentSong: song, tempo: song.defaultTempo }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setTempo: (tempo) => set({ tempo }),
    setTranspose: (transpose) => set({ transpose }),
    setMasterVolume: (vol) => set({ masterVolume: vol }),
    setInstrumentVolume: (inst, vol) =>
        set((state) => ({
            instrumentVolumes: { ...state.instrumentVolumes, [inst]: vol },
        })),

    setFontSize: (fontSize) => set({ fontSize }),
    setMinorDisplay: (minorDisplay) => set({ minorDisplay }),
    setHighlightColor: (highlightColor) => set({ highlightColor }),
    setUseGermanB: (useGermanB) => set({ useGermanB }),
    setHighlightingEnabled: (highlightingEnabled) => set({ highlightingEnabled }),

    addImportedSong: (song) => set((state) => ({
        importedSongs: [...state.importedSongs, song],
        currentSong: song, // Auto-select imported song
        tempo: song.defaultTempo
    })),
}));
