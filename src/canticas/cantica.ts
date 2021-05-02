import { Canto } from '../cantos/canto';

export type Title = 'Inferno' | 'Purgatorio' | 'Paradiso';

export interface Cantica {
  title: Title;
  cantos: Canto;
}
