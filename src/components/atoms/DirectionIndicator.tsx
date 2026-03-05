import type { Direction } from '@/types/maze';

interface DirectionIndicatorProps {
  direction: Direction;
  onDirectionChange: (dir: Direction) => void;
}

const ARROWS: { dir: Direction; label: string; gridArea: string }[] = [
  { dir: 'up',    label: '↑', gridArea: '1 / 2' },
  { dir: 'left',  label: '←', gridArea: '2 / 1' },
  { dir: 'down',  label: '↓', gridArea: '2 / 2' },
  { dir: 'right', label: '→', gridArea: '2 / 3' },
];

export function DirectionIndicator({ direction, onDirectionChange }: DirectionIndicatorProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
      <span className="text-gray-400 text-xs">방향</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 2.5rem)', gridTemplateRows: 'repeat(2, 2.5rem)', gap: '0.25rem' }}>
        {ARROWS.map(({ dir, label, gridArea }) => (
          <button
            key={dir}
            onClick={() => onDirectionChange(dir)}
            style={{ gridArea }}
            className={`
              flex items-center justify-center rounded text-lg font-bold transition-colors
              ${direction === dir
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
