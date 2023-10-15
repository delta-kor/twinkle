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

interface YoutubeVideo {
  id: string;
  title: string;
  channel: string;
  tag: null | VideoTag;
}

type VideoTag =
  | 'main'
  | 'full'
  | 'full_hd'
  | '1take'
  | 'tower'
  | 'side'
  | 'live'
  | 'rehearsal'
  | 'single_full'
  | 'single_face';

type SegmentType = 'member' | 'full';

type Segment = MemberSegment | FullSegment;

interface SegmentBase {
  type: SegmentType;
  videos: YoutubeVideo[];
}

interface MemberSegment extends SegmentBase {
  type: 'member';
  member: string;
}

interface FullSegment extends SegmentBase {
  type: 'full';
}

type Program = 'mcountdown' | 'musicbank' | 'musiccore' | 'inkigayo' | 'theshow' | 'showchampion';

interface Session {
  id: string;
  program: Program;
  date: string;
  segments: Segment[];
}

interface Twinkle {
  id: string;
  artist: Artist;
  music: string;
  sessions: Session[];
}
