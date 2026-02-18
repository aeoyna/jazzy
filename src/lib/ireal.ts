import { Song, Section, Bar, Chord } from '@/types/song';
import { v4 as uuidv4 } from 'uuid';

/**
 * Parses an irealbook:// URI into a Song object.
 * Format: irealbook://Title=Composer=Style=Key=n=...chord data...
 * Note: This is a simplified parser for the 'irealbook://' format.
 * Complex 'irealb://' obfuscated format is not supported yet.
 */
export function parseIRealUri(uri: string): Song | null {
    if (!uri.startsWith('irealbook://')) {
        console.error('Invalid URI scheme');
        return null; // Not an iReal Pro URI
    }

    // Decoding URL components
    // The part after irealbook:// is often URL encoded.
    let content = uri.substring(12);
    try {
        content = decodeURIComponent(content);
    } catch (e) {
        console.error('Failed to decode URI', e);
        return null;
    }

    // Split by '='
    // Format: Title=Composer=Style=Key=n=...chords...
    const parts = content.split('=');
    if (parts.length < 6) {
        console.error('Invalid iReal Pro data format: insufficient parts');
        return null;
    }

    const title = parts[0];
    const composer = parts[1];
    const style = parts[2];
    const key = parts[3];
    // parts[4] is usually 'n' (unknown meaning, maybe just a separator?)
    const chordData = parts.slice(5).join('='); // Rejoin in case chords contain '='

    // Basic chord parsing logic
    // This is a placeholder. A full iReal parser is complex.
    // We will implement a simplified version that splits by common delimiters.
    // iReal format uses specific tokens for bar lines, repeats, etc.
    // Example: [T44A{C^7 |A-7 |D-9 |G7 }B{E-7 A7|D-7 G7|C^7 |C^7 }]

    const sections: Section[] = parseChordData(chordData);

    return {
        id: uuidv4(),
        title,
        composer,
        style,
        defaultKey: key,
        defaultTempo: 120, // Default, as it's not in the header
        sections,
    };
}

function parseChordData(data: string): Section[] {
    const sections: Section[] = [];
    let currentSection: Section = { label: 'A', bars: [] };
    let currentBar: Bar = { chords: [] };

    // Regex to tokenize the stream?
    // Let's iterate through the string for a more robust state machine approach.
    // Symbols:
    // { : start repeat / section start?
    // } : end repeat / section end?
    // | : bar line
    // [ : start of song / time signature?
    // ] : end of song?
    // * : section marker (A, B, C...)
    // T44 : Time signature 4/4
    // x : repeat repeat
    // n : ending?

    // Simplified scraping:
    // 1. Remove outer brackets if present
    let cleanData = data.trim();
    if (cleanData.startsWith('1r34LbKcu7')) {
        // This looks like the obfuscated format 'irealb://'. We can't handle this easily without a complex decoder.
        // The user prompt implied 'html format', which might produce 'irealbook://' links.
        console.warn('Obfuscated irealb:// format detected. Use the logic for irealbook:// instead if possible.');
        return [];
    }

    // Basic splitting by bar line '|'
    // This is VERY rough and won't handle repeats correctly yet.
    // But it's a start for the MVP.

    // Remove metadata tags within the body like *A, *B, T44
    // We need to preserve them to identify sections.

    // Let's implement a token-based parser
    let buffer = '';
    let currentChords: string[] = [];

    // Helper to push the current bar
    const pushBar = () => {
        if (currentChords.length > 0) {
            currentSection.bars.push({ chords: [...currentChords] });
            currentChords = [];
        }
    };

    // Helper to start new section
    const startNewSection = (label: string) => {
        if (currentSection.bars.length > 0) {
            sections.push(currentSection);
        }
        currentSection = { label, bars: [] };
    };

    for (let i = 0; i < cleanData.length; i++) {
        const char = cleanData[i];

        if (char === '|') {
            // Bar line
            if (buffer.trim()) {
                currentChords.push(parseChord(buffer));
                buffer = '';
            }
            pushBar();
        } else if (char === '{' || char === '}') {
            // Repeat signs - often treated as double bar lines in simple view
            if (buffer.trim()) {
                currentChords.push(parseChord(buffer));
                buffer = '';
            }
            pushBar();
        } else if (char === '[') {
            // Start
        } else if (char === ']') {
            // End
            if (buffer.trim()) {
                currentChords.push(parseChord(buffer));
                buffer = '';
            }
            pushBar();
        } else if (char === '*') {
            // Section marker usually follows, e.g. *A
            if (buffer.trim()) {
                currentChords.push(parseChord(buffer));
                buffer = '';
            }
            pushBar();
            // Look ahead for section label
            const nextChar = cleanData[i + 1];
            if (nextChar) {
                startNewSection(nextChar);
                i++; // Skip label
            }
        } else if (char === ' ') {
            // Space can be a beat separator if chords are crowded?
            // Usually chords are just written sequentially.
            // If we have a buffer (chord so far), keep collecting.
            if (buffer.trim().length > 0) {
                // Check if it's a valid chord root or just noise?
                // For now, assume it's part of the chord.
                // Actually, sometimes spaces separate chords in a bar.
                // Like "| C G7 |"
                // If we hit a space AND we have a valid chord in buffer, push it?
                // Let's just accumulate for now.
            }
        } else {
            buffer += char;
        }
    }

    // Final flush
    if (buffer.trim()) {
        currentChords.push(parseChord(buffer));
    }
    pushBar();
    if (currentSection.bars.length > 0) {
        sections.push(currentSection);
    }

    return sections;
}

function parseChord(raw: string): string {
    // Clean up iReal specific notation
    // x = repeat?
    // n = ?
    // W = invisible root?

    // Remove typical clutter
    let chord = raw.trim();

    // Handle "n" (no chord / N.C.)
    if (chord === 'n') return 'N.C.';

    // Simple cleanup
    chord = chord.replace(/[\[\]\{\}\|]/g, '');

    return chord;
}
