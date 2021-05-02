import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';

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
