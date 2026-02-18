
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

    return NOTE_NAMES[newIdx];
}

export interface FormatSettings {
    transpose: number;
    minorDisplay: 'minus' | 'm' | 'small';
    useGermanB: boolean;
}

export function formatChord(chordSymbol: string, settings: FormatSettings): { root: string, quality: string, extension: string } {
    // 1. Parse Chord
    const match = chordSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return { root: chordSymbol, quality: '', extension: '' };

    let root = match[1];
    let remainder = match[2];

    // 2. Transpose Root
    if (settings.transpose !== 0) {
        root = transposeNote(root, settings.transpose);
    }

    // 3. Handle German B (H for B only, Bb stays Bb)
    if (settings.useGermanB) {
        if (root === 'B') {
            root = 'H';
        }
    }

    // 4. Parse Quality/Extension for Minor Display
    // We need to separate the "m" part from the rest?
    // Regex for minor: starts with 'm' or '-' but NOT 'maj'
    // 'Cm7' -> m7. 'Cm' -> m. 'C-7' -> -7.

    let displayQuality = remainder;

    // Check if it is minor
    // Identifiers: 'm', '-'
    // We want to normalize to the setting.

    // Simple replacement strategy:
    // If it starts with 'm' (and not maj) or '-'
    // Replace that leading marker with the setting.

    let isMinor = false;
    let suffix = remainder;

    if (remainder.startsWith('-')) {
        isMinor = true;
        suffix = remainder.substring(1);
    } else if (remainder.startsWith('m') && !remainder.startsWith('maj')) {
        isMinor = true;
        suffix = remainder.substring(1);
    }

    if (isMinor) {
        let minorMark = '';
        switch (settings.minorDisplay) {
            case 'minus': minorMark = '-'; break;
            case 'm': minorMark = 'm'; break;
            case 'small': minorMark = 'm'; break; // We'll handle visual "small" in CSS if needed, or just return text 'm'
        }
        displayQuality = minorMark + suffix;
    }

    // For "Small (m)", the consumer (ChordCell) might render the 'm' with a specific abstract class?
    // formatChord returns a string, but maybe we need structured output?
    // Let's return structured output: { root, quality }

    return { root, quality: displayQuality, extension: '' };
}

export function formatChordString(chordSymbol: string, settings: FormatSettings): string {
    const { root, quality } = formatChord(chordSymbol, settings);
    return root + quality;
}
