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

export function parseChordData(data: string): Section[] {
    const sections: Section[] = [];
    let currentSection: Section = { label: 'A', bars: [] };
    let currentBar: Bar = { chords: [] };

    // 1. Clean up outer spaces and specific obscured formats
    let cleanData = data.trim();
    if (cleanData.startsWith('1r34LbKcu7')) {
        console.warn('Obfuscated irealb:// format detected. Use the logic for irealbook:// instead if possible.');
        return [];
    }

    // 2. Remove structural or playback metadata that breaks chords
    cleanData = cleanData.replace(/T\d{2}/g, ''); // Remove time signatures

    let buffer = '';
    let currentChords: string[] = [];

    let pendingRepeatStart = false;
    let pendingLyrics = '';
    let isLyricsMarker = false;

    // Helper to push the current bar
    const pushBar = (explicit: boolean = false, isRepeatEnd: boolean = false) => {
        let barToPush: Bar | null = null;

        if (currentChords.length > 0) {
            barToPush = { chords: [...currentChords] };
            currentChords = [];
        } else if (explicit) {
            // If explicit barline `|` but no chords, it's an empty bar (repeat previous)
            barToPush = { chords: [] };
        }

        if (barToPush) {
            if (pendingRepeatStart) {
                barToPush.repeatStart = true;
                pendingRepeatStart = false; // reset
            }
            if (pendingLyrics) {
                barToPush.lyrics = pendingLyrics.trim();
                pendingLyrics = ''; // reset
            }
            if (isRepeatEnd) {
                barToPush.repeatEnd = 2; // Default to 2 repeats for iReal syntax '}'
            }
            currentSection.bars.push(barToPush);
        } else if (isRepeatEnd && currentSection.bars.length > 0) {
            // Apply repeat end to the last pushed bar if there's no new bar
            currentSection.bars[currentSection.bars.length - 1].repeatEnd = 2;
        }
    };

    // Helper to start new section
    const startNewSection = (label: string) => {
        if (currentSection.bars.length > 0 || currentChords.length > 0) {
            if (currentChords.length > 0) pushBar();
            // Only push if it has content, or if it's not the default empty first section
            if (currentSection.bars.length > 0) {
                sections.push(currentSection);
            }
        }
        currentSection = { label, bars: [] };
    };

    let isSectionMarker = false;

    for (let i = 0; i < cleanData.length; i++) {
        const char = cleanData[i];

        if (isLyricsMarker) {
            if (char === '>') {
                isLyricsMarker = false;
            } else {
                pendingLyrics += char;
            }
            continue;
        }

        if (char === '<') {
            isLyricsMarker = true;
            if (buffer.trim()) {
                const parsed = parseChord(buffer);
                if (parsed) currentChords.push(parsed);
                buffer = '';
            }
            if (pendingLyrics && !pendingLyrics.endsWith(' ')) pendingLyrics += ' ';
            continue;
        }

        if (isSectionMarker) {
            // Wait for a valid section label (A, B, C, V, i, etc)
            if (char === '[' || char === '{' || char === ']' || char === '}') {
                continue;
            }
            if (char !== ' ') {
                isSectionMarker = false;
                startNewSection(char);
                continue;
            }
        }

        if (char === '*') {
            isSectionMarker = true;
            // Often before `*`, there is a spurious layout character or the section name duplicated, e.g. `[B*B`
            if (buffer.trim().length === 1 && /[A-Z]/.test(buffer.trim())) {
                buffer = ''; // It's just a duplicate label, ignore it
            } else if (buffer.trim()) {
                const parsed = parseChord(buffer);
                if (parsed) currentChords.push(parsed);
                buffer = '';
            }
        } else if (char === '|' || char === '[' || char === ']' || char === '{' || char === '}') {
            if (buffer.trim()) {
                const parsed = parseChord(buffer);
                if (parsed) currentChords.push(parsed);
                buffer = '';
            }
            if (char === '{') {
                pendingRepeatStart = true;
            } else if (char === '}') {
                pushBar(true, true); // Close section with repeatEnd, explicit bar
            } else if (char === '|') {
                pushBar(true);
            } else if (char === ']') {
                pushBar(true); // Close section, explicit bar
            }
        } else if (char === ' ') {
            if (buffer.trim()) {
                const parsed = parseChord(buffer);
                if (parsed) currentChords.push(parsed);
                buffer = '';
            }
            // Count spaces to infer empty beats or bars
            let spaceCount = 1;
            while (i + 1 < cleanData.length && cleanData[i + 1] === ' ') {
                spaceCount++;
                i++;
            }
            // In iReal format, a single space just separates chords. 
            // Multiple spaces (e.g., 2, 3) often mean empty bars if | is missing.
            // iReal uses layout spacing. Usually 2 spaces = 1 empty bar.
            // If there's 6 spaces, that's 3 empty bars.
            if (spaceCount > 1) {
                // If we have chords pending, flush them to the current bar first
                if (currentChords.length > 0) {
                    pushBar(true);
                }
                let carryOvers = Math.floor(spaceCount / 2);

                // Peek at next non-space character
                const nextChar = i + 1 < cleanData.length ? cleanData[i + 1] : '';
                if (nextChar === '|' || nextChar === '}' || nextChar === ']') {
                    // The upcoming character will close the bar.
                    // By decrementing, we keep the total at exactly `carryOvers`, letting the closing marker handle the final bar.
                    if (carryOvers > 0) {
                        carryOvers--;
                    }
                }

                for (let s = 0; s < carryOvers; s++) {
                    pushBar(true); // Push an explicit empty bar
                }
            }
        } else {
            buffer += char;
        }
    }

    // Final flush
    if (buffer.trim()) {
        const parsed = parseChord(buffer);
        if (parsed) currentChords.push(parsed);
    }
    if (currentChords.length > 0) {
        pushBar();
    }
    if (currentSection.bars.length > 0) {
        sections.push(currentSection);
    }

    // Post-process to remove completely empty sections (like trailing ones)
    const finalSections = sections.filter(sec => sec.bars.length > 0);

    // Quick heuristic: iReal uses arbitrary spaces for alignment which can miscalculate bars by 1.
    // E.g., a section with 9 bars often means 8 bars with a trailing layout space block.
    // If it's 9, 17, 13, 5 bars, pop the last empty bar if it's completely empty.
    finalSections.forEach(sec => {
        const len = sec.bars.length;
        if (len === 5 || len === 9 || len === 13 || len === 17) {
            const lastBar = sec.bars[len - 1];
            if (lastBar.chords.length === 0 || (lastBar.chords.length === 1 && lastBar.chords[0] === '')) {
                sec.bars.pop();
            }
        }
    });

    return finalSections;
}

function parseChord(raw: string): string {
    // Remove typical clutter
    let chord = raw.trim();

    // Handle "n" (no chord / N.C.)
    if (chord === 'n') return 'N.C.';
    if (chord === 'l') return ''; // 'l' is often normal bar line in some formats?
    if (chord === 'x' || chord === 'r') return ''; // repeats

    // Clean brackets
    chord = chord.replace(/[\[\]\{\}\|]/g, '');

    return chord;
}

/**
 * Converts a parsed Song object back into a simplified raw iReal string.
 * This is used to populate the text area in the ScoreEditor.
 */
export function songToIRealString(song: Song): string {
    let rawString = '';

    song.sections.forEach(section => {
        let sectionStr = `*${section.label} `; // e.g. *A 

        section.bars.forEach((bar, index) => {
            const isFirst = index === 0;
            const isLast = index === section.bars.length - 1;

            if (bar.repeatStart) {
                sectionStr += '{';
            } else if (isFirst) {
                sectionStr += '[';
            } else {
                sectionStr += '|';
            }

            if (bar.chords.length === 0) {
                sectionStr += ' '; // Empty bar
            } else {
                sectionStr += bar.chords.join(' ');
            }

            if (bar.lyrics) {
                sectionStr += `<${bar.lyrics}>`;
            }

            if (bar.repeatEnd) {
                sectionStr += '}';
            } else if (isLast) {
                sectionStr += ']';
            }

            // Add spacing between bars for readability and safe parsing
            if (!isLast || bar.repeatEnd) {
                sectionStr += ' ';
            }
        });

        rawString += sectionStr + ' ';
    });

    return rawString.trim();
}
