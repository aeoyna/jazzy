
export const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_TO_INDEX: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

// Helper to normalize root (e.g. C# -> Db for simplicity in this MVP, or preserve preference?)
// For MVP we just use the NOTE_NAMES array which is Flat-biased.
// Real implementation needs Key context.

function getNoteIndex(note: string): number {
    return NOTE_TO_INDEX[note];
}

export function transposeNote(note: string, semitones: number): string {
    const idx = getNoteIndex(note);
    if (idx === undefined) return note; // Invalid note

    let newIdx = (idx + semitones) % 12;
    if (newIdx < 0) newIdx += 12;

    const transposed = NOTE_NAMES[newIdx];
    return transposed.replace(/b/g, '♭');
}

export interface FormatSettings {
    transpose: number;
    minorDisplay: 'minus' | 'm' | 'small';
    useGermanB: boolean;
}

export function formatChord(chordSymbol: string, settings: FormatSettings): { root: string, bass: string, superscript: string, subscript: string } {
    // 1. Parse Chord (Handle slash chords first)
    const [mainChord, bassNote] = chordSymbol.split('/');

    const match = mainChord.match(/^([A-G][#b]?)(.*)$/);
    // If we can't parse it, just return the whole string as the root
    if (!match) return { root: chordSymbol, bass: '', superscript: '', subscript: '' };

    let root = match[1].replace(/b/g, '♭');
    let remainder = match[2];

    let bass = '';
    if (bassNote) {
        bass = bassNote.replace(/b/g, '♭');
    }

    // 2. Transpose Root and Bass
    if (settings.transpose !== 0) {
        root = transposeNote(root, settings.transpose);
        if (bass) {
            bass = transposeNote(bass, settings.transpose);
        }
    }

    // 3. Handle German B (H for B only, Bb stays Bb)
    if (settings.useGermanB) {
        if (root === 'B') root = 'H';
        if (bass === 'B') bass = 'H';
    }

    // 4. Parse Quality/Extension for Minor Display
    // We need to separate the "m" part from the rest?
    // Regex for minor: starts with 'm' or '-' but NOT 'maj'
    // 'Cm7' -> m7. 'Cm' -> m. 'C-7' -> -7.

    let displayQuality = remainder;

    // Check if it is minor
    let isMinor = false;
    let suffix = remainder;

    if (remainder.startsWith('-')) {
        isMinor = true;
        suffix = remainder.substring(1);
    } else if (remainder.startsWith('m') && !remainder.startsWith('maj')) {
        isMinor = true;
        suffix = remainder.substring(1);
    }

    // Replace 'maj' with '△' and 'b' with '♭'
    suffix = suffix.replace(/maj/g, '△').replace(/b/g, '♭');

    let superscript = '';
    let subscript = '';

    // Typical iReal format:
    // Minor symbol is subscript (if setting dictates, or just regular if '-')
    // Numbers (7, 9, 11, 13) and alterations (b5, #9) are superscript
    // 'dim'/'o', 'aug'/'+', 'alt' are superscript

    // For simplicity in this view:
    // If it's minor, the 'm' or '-' is the subscript, and the REST is superscript.
    // If it's major/dominant, everything goes to superscript.
    // Except half-diminished (m7b5) usually has 'm' subscript, '7b5' superscript. (or Ø superscript)

    if (isMinor) {
        switch (settings.minorDisplay) {
            case 'minus': subscript = '-'; break;
            case 'm': subscript = 'm'; break;
            case 'small': subscript = 'm'; break;
        }
        superscript = suffix;
    } else {
        // Not minor. 
        // Example: '△7', '7b9', '13', 'sus4' -> all superscript
        superscript = suffix;
    }

    return { root, bass, superscript, subscript };
}

export function formatChordString(chordSymbol: string, settings: FormatSettings): string {
    const { root, bass, superscript, subscript } = formatChord(chordSymbol, settings);
    const bassPart = bass ? `/${bass}` : '';
    return `${root}${subscript}${superscript}${bassPart}`;
}
