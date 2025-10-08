import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Direction } from '../../core';
import type { Board } from '../../core';

// Create a mock create function that we can control
const mockCreate = vi.fn();

// Mock the Anthropic SDK module
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = {
        create: mockCreate,
      };
    },
  };
});

describe('aiService', () => {
  const mockBoard: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, null, null],
    [null, null, null, null],
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAIHint', () => {
    it('should return valid direction from AI response', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'left' }],
      });

      // Import after mock is set up
      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);
      expect(result).toBe(Direction.Left);
    });

    it('should handle uppercase AI responses', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'RIGHT' }],
      });

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);
      expect(result).toBe(Direction.Right);
    });

    it('should handle mixed case AI responses', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'Up' }],
      });

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);
      expect(result).toBe(Direction.Up);
    });

    it('should handle AI responses with whitespace', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: '  down  ' }],
      });

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);
      expect(result).toBe(Direction.Down);
    });

    it('should default to left for invalid AI responses', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'invalid-direction' }],
      });

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);
      expect(result).toBe(Direction.Left);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should throw error when API call fails', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      const { getAIHint } = await import('../aiService');
      await expect(getAIHint(mockBoard)).rejects.toThrow('API Error');
    });

    it('should throw error for non-text response type', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'image', data: 'base64data' }],
      });

      const { getAIHint } = await import('../aiService');
      await expect(getAIHint(mockBoard)).rejects.toThrow('Unexpected response format from AI');
    });

    it('should call API with correct parameters', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'left' }],
      });

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 100,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('2048 game AI expert'),
            }),
          ]),
        })
      );
    });

    it('should include board state in prompt', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'left' }],
      });

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      const callArgs = mockCreate.mock.calls[0][0];
      expect(callArgs.messages[0].content).toContain(JSON.stringify(mockBoard, null, 2));
    });
  });
});
