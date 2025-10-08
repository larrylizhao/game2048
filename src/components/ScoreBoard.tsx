interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

/**
 * Score display component showing current score and best score
 */
export const ScoreBoard = ({ score, bestScore }: ScoreBoardProps) => {
  return (
    <div className="flex gap-3 bg-yellow-600 dark:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Score</div>
        <div className="text-xl font-bold">{score}</div>
      </div>
      <div className="border-l border-yellow-500 dark:border-yellow-600"></div>
      <div className="flex items-center gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Best</div>
        <div className="text-xl font-bold">{bestScore}</div>
      </div>
    </div>
  );
};
