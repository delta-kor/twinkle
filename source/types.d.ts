type PageName = 'main' | 'artist_list';
type Router = (page: PageName) => void;

interface SelectItem {
  label: string;
  value: string;
}
