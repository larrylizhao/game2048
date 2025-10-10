import OpenAI from 'openai';
import { Board, Direction } from '../../core';
import { AIProvider, buildPrompt, isValidDirection } from './types';

/**
 * Grok AI provider using xAI API
 *
 * Uses Grok model via OpenAI-compatible API.
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
      model: 'grok-beta',
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
