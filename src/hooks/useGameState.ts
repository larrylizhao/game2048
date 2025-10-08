import { useState, useCallback, useEffect } from 'react';
import {
  Board,
  Direction,
  GameStatus,
  initBoard,
  mergeBoard,
  addRandomTile,
  isGameOver,
  hasWinningTile,
  areBoardsEqual,
} from '../core';
import { loadBestScore, saveBestScore } from '../storage/bestScoreStorage';

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  status: GameStatus;
  boardSize: number;
  winningTile: number;
}

export interface GameActions {
  move: (direction: Direction) => void;
  restart: () => void;
  continuePlaying: () => void;
}

export interface UseGameStateOptions {
  boardSize: number;
  winningTile: number;
}

/**
 * Custom hook for managing game state and actions
 */
export function useGameState({ boardSize, winningTile }: UseGameStateOptions): GameState & GameActions {
  const [board, setBoard] = useState<Board>(() => initBoard(boardSize));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => loadBestScore(boardSize));
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing);

  // Load best score when board size changes
  useEffect(() => {
    const savedBestScore = loadBestScore(boardSize);
    setBestScore(savedBestScore);
  }, [boardSize]);

  /**
   * Handles a move in the specified direction
   */
  const move = useCallback((direction: Direction) => {
    // Ignore moves when game is not in playing state
    if (status !== GameStatus.Playing) {
      return;
    }

    // Attempt to merge the board
    const { board: newBoard, score: addedScore } = mergeBoard(board, direction, boardSize);

    // Check if the board actually changed
    if (areBoardsEqual(board, newBoard, boardSize)) {
      return; // No valid move, do nothing
    }

    // Add a random tile to the new board
    addRandomTile(newBoard, boardSize);

    // Update board state
    setBoard(newBoard);

    // Update score
    const newScore = score + addedScore;
    setScore(newScore);

    // Update best score if needed
    if (newScore > bestScore) {
      setBestScore(newScore);
      saveBestScore(boardSize, newScore);
    }

    // Check win condition
    if (hasWinningTile(newBoard, boardSize, winningTile)) {
      setStatus(GameStatus.Won);
      return;
    }

    // Check lose condition
    if (isGameOver(newBoard, boardSize)) {
      setStatus(GameStatus.Lost);
    }
  }, [board, score, status, bestScore, boardSize, winningTile]);

  /**
   * Restarts the game with a new board
   */
  const restart = useCallback(() => {
    setBoard(initBoard(boardSize));
    setScore(0);
    setStatus(GameStatus.Playing);
  }, [boardSize]);

  /**
   * Allows the player to continue playing after winning
   */
  const continuePlaying = useCallback(() => {
    setStatus(GameStatus.Playing);
  }, []);

  return {
    board,
    score,
    bestScore,
    status,
    boardSize,
    winningTile,
    move,
    restart,
    continuePlaying,
  };
}
