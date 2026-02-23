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
                { chords: ['Cm7'], repeatStart: true, lyrics: 'The au-tumn / Since you' },
                { chords: ['F7'], lyrics: 'leaves / went' },
                { chords: ['Bbmaj7'], lyrics: 'drift by my / a-way the' },
                { chords: ['Ebmaj7'], lyrics: 'win-dow / days grow' },
                { chords: ['Am7b5'], lyrics: 'The au-tumn / long, And' },
                { chords: ['D7b9'], lyrics: 'leaves / soon Ill' },
                { chords: ['Gm6'], lyrics: 'of red and / hear old' },
                { chords: ['Gm6'], repeatEnd: 2, lyrics: 'gold / win-ters' },
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

export const sunnySide: Song = {
    id: 'sunny-side',
    title: 'On the Sunny Side of the Street',
    composer: 'Jimmy McHugh',
    style: 'Swing',
    defaultKey: 'C',
    defaultTempo: 120,
    sections: [
        {
            label: 'A1',
            bars: [
                { chords: ['Cmaj7'] },
                { chords: ['E7'] },
                { chords: ['Fmaj7'] },
                { chords: ['G7'] },
                { chords: ['Cmaj7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['Cmaj7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
            ],
        },
        {
            label: 'A2',
            bars: [
                { chords: ['Cmaj7'] },
                { chords: ['E7'] },
                { chords: ['Fmaj7'] },
                { chords: ['G7'] },
                { chords: ['Cmaj7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['Cmaj7'] },
                { chords: ['Gm7', 'C7'] },
            ],
        },
        {
            label: 'B',
            bars: [
                { chords: ['Fmaj7'] },
                { chords: ['Fmaj7'] },
                { chords: ['Cmaj7'] },
                { chords: ['Cmaj7'] },
                { chords: ['D7'] },
                { chords: ['D7'] },
                { chords: ['Dm7'] },
                { chords: ['G7'] },
            ],
        },
        {
            label: 'A3',
            bars: [
                { chords: ['Cmaj7'] },
                { chords: ['E7'] },
                { chords: ['Fmaj7'] },
                { chords: ['G7'] },
                { chords: ['Cmaj7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['Cmaj7'] },
                { chords: ['Cmaj7'] },
            ],
        }
    ]
};

export const songLibrary: Song[] = [autumnLeaves, blueBossa, sunnySide];
