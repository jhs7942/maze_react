import { useMemo } from 'react';
import { useMazeContext } from '@context/MazeContext';
import { GameHeader } from '@components/organisms/GameHeader';
import { MazeBoard } from '@components/organisms/MazeBoard';
import { GameResultPopup } from '@components/molecules/GameResultPopup';
import { DirectionIndicator } from '@components/atoms/DirectionIndicator';
import type { Direction } from '@/types/maze';

/** 미로 크기에 따라 셀 픽셀 크기를 자동으로 결정 */
function calcCellSize(gridSize: number): number {
  const maxBoardPx = Math.min(window.innerWidth - 32, window.innerHeight - 120, 720);
  return Math.max(Math.floor(maxBoardPx / gridSize), 6);
}

export function MazeGamePage() {
  const { state, dispatch } = useMazeContext();
  const { grid, gridSize, playerPos, goalPos, visitedPath, phase, difficulty, analyzingTimeLeft, lastDirection } =
    state;

  const cellSize = useMemo(() => calcCellSize(gridSize), [gridSize]);

  function handleNewGame() {
    dispatch({ type: 'RESET_GAME' });
  }

  function handleSkip() {
    dispatch({ type: 'BEGIN_PLAYING' });
  }

  function handleDirectionChange(dir: Direction) {
    dispatch({ type: 'SET_DIRECTION', payload: { direction: dir } });
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      <GameHeader
        difficulty={difficulty}
        phase={phase}
        analyzingTimeLeft={analyzingTimeLeft}
        onSkip={handleSkip}
      />

      {/* 분석 단계 안내 */}
      {phase === 'analyzing' && (
        <div className="bg-blue-900/60 text-blue-200 text-center text-sm py-2 px-4">
          마우스로 미로 위에 경로를 그려 분석하세요. 시간이 다 되면 자동으로 시작됩니다.
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <MazeBoard
          grid={grid}
          playerPos={playerPos}
          goalPos={goalPos}
          visitedPath={visitedPath}
          phase={phase}
          cellSize={cellSize}
        />
      </main>

      {/* 방향 표시기 (분석/조작 단계) */}
      {(phase === 'analyzing' || phase === 'playing') && (
        <DirectionIndicator direction={lastDirection} onDirectionChange={handleDirectionChange} />
      )}

      {/* 게임 결과 팝업 */}
      {(phase === 'gameover' || phase === 'clear') && (
        <GameResultPopup result={phase} onNewGame={handleNewGame} />
      )}
    </div>
  );
}
