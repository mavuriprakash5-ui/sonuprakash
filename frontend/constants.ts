import { Point, Track } from './types.ts';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
export const GAME_SPEED_MS = 120;

export const TRACKS: Track[] = [
  {
    id: 'trk_01',
    title: 'AI_GEN_DRONE_SEQ_01',
    url: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_drone.ogg',
    duration: '0:45'
  },
  {
    id: 'trk_02',
    title: 'NEURAL_BREATH_SYNTH',
    url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg',
    duration: '0:32'
  },
  {
    id: 'trk_03',
    title: 'VOID_WIND_HARMONIC',
    url: 'https://actions.google.com/sounds/v1/science_fiction/space_wind.ogg',
    duration: '1:05'
  }
];