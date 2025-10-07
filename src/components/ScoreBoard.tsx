interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

/**
 * Score display component showing current score and best score
 */
export const ScoreBoard = ({ score, bestScore }: ScoreBoardProps) => {
  return (
    <div className="flex gap-4">
      <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md">
        <div className="text-xs font-semibold uppercase tracking-wide">Score</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      <div className="bg-yellow-700 text-white px-6 py-3 rounded-lg shadow-md">
        <div className="text-xs font-semibold uppercase tracking-wide">Best</div>
        <div className="text-2xl font-bold">{bestScore}</div>
      </div>
    </div>
  );
};
