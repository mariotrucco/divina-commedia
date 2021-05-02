import { Title as CanticaTitle } from '../canticas/cantica';
import { Title as CantoTitle } from '../cantos/canto';

export interface Verso {
  cantica: CanticaTitle;
  canto: CantoTitle;
  terzina: number;
  number: number;
  text: string;
}

export interface SearchResult {
  versos: Verso[];
}
