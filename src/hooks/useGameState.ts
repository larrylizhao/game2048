import { useState, useCallback } from 'react';
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

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  status: GameStatus;
}

export interface GameActions {
  move: (direction: Direction) => void;
  restart: () => void;
  continuePlaying: () => void;
}

/**
 * Custom hook for managing game state and actions
 */
export function useGameState(): GameState & GameActions {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing);

  /**
   * Handles a move in the specified direction
   */
  const move = useCallback((direction: Direction) => {
    // Ignore moves when game is not in playing state
    if (status !== GameStatus.Playing) {
      return;
    }

    // Attempt to merge the board
    const { board: newBoard, score: addedScore } = mergeBoard(board, direction);

    // Check if the board actually changed
    if (areBoardsEqual(board, newBoard)) {
      return; // No valid move, do nothing
    }

    // Add a random tile to the new board
    addRandomTile(newBoard);

    // Update board state
    setBoard(newBoard);

    // Update score
    const newScore = score + addedScore;
    setScore(newScore);

    // Update best score if needed
    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    // Check win condition
    if (hasWinningTile(newBoard)) {
      setStatus(GameStatus.Won);
      return;
    }

    // Check lose condition
    if (isGameOver(newBoard)) {
      setStatus(GameStatus.Lost);
    }
  }, [board, score, status, bestScore]);

  /**
   * Restarts the game with a new board
   */
  const restart = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setStatus(GameStatus.Playing);
  }, []);

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
    move,
    restart,
    continuePlaying,
  };
}
