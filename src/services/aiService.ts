import { Board, Direction } from '../core';
import { AIProvider } from './providers/types';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { GrokProvider } from './providers/GrokProvider';
import { LocalProvider } from './providers/LocalProvider';

/**
 * AI Provider Chain
 *
 * Implements Chain of Responsibility pattern to try multiple AI providers
 * in sequence until one succeeds.
 */
class AIProviderChain {
  constructor(private providers: AIProvider[]) {}

  /**
   * Gets AI hint by trying each provider in sequence
   *
   * @returns The suggested direction from the first successful provider
   * @throws Error if all providers fail
   */
  async getHint(board: Board, boardSize: number): Promise<Direction> {
    for (const provider of this.providers) {
      // Skip unavailable providers (e.g., missing API key)
      if (!provider.isAvailable()) {
        console.info(`${provider.name} AI: not available (missing API key)`);
        continue;
      }

      try {
        console.info(`${provider.name} AI: trying...`);
        const hint = await provider.getHint(board, boardSize);
        console.info(`${provider.name} AI: success ✓`);
        return hint;
      } catch (error) {
        console.error(`${provider.name} AI: failed`, error);
        // Continue to next provider
      }
    }

    throw new Error('All AI providers failed');
  }
}

/**
 * Gets AI hint for the best move based on current board state
 *
 * Strategy (in priority order):
 * 1. Claude API (highest quality, requires API key)
 * 2. Grok API (high quality, requires API key)
 * 3. Local Expectimax algorithm (good quality, always available)
 *
 * The first available provider will be used. If it fails, the next one is tried.
 *
 * @param board - The current game board
 * @param boardSize - Size of the board (default: 4)
 * @param useFallback - Whether to use local AI when remote APIs fail (default: true)
 * @returns The suggested direction to move
 * @throws Error if all providers fail (only when useFallback is false and remote APIs fail)
 */
export async function getAIHint(
  board: Board,
  boardSize: number = 4,
  useFallback: boolean = true
): Promise<Direction> {
  // Build provider chain based on configuration
  const providers: AIProvider[] = [
    new ClaudeProvider(),
    new GrokProvider(),
  ];

  // Add local fallback if enabled
  if (useFallback) {
    providers.push(new LocalProvider());
  }

  const chain = new AIProviderChain(providers);
  return chain.getHint(board, boardSize);
}
