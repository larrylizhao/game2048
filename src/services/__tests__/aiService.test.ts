import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Direction } from '../../core';
import type { Board } from '../../core';

// Create a mock create function that we can control
const mockCreate = vi.fn();
const mockGetLocalAIHint = vi.fn();

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

// Mock the local AI module
vi.mock('../localAI', () => ({
  getLocalAIHint: mockGetLocalAIHint,
}));

describe('aiService', () => {
  const mockBoard: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, null, null],
    [null, null, null, null],
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default: local AI returns left
    mockGetLocalAIHint.mockReturnValue(Direction.Left);
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

    it('should fallback to local AI for invalid Claude responses', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'invalid-direction' }],
      });
      mockGetLocalAIHint.mockReturnValue(Direction.Right);

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard, 4);

      expect(result).toBe(Direction.Right);
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(mockGetLocalAIHint).toHaveBeenCalledWith(mockBoard, 4);

      consoleWarnSpy.mockRestore();
    });

    it('should fallback to local AI when API call fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      mockCreate.mockRejectedValue(new Error('API Error'));
      mockGetLocalAIHint.mockReturnValue(Direction.Up);

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard, 4);

      expect(result).toBe(Direction.Up);
      expect(mockGetLocalAIHint).toHaveBeenCalledWith(mockBoard, 4);
      expect(consoleInfoSpy).toHaveBeenCalledWith('Falling back to local Expectimax AI');

      consoleErrorSpy.mockRestore();
      consoleInfoSpy.mockRestore();
    });

    it('should throw error when API fails and useFallback is false', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));

      const { getAIHint } = await import('../aiService');
      await expect(getAIHint(mockBoard, 4, false)).rejects.toThrow('API Error');
      expect(mockGetLocalAIHint).not.toHaveBeenCalled();
    });

    it('should fallback to local AI for non-text response type', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      mockCreate.mockResolvedValue({
        content: [{ type: 'image', data: 'base64data' }],
      });
      mockGetLocalAIHint.mockReturnValue(Direction.Down);

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard, 4);

      expect(result).toBe(Direction.Down);
      expect(mockGetLocalAIHint).toHaveBeenCalledWith(mockBoard, 4);

      consoleErrorSpy.mockRestore();
      consoleInfoSpy.mockRestore();
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

    it('should use default boardSize of 4 when not provided', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));
      mockGetLocalAIHint.mockReturnValue(Direction.Left);

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      // Should call local AI with default boardSize of 4
      expect(mockGetLocalAIHint).toHaveBeenCalledWith(mockBoard, 4);
    });

    it('should pass custom boardSize to local AI', async () => {
      mockCreate.mockRejectedValue(new Error('API Error'));
      mockGetLocalAIHint.mockReturnValue(Direction.Right);

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard, 5);

      expect(mockGetLocalAIHint).toHaveBeenCalledWith(mockBoard, 5);
    });

    it('should prefer Claude AI over local AI when available', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'up' }],
      });

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard, 4);

      expect(result).toBe(Direction.Up);
      expect(mockGetLocalAIHint).not.toHaveBeenCalled();
    });
  });
});
