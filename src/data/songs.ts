import { Song } from '@/types/song';

export const autumnLeaves: Song = {
    id: 'autumn-leaves',
    title: 'Autumn Leaves',
    composer: 'Joseph Kosma',
    style: 'Swing',
    defaultKey: 'Gm',
    defaultTempo: 160,
    sections: [
        {
            label: 'A',
            bars: [
                { chords: ['Cm7'], repeatStart: true },
                { chords: ['F7'] },
                { chords: ['Bbmaj7'] },
                { chords: ['Ebmaj7'] },
                { chords: ['Am7b5'] },
                { chords: ['D7b9'] },
                { chords: ['Gm6'] },
                { chords: ['Gm6'], repeatEnd: 2 },
            ],
        },
        {
            label: 'B',
            bars: [
                { chords: ['Am7b5'] },
                { chords: ['D7b9'] },
                { chords: ['Gm7', 'C7'] }, // Two chords in one bar
                { chords: ['Fm7', 'Bb7'] },
                { chords: ['Eb7', 'D7'] }, // Turnaround-ish
                { chords: ['Gm6'] },
                { chords: ['Am7b5'] },
                { chords: ['D7b9'] },
                { chords: ['Gm7', 'C7'] },
                { chords: ['Fm7', 'Bb7'] },
                { chords: ['Eb7', 'D7'] },
                { chords: ['Gm6'] },
            ],
        },
    ],
};


export const blueBossa: Song = {
    id: 'blue-bossa',
    title: 'Blue Bossa',
    composer: 'Kenny Dorham',
    style: 'Bossa Nova',
    defaultKey: 'Cm',
    defaultTempo: 140,
    sections: [
        {
            label: 'A',
            bars: [
                { chords: ['Cm7'] },
                { chords: ['Cm7'] },
                { chords: ['Fm7'] },
                { chords: ['Fm7'] },
                { chords: ['Dm7b5'] },
                { chords: ['G7alt'] },
                { chords: ['Cm7'] },
                { chords: ['Cm7'] },
            ],
        },
        {
            label: 'B',
            bars: [
                { chords: ['Ebm7'] },
                { chords: ['Ab7'] },
                { chords: ['Dbmaj7'] },
                { chords: ['Dbmaj7'] },
                { chords: ['Dm7b5'] },
                { chords: ['G7alt'] },
                { chords: ['Cm7'] },
                { chords: ['Dm7b5', 'G7alt'] },
            ],
        }
    ]
};

export const songLibrary: Song[] = [autumnLeaves, blueBossa];
