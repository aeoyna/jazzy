/**
 * Licensed Song Tags
 * 
 * These are songs that the platform has licensed.
 * Users can only publish arrangements of songs in this list.
 * Managed by the platform administrators.
 */

export interface LicensedSong {
    id: string;
    title: string;
    composer: string;
    /** Human-readable label like "Autumn Leaves — Joseph Kosma" */
    label: string;
}

export const LICENSED_SONGS: LicensedSong[] = [
    { id: 'autumn-leaves', title: 'Autumn Leaves', composer: 'Joseph Kosma', label: 'Autumn Leaves — Joseph Kosma' },
    { id: 'blue-bossa', title: 'Blue Bossa', composer: 'Kenny Dorham', label: 'Blue Bossa — Kenny Dorham' },
    { id: 'sunny-side', title: 'On the Sunny Side of the Street', composer: 'Jimmy McHugh', label: 'On the Sunny Side of the Street — Jimmy McHugh' },
    { id: 'all-the-things', title: 'All the Things You Are', composer: 'Jerome Kern', label: 'All the Things You Are — Jerome Kern' },
    { id: 'fly-me', title: 'Fly Me to the Moon', composer: 'Bart Howard', label: 'Fly Me to the Moon — Bart Howard' },
    { id: 'take-five', title: 'Take Five', composer: 'Paul Desmond', label: 'Take Five — Paul Desmond' },
    { id: 'so-what', title: 'So What', composer: 'Miles Davis', label: 'So What — Miles Davis' },
    { id: 'misty', title: 'Misty', composer: 'Erroll Garner', label: 'Misty — Erroll Garner' },
    { id: 'girl-from-ipanema', title: 'The Girl from Ipanema', composer: 'Antônio Carlos Jobim', label: 'The Girl from Ipanema — A.C. Jobim' },
    { id: 'summertime', title: 'Summertime', composer: 'George Gershwin', label: 'Summertime — George Gershwin' },
    { id: 'round-midnight', title: "'Round Midnight", composer: 'Thelonious Monk', label: "'Round Midnight — Thelonious Monk" },
    { id: 'my-funny-valentine', title: 'My Funny Valentine', composer: 'Richard Rodgers', label: 'My Funny Valentine — Richard Rodgers' },
    { id: 'night-and-day', title: 'Night and Day', composer: 'Cole Porter', label: 'Night and Day — Cole Porter' },
    { id: 'stella-by-starlight', title: 'Stella by Starlight', composer: 'Victor Young', label: 'Stella by Starlight — Victor Young' },
    { id: 'there-will-never', title: 'There Will Never Be Another You', composer: 'Harry Warren', label: 'There Will Never Be Another You — Harry Warren' },
    { id: 'just-friends', title: 'Just Friends', composer: 'John Klenner', label: 'Just Friends — John Klenner' },
    { id: 'cherokee', title: 'Cherokee', composer: 'Ray Noble', label: 'Cherokee — Ray Noble' },
    { id: 'i-got-rhythm', title: 'I Got Rhythm', composer: 'George Gershwin', label: 'I Got Rhythm — George Gershwin' },
    { id: 'giant-steps', title: 'Giant Steps', composer: 'John Coltrane', label: 'Giant Steps — John Coltrane' },
    { id: 'body-and-soul', title: 'Body and Soul', composer: 'Johnny Green', label: 'Body and Soul — Johnny Green' },
];
