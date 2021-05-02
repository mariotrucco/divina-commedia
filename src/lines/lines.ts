import { CanticaTitle } from '../canticas/cantica';
import { CantoTitle } from '../cantos/canto';

export interface Line {
  cantica: CanticaTitle;
  canto: CantoTitle;
  tercet: number;
  number: number;
  text: string;
}

export interface SearchResult {
  lines: Line[];
}
