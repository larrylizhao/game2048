import {
  Board,
  Direction,
  mergeBoard,
  getEmptyCells,
  areBoardsEqual,
} from '../core';

/**
 * Configuration for Expectimax search algorithm
 */
interface SearchConfig {
  /** Maximum search depth */
  depth: number;
  /** Maximum number of empty cells to sample in chance nodes (performance optimization) */
  maxChanceSamples: number;
  /** Probability of spawning a 2 tile (vs 4 tile) */
  prob2: number;
}

/**
 * Weights for heuristic evaluation function
 */
interface EvaluationWeights {
  /** Weight for empty cells (more empty = better) */
  empty: number;
  /** Weight for monotonicity (ordered rows/columns) */
  monotonicity: number;
  /** Weight for smoothness (similar adjacent values) */
  smoothness: number;
  /** Weight for having max tile in corner */
  corner: number;
}

/**
 * Default search configuration
 * Tuned for balance between performance (~50-100ms) and quality
 */
const DEFAULT_CONFIG: SearchConfig = {
  depth: 3,
  maxChanceSamples: 6,
  prob2: 0.9,
};

/**
 * Default evaluation weights
 * Based on successful 2048 AI implementations
 */
const DEFAULT_WEIGHTS: EvaluationWeights = {
  empty: 2.7,
  monotonicity: 1.0,
  smoothness: 0.1,
  corner: 1.0,
};

// ============================================================================
// Evaluation Functions (Heuristics)
// ============================================================================

/**
 * Counts empty cells on the board
 * More empty cells = more freedom to move
 */
function countEmptyCells(board: Board, boardSize: number): number {
  return getEmptyCells(board, boardSize).length;
}

/**
 * Calculates monotonicity score
 * Rewards boards where values increase/decrease consistently along rows and columns
 *
 * Strategy: Keep large tiles organized along edges
 */
function calculateMonotonicity(board: Board, boardSize: number): number {
  let score = 0;

  // Check rows
  for (let row = 0; row < boardSize; row++) {
    let increasing = 0;
    let decreasing = 0;

    for (let col = 0; col < boardSize - 1; col++) {
      const current = board[row][col] ?? 0;
      const next = board[row][col + 1] ?? 0;

      if (current < next) increasing++;
      if (current > next) decreasing++;
    }

    // Reward consistent direction (all increasing OR all decreasing)
    score += Math.max(increasing, decreasing);
  }

  // Check columns
  for (let col = 0; col < boardSize; col++) {
    let increasing = 0;
    let decreasing = 0;

    for (let row = 0; row < boardSize - 1; row++) {
      const current = board[row][col] ?? 0;
      const next = board[row + 1][col] ?? 0;

      if (current < next) increasing++;
      if (current > next) decreasing++;
    }

    score += Math.max(increasing, decreasing);
  }

  return score;
}

/**
 * Calculates smoothness score
 * Rewards boards where adjacent cells have similar values
 *
 * Strategy: Similar adjacent values are easier to merge
 */
function calculateSmoothness(board: Board, boardSize: number): number {
  let smoothness = 0;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const value = board[row][col] ?? 0;
      if (value === 0) continue;

      // Compare with right neighbor
      if (col < boardSize - 1) {
        const right = board[row][col + 1] ?? 0;
        if (right !== 0) {
          smoothness -= Math.abs(Math.log2(value) - Math.log2(right));
        }
      }

      // Compare with bottom neighbor
      if (row < boardSize - 1) {
        const bottom = board[row + 1][col] ?? 0;
        if (bottom !== 0) {
          smoothness -= Math.abs(Math.log2(value) - Math.log2(bottom));
        }
      }
    }
  }

  return smoothness;
}

/**
 * Calculates corner bonus
 * Rewards having the maximum tile in a corner position
 *
 * Strategy: Keeping max tile in corner provides stability
 */
function calculateCornerBonus(board: Board, boardSize: number): number {
  const maxValue = Math.max(
    ...board.flat().map(cell => cell ?? 0)
  );

  const corners = [
    board[0][0],
    board[0][boardSize - 1],
    board[boardSize - 1][0],
    board[boardSize - 1][boardSize - 1],
  ];

  return corners.some(corner => corner === maxValue) ? maxValue : 0;
}

/**
 * Evaluates board state using weighted heuristic function
 *
 * Returns higher score for better board positions
 */
function evaluateBoard(
  board: Board,
  boardSize: number,
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): number {
  const emptyScore = countEmptyCells(board, boardSize);
  const monotonicityScore = calculateMonotonicity(board, boardSize);
  const smoothnessScore = calculateSmoothness(board, boardSize);
  const cornerScore = calculateCornerBonus(board, boardSize);

  return (
    weights.empty * emptyScore +
    weights.monotonicity * monotonicityScore +
    weights.smoothness * smoothnessScore +
    weights.corner * cornerScore
  );
}

// ============================================================================
// Expectimax Search Algorithm
// ============================================================================

/**
 * Simulates player move and returns resulting board
 * Returns null if move doesn't change the board
 */
function simulateMove(
  board: Board,
  direction: Direction,
  boardSize: number
): Board | null {
  const { board: newBoard } = mergeBoard(board, direction, boardSize);

  // Move is invalid if board didn't change
  if (areBoardsEqual(board, newBoard, boardSize)) {
    return null;
  }

  return newBoard;
}

/**
 * Maximizer node (Player's turn)
 * Returns the best expected score the player can achieve
 */
function maximizeNode(
  board: Board,
  boardSize: number,
  depth: number,
  config: SearchConfig,
  weights: EvaluationWeights
): number {
  // Base case: reached depth limit
  if (depth === 0) {
    return evaluateBoard(board, boardSize, weights);
  }

  let maxScore = -Infinity;

  // Try each possible direction
  for (const direction of Object.values(Direction)) {
    const newBoard = simulateMove(board, direction, boardSize);

    if (!newBoard) continue; // Skip invalid moves

    // Recursively evaluate chance node
    const score = chanceNode(newBoard, boardSize, depth - 1, config, weights);
    maxScore = Math.max(maxScore, score);
  }

  // If no valid moves, return current evaluation
  return maxScore === -Infinity
    ? evaluateBoard(board, boardSize, weights)
    : maxScore;
}

/**
 * Chance node (Random tile spawn)
 * Returns the expected score considering all possible tile spawns
 */
function chanceNode(
  board: Board,
  boardSize: number,
  depth: number,
  config: SearchConfig,
  weights: EvaluationWeights
): number {
  const emptyCells = getEmptyCells(board, boardSize);

  if (emptyCells.length === 0) {
    return evaluateBoard(board, boardSize, weights);
  }

  // Performance optimization: limit number of cells to evaluate
  const cellsToEvaluate = emptyCells.slice(0, config.maxChanceSamples);
  const probability = 1 / emptyCells.length;

  let expectedScore = 0;

  for (const [row, col] of cellsToEvaluate) {
    // Try spawning a 2 tile (90% probability)
    const board2 = board.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? 2 : c)) : [...r]
    );
    const score2 = maximizeNode(board2, boardSize, depth, config, weights);
    expectedScore += config.prob2 * probability * score2;

    // Try spawning a 4 tile (10% probability)
    const board4 = board.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? 4 : c)) : [...r]
    );
    const score4 = maximizeNode(board4, boardSize, depth, config, weights);
    expectedScore += (1 - config.prob2) * probability * score4;
  }

  return expectedScore;
}

/**
 * Main Expectimax search entry point
 * Returns the best direction to move
 */
function expectimax(
  board: Board,
  boardSize: number,
  config: SearchConfig = DEFAULT_CONFIG,
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): Direction {
  let bestDirection = Direction.Left;
  let bestScore = -Infinity;

  // Evaluate each possible first move
  for (const direction of Object.values(Direction)) {
    const newBoard = simulateMove(board, direction, boardSize);

    if (!newBoard) continue; // Skip invalid moves

    // Calculate expected score for this move
    const score = chanceNode(newBoard, boardSize, config.depth - 1, config, weights);

    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  return bestDirection;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Gets AI hint using local Expectimax algorithm
 *
 * This is a fallback when Claude API is unavailable.
 * Performance: ~50-100ms on 4x4 board
 * Quality: Good but not as sophisticated as Claude
 *
 * @param board - Current game board state
 * @param boardSize - Size of the board (typically 4)
 * @returns Suggested direction to move
 */
export function getLocalAIHint(board: Board, boardSize: number): Direction {
  return expectimax(board, boardSize);
}
