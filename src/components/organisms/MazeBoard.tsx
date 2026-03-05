import { useMemo } from 'react';
import type { CellType, Position, GamePhase } from '@/types/maze';
import { MazeOverlay } from '@components/organisms/MazeOverlay';
import { isSamePos } from '@/utils/mazeUtils';

interface MazeBoardProps {
  grid: CellType[][];
  playerPos: Position;
  goalPos: Position;
  visitedPath: Position[];
  phase: GamePhase;
  cellSize: number;
}

export function MazeBoard({
  grid,
  playerPos,
  goalPos,
  visitedPath,
  phase,
  cellSize,
}: MazeBoardProps) {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const boardWidth = cols * cellSize;
  const boardHeight = rows * cellSize;

  const visitedSet = useMemo(() => {
    return new Set(visitedPath.map((p) => `${p.row},${p.col}`));
  }, [visitedPath]);

  if (rows === 0) return null;

  return (
    <div
      className="relative border-2 border-gray-700 shadow-2xl"
      style={{ width: boardWidth, height: boardHeight }}
    >
      {/* 미로 셀 렌더링 */}
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const pos: Position = { row: r, col: c };
          const isPlayer = isSamePos(pos, playerPos);
          const isGoal = isSamePos(pos, goalPos);
          const isVisited = visitedSet.has(`${r},${c}`);

          let bg = '';
          if (cell === 0) {
            bg = 'bg-gray-900'; // 벽
          } else if (isGoal) {
            bg = 'bg-green-400'; // 도착지
          } else if (cell === 2) {
            bg = 'bg-red-500'; // 빠른 칸
          } else if (cell === 3) {
            bg = 'bg-blue-500'; // 느린 칸
          } else if (isVisited) {
            bg = 'bg-blue-900/40'; // 지나온 길
          } else {
            bg = 'bg-gray-100'; // 통로
          }

          return (
            <div
              key={`${r}-${c}`}
              className={`absolute ${bg}`}
              style={{
                left: c * cellSize,
                top: r * cellSize,
                width: cellSize,
                height: cellSize,
              }}
            >
              {/* 플레이어 원 */}
              {isPlayer && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full bg-yellow-400 shadow-lg shadow-yellow-300"
                    style={{
                      width: cellSize * 0.7,
                      height: cellSize * 0.7,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })
      )}

      {/* 펜 그리기 캔버스 오버레이 (분석 단계에서만 활성화) */}
      <MazeOverlay
        width={boardWidth}
        height={boardHeight}
        enabled={phase === 'analyzing'}
      />
    </div>
  );
}
