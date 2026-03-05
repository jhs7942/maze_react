/** 게임 난이도 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** 게임 단계 */
export type GamePhase =
  | 'idle'       // 난이도 선택 전
  | 'analyzing'  // 분석 단계 (1분 카운트다운, 펜 사용 가능)
  | 'playing'    // 조작 단계 (방향키 조작)
  | 'gameover'   // 게임 오버
  | 'clear';     // 게임 클리어

/** 2D 좌표 */
export interface Position {
  row: number;
  col: number;
}

/** 이동 방향 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 미로 셀 타입
 * 0 = 벽, 1 = 통로, 2 = 빠른 칸, 3 = 느린 칸
 */
export type CellType = 0 | 1 | 2 | 3;

/** 자동 이동 속도 (ms) */
export const SPEED_INTERVALS = {
  normal: 450,
  step: 125,  // 칸 하나당 속도 변화량 (파란 +1, 빨간 -1)
  min: 150,
  max: 900,
} as const;

/** 전체 게임 상태 */
export interface MazeState {
  difficulty: Difficulty;
  grid: CellType[][];         // 2D 미로 배열 (0=벽, 1=통로)
  gridSize: number;           // 미로 한 변의 셀 수

  playerPos: Position;        // 현재 플레이어 위치
  goalPos: Position;          // 도착지 위치

  phase: GamePhase;

  analyzingTimeLeft: number;  // 분석 단계 남은 시간 (초)

  visitedPath: Position[];    // 플레이어가 지나온 경로 (역방향 방지용)
  lastDirection: Direction;   // 직전 이동 방향 (자동 전진에 사용)
  speedBalance: number;       // 파란칸 수 - 빨간칸 수 (양수=느림, 음수=빠름)
}

/** Reducer 액션 */
export type MazeAction =
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }
  | { type: 'TICK_ANALYZE' }
  | { type: 'BEGIN_PLAYING' }
  | { type: 'MOVE_PLAYER'; payload: { direction: Direction } }
  | { type: 'SET_DIRECTION'; payload: { direction: Direction } }
  | { type: 'AUTO_STEP' }
  | { type: 'GAME_OVER' }
  | { type: 'GAME_CLEAR' }
  | { type: 'RESET_GAME' };
