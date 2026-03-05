import type { Direction, Position } from '@/types/maze';

/** 방향에 따른 델타 좌표 */
export const DIRECTION_DELTA: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

/** 두 Position이 같은지 비교 */
export function isSamePos(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/** visitedPath 배열에 특정 위치가 포함되는지 확인 */
export function isInPath(path: Position[], pos: Position): boolean {
  return path.some((p) => isSamePos(p, pos));
}

/** 키보드 키를 Direction으로 변환 */
export function keyToDirection(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp': return 'up';
    case 'ArrowDown': return 'down';
    case 'ArrowLeft': return 'left';
    case 'ArrowRight': return 'right';
    default: return null;
  }
}

/** 초를 mm:ss 형식으로 변환 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
