import type { Difficulty, GamePhase } from '@/types/maze';
import { DifficultyBadge } from '@components/atoms/DifficultyBadge';
import { TimerDisplay } from '@components/atoms/TimerDisplay';

interface GameHeaderProps {
  difficulty: Difficulty;
  phase: GamePhase;
  analyzingTimeLeft: number;
  onSkip?: () => void;
}

const PHASE_LABEL: Partial<Record<GamePhase, string>> = {
  analyzing: '분석 단계',
  playing: '조작 단계',
};

export function GameHeader({ difficulty, phase, analyzingTimeLeft, onSkip }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-white font-bold text-lg">미로찾기</span>
        <DifficultyBadge difficulty={difficulty} />
        {PHASE_LABEL[phase] && (
          <span className="text-gray-400 text-sm">{PHASE_LABEL[phase]}</span>
        )}
      </div>

      {phase === 'analyzing' && (
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">남은 시간</span>
          <TimerDisplay seconds={analyzingTimeLeft} isUrgent={analyzingTimeLeft <= 10} />
          <button
            onClick={onSkip}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
          >
            스킵
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <span className="text-gray-300 text-sm">방향키로 이동하세요</span>
      )}
    </header>
  );
}
