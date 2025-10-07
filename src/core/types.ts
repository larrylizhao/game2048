export type Cell = number | null;
export type Board = Cell[][];

export enum Direction {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
}

export enum GameStatus {
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost',
}

export interface GameState {
  board: Board;
  score: number;
  status: GameStatus;
}
