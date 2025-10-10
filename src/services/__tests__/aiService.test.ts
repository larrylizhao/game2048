import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Direction } from '../../core';
import type { Board } from '../../core';

// Mock providers
const mockClaudeProvider = {
  name: 'Claude',
  isAvailable: vi.fn(),
  getHint: vi.fn(),
};

const mockGrokProvider = {
  name: 'Grok',
  isAvailable: vi.fn(),
  getHint: vi.fn(),
};

const mockLocalProvider = {
  name: 'Local',
  isAvailable: vi.fn(),
  getHint: vi.fn(),
};

// Mock provider modules
vi.mock('../providers/ClaudeProvider', () => ({
  ClaudeProvider: vi.fn(() => mockClaudeProvider),
}));

vi.mock('../providers/GrokProvider', () => ({
  GrokProvider: vi.fn(() => mockGrokProvider),
}));

vi.mock('../providers/LocalProvider', () => ({
  LocalProvider: vi.fn(() => mockLocalProvider),
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

    // Default: all providers available and return left
    mockClaudeProvider.isAvailable.mockReturnValue(true);
    mockGrokProvider.isAvailable.mockReturnValue(true);
    mockLocalProvider.isAvailable.mockReturnValue(true);

    mockClaudeProvider.getHint.mockResolvedValue(Direction.Left);
    mockGrokProvider.getHint.mockResolvedValue(Direction.Right);
    mockLocalProvider.getHint.mockResolvedValue(Direction.Up);
  });

  describe('Provider Chain', () => {
    it('should use Claude provider when available', async () => {
      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);

      expect(result).toBe(Direction.Left);
      expect(mockClaudeProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);
      expect(mockGrokProvider.getHint).not.toHaveBeenCalled();
      expect(mockLocalProvider.getHint).not.toHaveBeenCalled();
    });

    it('should fallback to Grok when Claude is unavailable', async () => {
      mockClaudeProvider.isAvailable.mockReturnValue(false);

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);

      expect(result).toBe(Direction.Right);
      expect(mockClaudeProvider.getHint).not.toHaveBeenCalled();
      expect(mockGrokProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);
      expect(mockLocalProvider.getHint).not.toHaveBeenCalled();
    });

    it('should fallback to Grok when Claude fails', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClaudeProvider.getHint.mockRejectedValue(new Error('Claude API Error'));

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);

      expect(result).toBe(Direction.Right);
      expect(mockClaudeProvider.getHint).toHaveBeenCalled();
      expect(mockGrokProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);
      expect(mockLocalProvider.getHint).not.toHaveBeenCalled();

      consoleInfoSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should fallback to Local when both Claude and Grok fail', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClaudeProvider.getHint.mockRejectedValue(new Error('Claude Error'));
      mockGrokProvider.getHint.mockRejectedValue(new Error('Grok Error'));

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);

      expect(result).toBe(Direction.Up);
      expect(mockClaudeProvider.getHint).toHaveBeenCalled();
      expect(mockGrokProvider.getHint).toHaveBeenCalled();
      expect(mockLocalProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);

      consoleInfoSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should fallback to Local when both Claude and Grok are unavailable', async () => {
      mockClaudeProvider.isAvailable.mockReturnValue(false);
      mockGrokProvider.isAvailable.mockReturnValue(false);

      const { getAIHint } = await import('../aiService');
      const result = await getAIHint(mockBoard);

      expect(result).toBe(Direction.Up);
      expect(mockClaudeProvider.getHint).not.toHaveBeenCalled();
      expect(mockGrokProvider.getHint).not.toHaveBeenCalled();
      expect(mockLocalProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);
    });
  });

  describe('useFallback parameter', () => {
    it('should not include Local provider when useFallback is false', async () => {
      mockClaudeProvider.isAvailable.mockReturnValue(false);
      mockGrokProvider.isAvailable.mockReturnValue(false);

      const { getAIHint } = await import('../aiService');

      await expect(getAIHint(mockBoard, 4, false)).rejects.toThrow(
        'All AI providers failed'
      );
      expect(mockLocalProvider.getHint).not.toHaveBeenCalled();
    });

    it('should throw when all remote providers fail and useFallback is false', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClaudeProvider.getHint.mockRejectedValue(new Error('Claude Error'));
      mockGrokProvider.getHint.mockRejectedValue(new Error('Grok Error'));

      const { getAIHint } = await import('../aiService');

      await expect(getAIHint(mockBoard, 4, false)).rejects.toThrow(
        'All AI providers failed'
      );
      expect(mockLocalProvider.getHint).not.toHaveBeenCalled();

      consoleInfoSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('boardSize parameter', () => {
    it('should use default boardSize of 4 when not provided', async () => {
      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(mockClaudeProvider.getHint).toHaveBeenCalledWith(mockBoard, 4);
    });

    it('should pass custom boardSize to providers', async () => {
      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard, 5);

      expect(mockClaudeProvider.getHint).toHaveBeenCalledWith(mockBoard, 5);
    });

    it('should propagate boardSize through fallback chain', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClaudeProvider.getHint.mockRejectedValue(new Error('Error'));
      mockGrokProvider.getHint.mockRejectedValue(new Error('Error'));

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard, 6);

      expect(mockLocalProvider.getHint).toHaveBeenCalledWith(mockBoard, 6);

      consoleInfoSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Console logging', () => {
    it('should log when provider is not available', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      mockClaudeProvider.isAvailable.mockReturnValue(false);

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        'Claude AI: not available (missing API key)'
      );

      consoleInfoSpy.mockRestore();
    });

    it('should log when provider is trying', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Claude AI: trying...');

      consoleInfoSpy.mockRestore();
    });

    it('should log when provider succeeds', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(consoleInfoSpy).toHaveBeenCalledWith('Claude AI: success ✓');

      consoleInfoSpy.mockRestore();
    });

    it('should log when provider fails', async () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClaudeProvider.getHint.mockRejectedValue(new Error('API Error'));

      const { getAIHint } = await import('../aiService');
      await getAIHint(mockBoard);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Claude AI: failed',
        expect.any(Error)
      );

      consoleInfoSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
