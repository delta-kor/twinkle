type PageName = 'main' | 'exit' | 'artist_list' | 'add_music';
type Router = (page: PageName) => void;

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
