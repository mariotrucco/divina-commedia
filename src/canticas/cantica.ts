import { Canto } from '../cantos/canto';

export type CanticaTitle = 'Inferno' | 'Purgatorio' | 'Paradiso';

export interface Cantica {
  title: CanticaTitle;
  cantos: Canto;
}
