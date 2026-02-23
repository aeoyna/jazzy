import { Note } from 'tone/build/esm/core/type/NoteUnits';

// Very basic chord to notes mapper for MVP
// In a real app, use @tonaljs/chord or similar library

export const ROOT_MAP: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function getMidiRoot(root: string, octave: number = 3): number {
    const pc = ROOT_MAP[root];
    return (octave + 1) * 12 + pc;
}

function midiToNote(midi: number): string {
    const octave = Math.floor(midi / 12) - 1;
    const pc = midi % 12;
    return `${NOTE_NAMES[pc]}${octave}`;
}

export function getChordNotes(chordSymbol: string, rootOctave: number = 3): string[] {
    // Regex to split root and quality
    // e.g. "Cm7" -> root="C", quality="m7"
    // "F#7" -> root="F#", quality="7"
    // "Bbmaj7" -> root="Bb", quality="maj7"

    const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return [];

    const rootStr = match[1];
    const quality = match[2];

    const rootMidi = getMidiRoot(rootStr, rootOctave);

    let intervals: number[] = [];

    // Basic qualities MVP
    if (quality === '' || quality === 'maj' || quality === 'M') { // Major Triad
        intervals = [0, 4, 7];
    } else if (quality === 'm' || quality === '-') { // Minor Triad
        intervals = [0, 3, 7];
    } else if (quality === '7') { // Dominant 7
        intervals = [0, 4, 7, 10];
    } else if (quality === 'maj7' || quality === 'M7' || quality === 'Δ7') { // Major 7
        intervals = [0, 4, 7, 11];
    } else if (quality === 'm7' || quality === '-7') { // Minor 7
        intervals = [0, 3, 7, 10];
    } else if (quality === 'm7b5' || quality === '-7b5' || quality === 'ø') { // Half Diminished
        intervals = [0, 3, 6, 10];
    } else if (quality === 'dim7' || quality === 'o7') { // Diminished 7
        intervals = [0, 3, 6, 9];
    } else if (quality === '6') { // Major 6
        intervals = [0, 4, 7, 9];
    } else if (quality === 'm6' || quality === '-6') { // Minor 6
        intervals = [0, 3, 7, 9];
    } else if (quality === '7b9') {
        intervals = [0, 4, 7, 10, 13];
    } else {
        // Fallback to Major if unknown
        intervals = [0, 4, 7];
    }

    return intervals.map(interval => midiToNote(rootMidi + interval));
}

export function getBassNote(chordSymbol: string): string {
    const match = chordSymbol.match(/^([A-G][#b]?)/);
    if (!match) return 'C2';
    return midiToNote(getMidiRoot(match[1], 2));
}
