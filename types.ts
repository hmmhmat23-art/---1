
export enum AthkarType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  SLEEP = 'SLEEP'
}

export interface Thikr {
  id: string;
  text: string;
  count: number;
  description?: string;
  benefit?: string;
  reference?: string;
}

export interface UserProgress {
  [thikrId: string]: number;
}

export interface Settings {
  fontSize: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  theme: 'light' | 'dark';
}
