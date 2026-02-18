export type TimeSignature = string; // e.g., "4/4", "3/4"
export type KeySignature = string; // e.g., "C", "Bb", "Am"

export interface Chord {
    root: string; // e.g., "C", "F#"
    quality: string; // e.g., "-7", "7", "maj7", "o7"
    extensions?: string; // e.g., "b9", "13"
    bass?: string; // e.g., "G" (for C/G)
    duration?: number; // Relative duration in the bar (default to whole bar or equal split)
}

export interface Bar {
    chords: string[]; // Simplification for MVP: just string representation ["Cm7", "F7"]
    timeSignature?: TimeSignature; // Only if changed
    repeatStart?: boolean;
    repeatEnd?: number; // number of times to repeat
    ending?: number; // 1st ending, 2nd ending, etc.
}

export interface Section {
    label: string; // "A", "B", "Intro", "Coda"
    bars: Bar[];
}

export interface Song {
    id: string;
    title: string;
    composer: string;
    style: string; // "Swing", "Bossa", "Ballad"
    defaultKey: KeySignature;
    defaultTempo: number;
    sections: Section[];
}
