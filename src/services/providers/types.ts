import { Board, Direction } from '../../core';

/**
 * Unified interface for AI providers
 *
 * This abstraction allows easy addition of new AI services without modifying existing code,
 * following the Open-Closed Principle.
 */
export interface AIProvider {
  /** Display name of the provider */
  readonly name: string;

  /** Check if this provider is available (e.g., has API key configured) */
  isAvailable(): boolean;

  /** Get AI hint for the best move */
  getHint(board: Board, boardSize: number): Promise<Direction>;
}

/**
 * Validates if the AI response is a valid direction
 */
export function isValidDirection(text: string): text is Direction {
  const validDirections: string[] = Object.values(Direction);
  return validDirections.includes(text);
}

/**
 * Builds the prompt for AI to analyze the game board
 * Shared by all remote AI providers (Claude, Grok, etc.)
 */
export function buildPrompt(board: Board): string {
  const boardJson = JSON.stringify(board, null, 2);
  return `You are a 2048 game AI expert. Analyze the current board state and suggest the BEST move.

Current board (null = empty cell):
${boardJson}

Game Rules:
- When two tiles with the same number touch, they merge into one with double the value
- After each move, a new tile (2 or 4) appears in a random empty spot
- Goal: reach the 2048 tile or maximize score
- Avoid filling the board completely (game over)

Winning Strategy:
- Keep the highest tile in a corner (preferably top-left or bottom-left)
- Build tiles in descending order along one edge
- Maintain sorted rows/columns when possible
- Minimize moves that break the tile arrangement

Respond with ONLY ONE WORD from these options: left, right, up, or down`;
}
