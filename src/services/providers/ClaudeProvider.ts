import Anthropic from '@anthropic-ai/sdk';
import { Board, Direction } from '../../core';
import { AIProvider, buildPrompt, isValidDirection } from './types';

/**
 * Claude AI provider using Anthropic API
 *
 * Uses Claude Sonnet 4.5 (released Sep 2025) - the world's best coding model,
 * perfect for complex reasoning and game strategy analysis.
 */
export class ClaudeProvider implements AIProvider {
  readonly name = 'Claude';
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true, // Only for local development
      });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  async getHint(board: Board, _boardSize: number): Promise<Direction> {
    if (!this.client) {
      throw new Error('Claude API client not initialized');
    }

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: buildPrompt(board),
        },
      ],
    });

    // Extract text from response
    const textContent = message.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response format from Claude API');
    }

    const suggestion = textContent.text.trim().toLowerCase();

    // Validate the response
    if (!isValidDirection(suggestion)) {
      throw new Error(`Invalid direction from Claude: ${suggestion}`);
    }

    return suggestion;
  }
}
