import OpenAI from 'openai';
import { Board, Direction } from '../../core';
import { AIProvider, buildPrompt, isValidDirection } from './types';

/**
 * Grok AI provider using xAI API
 *
 * Uses Grok 4 Fast Non-Reasoning - optimized for quick responses and cost efficiency.
 * Perfect for game AI hints: 2M context window, 98% cheaper than Grok 4,
 * with lightning-fast responses ideal for real-time decision making.
 */
export class GrokProvider implements AIProvider {
  readonly name = 'Grok';
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GROK_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://api.x.ai/v1',
        dangerouslyAllowBrowser: true, // Only for local development
      });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async getHint(board: Board, _boardSize: number): Promise<Direction> {
    if (!this.client) {
      throw new Error('Grok API client not initialized');
    }

    const response = await this.client.chat.completions.create({
      model: 'grok-4-fast-non-reasoning',
      messages: [
        {
          role: 'user',
          content: buildPrompt(board),
        },
      ],
      max_tokens: 100,
    });

    const suggestion =
      response.choices[0]?.message?.content?.trim().toLowerCase() ?? '';

    // Validate the response
    if (!isValidDirection(suggestion)) {
      throw new Error(`Invalid direction from Grok: ${suggestion}`);
    }

    return suggestion;
  }
}
