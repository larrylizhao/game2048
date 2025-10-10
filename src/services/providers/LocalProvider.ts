import { Board, Direction } from '../../core';
import { getLocalAIHint } from '../localAI';
import { AIProvider } from './types';

/**
 * Local AI provider using Expectimax algorithm
 *
 * This provider is always available and serves as a fallback
 * when remote AI services (Claude, Grok) are unavailable.
 *
 * Performance: ~50-100ms on 4x4 board
 * Quality: Good but not as sophisticated as Claude/Grok
 */
export class LocalProvider implements AIProvider {
  readonly name = 'Local';

  isAvailable(): boolean {
    // Local AI is always available
    return true;
  }

  async getHint(board: Board, boardSize: number): Promise<Direction> {
    // Wrap sync function in async context
    return getLocalAIHint(board, boardSize);
  }
}
