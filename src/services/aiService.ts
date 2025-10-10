import Anthropic from '@anthropic-ai/sdk';
import { Board, Direction } from '../core';
import { getLocalAIHint } from './localAI';

/**
 * Initialize Anthropic client
 * Note: dangerouslyAllowBrowser is only for local development
 */
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Validates if the AI response is a valid direction
 */
function isValidDirection(text: string): text is Direction {
  const validDirections: string[] = Object.values(Direction);
  return validDirections.includes(text);
}

/**
 * Builds the prompt for Claude AI to analyze the game board
 */
function buildPrompt(board: Board): string {
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

/**
 * Gets AI hint from Claude API
 * Internal function used by getAIHint
 *
 * @param board - The current game board
 * @param boardSize - Size of the board
 * @returns The suggested direction to move
 * @throws Error if API call fails or returns invalid direction
 */
async function getClaudeHint(board: Board, boardSize: number): Promise<Direction> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: buildPrompt(board),
    }],
  });

  // Extract text from response
  const textContent = message.content[0];
  if (textContent.type !== 'text') {
    throw new Error('Unexpected response format from AI');
  }

  const suggestion = textContent.text.trim().toLowerCase();

  // Validate the response
  if (!isValidDirection(suggestion)) {
    console.warn(`Invalid AI suggestion: ${suggestion}, falling back to local AI`);
    return getLocalAIHint(board, boardSize);
  }

  return suggestion;
}

/**
 * Gets AI hint for the best move based on current board state
 *
 * Strategy:
 * 1. First, try Claude API (high quality, slower)
 * 2. If API fails and useFallback=true, use local Expectimax algorithm (good quality, fast)
 * 3. If useFallback=false, throw the error
 *
 * @param board - The current game board
 * @param boardSize - Size of the board (default: 4)
 * @param useFallback - Whether to use local AI when API fails (default: true)
 * @returns The suggested direction to move
 * @throws Error if API call fails and useFallback is false
 */
export async function getAIHint(
  board: Board,
  boardSize: number = 4,
  useFallback: boolean = true
): Promise<Direction> {
  try {
    return await getClaudeHint(board, boardSize);
  } catch (error) {
    console.error('Failed to get Claude AI hint:', error);

    if (useFallback) {
      console.info('Falling back to local Expectimax AI');
      return getLocalAIHint(board, boardSize);
    }

    throw error;
  }
}
