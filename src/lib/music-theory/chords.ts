export const ROOT_MAP: Record<string, number> = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4,
    F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
};

export const SCALE_MAP: Record<string, string[]> = {
    'maj': ['Ionian', 'Lydian'],
    'maj7': ['Ionian', 'Lydian'],
    '6': ['Ionian', 'Lydian'],
    'm': ['Dorian', 'Minor'],
    '-': ['Dorian', 'Minor'],
    'm7': ['Dorian', 'Aeolian'],
    '-7': ['Dorian', 'Aeolian'],
    'm6': ['Dorian', 'Melodic Minor'],
    '7': ['Mixolydian', 'Lydian b7', 'Altered', 'H-W Diminished'],
    '7b9': ['Altered', 'H-W Diminished'],
    '7b13': ['Altered', 'Whole Tone'],
    'm7b5': ['Locrian', 'Locrian #2'],
    'ø': ['Locrian', 'Locrian #2'],
    'dim': ['W-H Diminished'],
    'dim7': ['W-H Diminished'],
    'o': ['W-H Diminished'],
};

const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function normalizeQuality(quality: string): string {
    return quality
        .trim()
        .replace(/\^/g, 'maj')
        .replace(/△/g, 'maj')
        .replace(/Δ/g, 'maj')
        .replace(/♭/g, 'b')
        .replace(/♯/g, '#')
        .toLowerCase();
}

function getMidiRoot(root: string, octave: number = 3): number {
    const pc = ROOT_MAP[root] ?? 0;
    return (octave + 1) * 12 + pc;
}

function midiToNote(midi: number): string {
    const octave = Math.floor(midi / 12) - 1;
    const pc = midi % 12;
    return `${NOTE_NAMES[pc]}${octave}`;
}

function getIntervalsForQuality(rawQuality: string): number[] {
    const quality = normalizeQuality(rawQuality);

    if (quality === '' || quality === 'maj') return [0, 4, 7];
    if (quality === 'm' || quality === '-') return [0, 3, 7];
    if (quality === '7') return [0, 4, 7, 10];
    if (quality === 'maj7') return [0, 4, 7, 11];
    if (quality === 'm7' || quality === '-7') return [0, 3, 7, 10];

    // Half Diminished
    if (quality === 'm7b5' || quality === '-7b5' || quality === 'ø' || quality === 'ø7' || quality === 'm7(b5)') {
        return [0, 3, 6, 10];
    }

    // Diminished
    if (quality === 'dim' || quality === 'o' || quality === '°') return [0, 3, 6];
    if (quality === 'dim7' || quality === 'o7' || quality === '°7') return [0, 3, 6, 9];

    if (quality === '6') return [0, 4, 7, 9];
    if (quality === 'm6' || quality === '-6') return [0, 3, 7, 9];
    if (quality === '7b9') return [0, 4, 7, 10, 13];
    if (quality === '7b13') return [0, 4, 7, 10, 20]; // 20 = b13 (minor 6th an octave up)

    if (quality.startsWith('7')) return [0, 4, 7, 10];
    return [0, 4, 7];
}

export function getChordNotes(chordSymbol: string, rootOctave: number = 3): string[] {
    if (!chordSymbol || chordSymbol === '%' || chordSymbol === 'N.C.') return [];

    const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return [];

    const rootStr = match[1];
    const quality = match[2];
    const rootMidi = getMidiRoot(rootStr, rootOctave);
    const intervals = getIntervalsForQuality(quality);

    return intervals.map(interval => midiToNote(rootMidi + interval));
}

export function getBassNote(chordSymbol: string): string {
    if (!chordSymbol || chordSymbol === '%' || chordSymbol === 'N.C.') return 'C2';
    const match = chordSymbol.match(/^([A-G][#b]?)/);
    if (!match) return 'C2';
    return midiToNote(getMidiRoot(match[1], 2));
}

export function getSuggestedScales(chordSymbol: string): string[] {
    if (!chordSymbol || chordSymbol === '%' || chordSymbol === 'N.C.') return [];

    const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return [];

    const root = match[1];
    const rawQuality = match[2];
    const quality = normalizeQuality(rawQuality) || 'maj';

    // Find the best match in SCALE_MAP
    let suggestions: string[] = [];
    if (SCALE_MAP[quality]) {
        suggestions = SCALE_MAP[quality];
    } else {
        // Fallback or prefix matching
        const sortedKeys = Object.keys(SCALE_MAP).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
            if (quality.startsWith(key)) {
                suggestions = SCALE_MAP[key];
                break;
            }
        }
    }

    if (suggestions.length === 0) suggestions = ['Ionian'];

    return suggestions.map(scale => `${root} ${scale}`);
}

/**
 * Detect a ii-V-I (251) progression from consecutive chords.
 * Returns the target key (the I chord root) if detected, or null.
 *
 * ii = minor7 type (m7, -7)
 * V  = dominant7 type (7, 7b9, 7b13, etc.)
 * I  = major type (maj7, 6, maj, or just root)
 *
 * The intervals: ii is 2 semitones above I, V is 7 semitones above I (or 5 below)
 */
export function detect251(chords: string[]): { key: string; chords: string[] } | null {
    if (chords.length < 2) return null;

    const parseChord = (c: string) => {
        const m = c.match(/^([A-G][#b]?)(.*)$/);
        if (!m) return null;
        return { root: m[1], quality: normalizeQuality(m[2]) || 'maj', raw: c };
    };

    const isMinor7 = (q: string) => ['m7', '-7', 'm', '-', 'm9', '-9'].includes(q);
    const isDom7 = (q: string) => q.startsWith('7') || q === 'dom7';
    const isHalfDim = (q: string) => ['m7b5', '-7b5', 'ø', 'ø7'].includes(q);
    const isMajor = (q: string) => ['', 'maj', 'maj7', '6', 'maj9'].includes(q);

    const interval = (from: string, to: string) => {
        const fromPc = ROOT_MAP[from] ?? 0;
        const toPc = ROOT_MAP[to] ?? 0;
        return ((toPc - fromPc) + 12) % 12;
    };

    // Try 3-chord ii-V-I
    if (chords.length >= 3) {
        const c1 = parseChord(chords[0]);
        const c2 = parseChord(chords[1]);
        const c3 = parseChord(chords[2]);

        if (c1 && c2 && c3) {
            // ii(m7) -> V(7) -> I(maj): intervals 5, 5 (up by 4th each)
            if ((isMinor7(c1.quality) || isHalfDim(c1.quality)) && isDom7(c2.quality) && isMajor(c3.quality)) {
                if (interval(c1.root, c2.root) === 5 && interval(c2.root, c3.root) === 5) {
                    return { key: `${c3.root}`, chords: [c1.raw, c2.raw, c3.raw] };
                }
            }
        }
    }

    // Try 2-chord V-I
    if (chords.length >= 2) {
        const c1 = parseChord(chords[0]);
        const c2 = parseChord(chords[1]);

        if (c1 && c2) {
            if (isDom7(c1.quality) && isMajor(c2.quality)) {
                if (interval(c1.root, c2.root) === 5) {
                    return { key: `${c2.root}`, chords: [c1.raw, c2.raw] };
                }
            }
            // ii-V without resolution
            if ((isMinor7(c1.quality) || isHalfDim(c1.quality)) && isDom7(c2.quality)) {
                if (interval(c1.root, c2.root) === 5) {
                    // The I would be a 4th above V
                    const iRoot = NOTE_NAMES[((ROOT_MAP[c2.root] ?? 0) + 5) % 12];
                    return { key: `${iRoot}`, chords: [c1.raw, c2.raw] };
                }
            }
        }
    }

    return null;
}
