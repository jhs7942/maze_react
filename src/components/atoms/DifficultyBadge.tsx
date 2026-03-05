import type { Difficulty } from '@/types/maze';
import { DIFFICULTY_LABELS } from '@/utils/mazeGenerator';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const COLOR: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLOR[difficulty]}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
