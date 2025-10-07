import Anthropic from '@anthropic-ai/sdk';
import { Board, Direction } from '../core';

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
 * Gets AI hint for the best move based on current board state
 * @param board - The current game board
 * @returns The suggested direction to move
 * @throws Error if API call fails or returns invalid direction
 */
export async function getAIHint(board: Board): Promise<Direction> {
  try {
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
      console.warn(`Invalid AI suggestion: ${suggestion}, defaulting to left`);
      return Direction.Left;
    }

    return suggestion;
  } catch (error) {
    console.error('Failed to get AI hint:', error);
    throw error;
  }
}
