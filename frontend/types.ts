export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  url: string;
  duration: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}