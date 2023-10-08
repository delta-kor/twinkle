type PageName =
  | 'main'
  | 'exit'
  | 'artist_list'
  | 'add_music'
  | 'twinkle_list'
  | 'twinkle'
  | 'add_session'
  | 'remove_session';

type Router = (page: PageName, state?: any) => void;

interface SelectItem {
  label: string;
  value: string;
}

type ArtistType = 'group' | 'solo';

type Artist = GroupArtist | SoloArtist;

interface ArtistBase {
  id: string;
  name: string;
  type: ArtistType;
}

interface GroupArtist extends ArtistBase {
  type: 'group';
  members: string[];
}

interface SoloArtist extends ArtistBase {
  type: 'solo';
}

type Program = 'mcountdown' | 'musicbank' | 'musiccore' | 'inkigayo' | 'theshow' | 'showchampion';

interface Session {
  id: string;
  program: Program;
  date: string;
}

interface Twinkle {
  id: string;
  artist: Artist;
  music: string;
  sessions: Session[];
}
