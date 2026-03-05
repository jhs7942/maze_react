import { DifficultyCard } from '@components/molecules/DifficultyCard';
import { useMazeContext } from '@context/MazeContext';
import type { Difficulty } from '@/types/maze';

const DESCRIPTIONS: Record<Difficulty, string> = {
  easy: '11×11 작은 미로. 미로 찾기 입문용.',
  medium: '21×21 중간 미로. 집중력이 필요합니다.',
  hard: '31×31 큰 미로. 고수만을 위한 도전.',
};

export function DifficultySelectPage() {
  const { dispatch } = useMazeContext();

  function handleSelect(difficulty: Difficulty) {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🌀</div>
          <h1 className="text-4xl font-extrabold text-white mb-2">미로찾기</h1>
          <p className="text-gray-400">난이도를 선택하세요</p>
        </div>

        <div className="flex flex-col gap-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <DifficultyCard
              key={d}
              difficulty={d}
              description={DESCRIPTIONS[d]}
              onClick={() => handleSelect(d)}
            />
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          난이도가 높을수록 미로 크기가 커집니다
        </p>
      </div>
    </div>
  );
}
