import type { Difficulty } from '@/types/maze';
import { DIFFICULTY_LABELS, GRID_SIZES } from '@/utils/mazeGenerator';

interface DifficultyCardProps {
  difficulty: Difficulty;
  description: string;
  onClick: () => void;
}

const BORDER_COLOR: Record<Difficulty, string> = {
  easy: 'border-green-400 hover:bg-green-50',
  medium: 'border-yellow-400 hover:bg-yellow-50',
  hard: 'border-red-400 hover:bg-red-50',
};

const ICON: Record<Difficulty, string> = {
  easy: '🟢',
  medium: '🟡',
  hard: '🔴',
};

export function DifficultyCard({ difficulty, description, onClick }: DifficultyCardProps) {
  const size = GRID_SIZES[difficulty];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left border-2 rounded-2xl p-6 transition-all duration-150
        ${BORDER_COLOR[difficulty]} bg-white shadow-sm hover:shadow-md active:scale-95
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{ICON[difficulty]}</span>
        <span className="text-xl font-bold text-gray-800">{DIFFICULTY_LABELS[difficulty]}</span>
        <span className="ml-auto text-sm text-gray-400 font-mono">{size} × {size}</span>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}
