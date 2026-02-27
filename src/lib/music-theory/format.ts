export const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4,
    F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
};

function normalizeAccidental(note: string): string {
    return note
        .replace(/♭/g, 'b')
        .replace(/♯/g, '#');
}

function getNoteIndex(note: string): number {
    return NOTE_TO_INDEX[normalizeAccidental(note)];
}

export function transposeNote(note: string, semitones: number): string {
    const idx = getNoteIndex(note);
    if (idx === undefined) return note;

    let newIdx = (idx + semitones) % 12;
    if (newIdx < 0) newIdx += 12;
    return NOTE_NAMES[newIdx];
}

export interface FormatSettings {
    transpose: number;
    minorDisplay: 'minus' | 'm' | 'small';
    useGermanB: boolean;
}

export function formatChord(chordSymbol: string, settings: FormatSettings): { root: string, bass: string, superscript: string, subscript: string } {
    const [mainChord, bassNote] = chordSymbol.split('/');
    const match = mainChord.match(/^([A-G][#b]?)(.*)$/);

    if (!match) return { root: chordSymbol, bass: '', superscript: '', subscript: '' };

    let root = normalizeAccidental(match[1]);
    const remainder = match[2];
    let bass = bassNote ? normalizeAccidental(bassNote) : '';

    if (settings.transpose !== 0) {
        root = transposeNote(root, settings.transpose);
        if (bass) bass = transposeNote(bass, settings.transpose);
    }

    if (settings.useGermanB) {
        if (root === 'B') root = 'H';
        if (bass === 'B') bass = 'H';
    }

    const normalized = remainder
        .replace(/\^/g, 'maj')
        .replace(/△/g, 'maj')
        .replace(/Δ/g, 'maj')
        .replace(/♭/g, 'b')
        .replace(/♯/g, '#');
    const lowered = normalized.toLowerCase();

    // Mapping for rendering symbols
    const isMajor7 = lowered === 'maj7' || lowered === 'm7' && remainder.includes('△'); // handle cases if any
    const isHalfDiminished = lowered === 'm7b5' || lowered === '-7b5' || lowered === 'ø' || lowered === 'ø7' || lowered === 'm7(b5)';
    const isDiminished = lowered === 'dim' || lowered === 'dim7' || lowered === 'o' || lowered === 'o7' || lowered === '°' || lowered === '°7';

    let superscript = '';
    let subscript = '';

    if (isMajor7 || normalized === 'maj7') {
        superscript = '△7';
        return { root, bass, superscript, subscript };
    }

    if (isHalfDiminished) {
        superscript = 'ø7';
        return { root, bass, superscript, subscript };
    }

    if (isDiminished) {
        superscript = lowered.endsWith('7') ? 'o7' : 'o';
        return { root, bass, superscript, subscript };
    }

    let isMinor = false;
    let suffix = normalized;

    if (normalized.startsWith('-')) {
        isMinor = true;
        suffix = normalized.substring(1);
    } else if (normalized.startsWith('m') && !lowered.startsWith('maj')) {
        isMinor = true;
        suffix = normalized.substring(1);
    }

    if (isMinor) {
        switch (settings.minorDisplay) {
            case 'minus':
                subscript = '-';
                break;
            case 'm':
            case 'small':
                subscript = 'm';
                break;
        }
    }

    superscript = suffix;
    return { root, bass, superscript, subscript };
}

export function formatChordString(chordSymbol: string, settings: FormatSettings): string {
    const { root, bass, superscript, subscript } = formatChord(chordSymbol, settings);
    const bassPart = bass ? `/${bass}` : '';
    return `${root}${subscript}${superscript}${bassPart}`;
}
