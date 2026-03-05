import type { CellType, Difficulty, Position } from '@/types/maze';

/** 각 타입별 속도 변경 칸 배치 비율 (빠른 칸 / 느린 칸 각각) */
const SPEED_TILE_RATIO = 0.05 / 3;

/**
 * (r, c)에 color 타입 칸을 놓았을 때 같은 색 3칸 이상 연결이 발생하는지 확인
 * - 같은 색 이웃이 2개 이상이면 반드시 3칸 클러스터 → true
 * - 같은 색 이웃이 1개이고, 그 이웃이 다른 같은 색 이웃을 가지면 → true
 */
function wouldCluster(grid: CellType[][], r: number, c: number, color: 2 | 3): boolean {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const rows = grid.length;
  const cols = grid[0].length;
  const sameNeighbors: [number, number][] = [];

  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === color) {
      sameNeighbors.push([nr, nc]);
    }
  }

  if (sameNeighbors.length >= 2) return true;

  if (sameNeighbors.length === 1) {
    const [nr, nc] = sameNeighbors[0];
    for (const [dr, dc] of dirs) {
      const nnr = nr + dr, nnc = nc + dc;
      if (nnr === r && nnc === c) continue;
      if (nnr >= 0 && nnr < rows && nnc >= 0 && nnc < cols && grid[nnr][nnc] === color) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 미로를 ceil(√tileCount) × ceil(√tileCount) 구역으로 나눠
 * 각 구역에서 하나씩 속도 변경 칸을 배치 (공간 분산 보장)
 */
function placeSpeedTilesDistributed(
  grid: CellType[][],
  size: number,
  tileCount: number,
  tileType: 2 | 3,
  start: Position,
  goal: Position
) {
  const zoneDim = Math.max(1, Math.ceil(Math.sqrt(tileCount)));
  const zoneSize = size / zoneDim;

  // 각 구역에 속하는 유효 통로 셀 수집
  const zones: Position[][] = Array.from({ length: zoneDim * zoneDim }, () => []);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        grid[r][c] === 1 &&
        !(r === start.row && c === start.col) &&
        !(r === goal.row && c === goal.col)
      ) {
        const zr = Math.min(Math.floor(r / zoneSize), zoneDim - 1);
        const zc = Math.min(Math.floor(c / zoneSize), zoneDim - 1);
        zones[zr * zoneDim + zc].push({ row: r, col: c });
      }
    }
  }

  // 구역 순서를 무작위로 섞어 tileCount개 구역에서 하나씩 배치
  const zoneOrder = Array.from({ length: zoneDim * zoneDim }, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  let placed = 0;
  for (const zi of zoneOrder) {
    if (placed >= tileCount) break;
    const candidates = [...zones[zi]].sort(() => Math.random() - 0.5);
    for (const pos of candidates) {
      if (!wouldCluster(grid, pos.row, pos.col, tileType)) {
        grid[pos.row][pos.col] = tileType;
        placed++;
        break;
      }
    }
  }
}

/** 난이도별 미로 크기 (홀수여야 함) */
export const GRID_SIZES: Record<Difficulty, number> = {
  easy: 25,
  medium: 41,
  hard: 61,
};

/** 난이도별 한국어 이름 */
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

const DIRECTIONS = [
  { dr: -2, dc: 0 },
  { dr: 2, dc: 0 },
  { dr: 0, dc: -2 },
  { dr: 0, dc: 2 },
];

/** DFS Recursive Backtracking으로 미로 생성 */
export function generateMaze(size: number): CellType[][] {
  // 모든 셀을 벽(0)으로 초기화
  const grid: CellType[][] = Array.from({ length: size }, () =>
    Array(size).fill(0) as CellType[]
  );

  function carve(r: number, c: number) {
    grid[r][c] = 1; // 현재 셀을 통로로 개방

    // 방향을 무작위 섞기
    const shuffled = [...DIRECTIONS].sort(() => Math.random() - 0.5);

    for (const { dr, dc } of shuffled) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && grid[nr][nc] === 0) {
        // 중간 벽 제거
        grid[r + dr / 2][c + dc / 2] = 1;
        carve(nr, nc);
      }
    }
  }

  // (1,1)에서 시작
  carve(1, 1);

  // 속도 변경 칸 분산 배치 (존 기반)
  const start = getStartPos();
  const goal = getGoalPos(size);

  let pathCount = 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === 1 && !(r === start.row && c === start.col) && !(r === goal.row && c === goal.col))
        pathCount++;

  const tileCount = Math.max(1, Math.floor(pathCount * SPEED_TILE_RATIO));

  placeSpeedTilesDistributed(grid, size, tileCount, 2, start, goal); // 빠른 칸 (빨간)
  placeSpeedTilesDistributed(grid, size, tileCount, 3, start, goal); // 느린 칸 (파란)

  return grid;
}

/** 시작 위치 반환 */
export function getStartPos(): Position {
  return { row: 1, col: 1 };
}

/** 도착지 위치 반환 */
export function getGoalPos(size: number): Position {
  return { row: size - 2, col: size - 2 };
}
