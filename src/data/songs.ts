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
                { chords: ['Bb△7'] },
                { chords: ['Eb△7'] },
                { chords: ['Aø7'] },
                { chords: ['D7b13'] },
                { chords: ['Gm6'] },
                { chords: ['%'], repeatEnd: 2 },
            ],
        },
        {
            label: 'B',
            bars: [
                { chords: ['Aø7'] },
                { chords: ['D7b13'] },
                { chords: ['Gm6'] },
                { chords: ['%'] },
                { chords: ['Cm7'] },
                { chords: ['F7'] },
                { chords: ['Bb△7'] },
                { chords: ['Eb△7'] },
            ],
        },
        {
            label: 'C',
            bars: [
                { chords: ['Aø7'] },
                { chords: ['D7b13'] },
                { chords: ['Gm7', 'Gb7'] },
                { chords: ['Fm7', 'E7'] },
                { chords: ['Aø7'] },
                { chords: ['D7b13'] },
                { chords: ['Gm6'] },
                { chords: ['%'] },
            ],
        }
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
                { chords: ['Db△7'] },
                { chords: ['Db△7'] },
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
                { chords: ['C△7'] },
                { chords: ['E7'] },
                { chords: ['F△7'] },
                { chords: ['G7'] },
                { chords: ['C△7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['C△7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
            ],
        },
        {
            label: 'A2',
            bars: [
                { chords: ['C△7'] },
                { chords: ['E7'] },
                { chords: ['F△7'] },
                { chords: ['G7'] },
                { chords: ['C△7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['C△7'] },
                { chords: ['Gm7', 'C7'] },
            ],
        },
        {
            label: 'B',
            bars: [
                { chords: ['F△7'] },
                { chords: ['F△7'] },
                { chords: ['C△7'] },
                { chords: ['C△7'] },
                { chords: ['D7'] },
                { chords: ['D7'] },
                { chords: ['Dm7'] },
                { chords: ['G7'] },
            ],
        },
        {
            label: 'A3',
            bars: [
                { chords: ['C△7'] },
                { chords: ['E7'] },
                { chords: ['F△7'] },
                { chords: ['G7'] },
                { chords: ['C△7', 'Am7'] },
                { chords: ['Dm7', 'G7'] },
                { chords: ['C△7'] },
                { chords: ['C△7'] },
            ],
        }
    ]
};

export const songLibrary: Song[] = [autumnLeaves, blueBossa, sunnySide];
