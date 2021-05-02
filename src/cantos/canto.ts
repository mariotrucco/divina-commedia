import { Verso } from '../versos/verso';

export type CantoTitle =
  | 'Canto I'
  | 'Canto II'
  | 'Canto III'
  | 'Canto IV'
  | 'Canto V'
  | 'Canto VI'
  | 'Canto VII'
  | 'Canto VIII'
  | 'Canto IX'
  | 'Canto X'
  | 'Canto XI'
  | 'Canto XII'
  | 'Canto XIII'
  | 'Canto XIV'
  | 'Canto XV'
  | 'Canto XVI'
  | 'Canto XVII'
  | 'Canto XVIII'
  | 'Canto IX'
  | 'Canto XX'
  | 'Canto XXI'
  | 'Canto XXII'
  | 'Canto XXIII'
  | 'Canto XXIV'
  | 'Canto XXV'
  | 'Canto XXVI'
  | 'Canto XXVII'
  | 'Canto XXVIII'
  | 'Canto XIX'
  | 'Canto XXX'
  | 'Canto XXXI'
  | 'Canto XXXII'
  | 'Canto XXXIII';

export interface Canto {
  title: CantoTitle;
  versos: Verso[];
}
