import { useReducer } from 'react';
import type { MazeState, MazeAction, Direction } from '@/types/maze';
import { generateMaze, getStartPos, getGoalPos, GRID_SIZES } from '@/utils/mazeGenerator';
import { DIRECTION_DELTA, isSamePos, isInPath } from '@/utils/mazeUtils';

const initialState: MazeState = {
  difficulty: 'easy',
  grid: [],
  gridSize: 0,
  playerPos: { row: 1, col: 1 },
  goalPos: { row: 1, col: 1 },
  phase: 'idle',
  analyzingTimeLeft: 60,
  visitedPath: [],
  lastDirection: 'right',
  speedBalance: 0,
};

function mazeReducer(state: MazeState, action: MazeAction): MazeState {
  switch (action.type) {
    case 'START_GAME': {
      const { difficulty } = action.payload;
      const size = GRID_SIZES[difficulty];
      const grid = generateMaze(size);
      const playerPos = getStartPos();
      const goalPos = getGoalPos(size);

      return {
        ...initialState,
        difficulty,
        grid,
        gridSize: size,
        playerPos,
        goalPos,
        phase: 'analyzing',
        analyzingTimeLeft: 30,
        visitedPath: [playerPos],
        lastDirection: 'right',
        speedBalance: 0,
      };
    }

    case 'TICK_ANALYZE': {
      if (state.phase !== 'analyzing') return state;
      const next = state.analyzingTimeLeft - 1;
      if (next <= 0) {
        return { ...state, analyzingTimeLeft: 0 };
      }
      return { ...state, analyzingTimeLeft: next };
    }

    case 'BEGIN_PLAYING': {
      if (state.phase !== 'analyzing') return state;
      // phase만 playing으로 전환 (이동은 AUTO_STEP이 처리)
      return { ...state, phase: 'playing' };
    }

    case 'SET_DIRECTION': {
      if (state.phase !== 'playing' && state.phase !== 'analyzing') return state;
      return { ...state, lastDirection: action.payload.direction };
    }

    case 'AUTO_STEP': {
      if (state.phase !== 'playing') return state;

      const { row, col } = state.playerPos;
      const delta = DIRECTION_DELTA[state.lastDirection];
      const nextRow = row + delta.row;
      const nextCol = col + delta.col;

      // 범위 벗어남 or 벽 충돌 → 게임 오버
      if (
        nextRow < 0 ||
        nextRow >= state.gridSize ||
        nextCol < 0 ||
        nextCol >= state.gridSize ||
        state.grid[nextRow][nextCol] === 0
      ) {
        return { ...state, phase: 'gameover' };
      }

      const nextPos = { row: nextRow, col: nextCol };

      // 왔던 길 역행 → 게임 오버
      if (isInPath(state.visitedPath, nextPos)) {
        return { ...state, phase: 'gameover' };
      }

      // 도착지 도달 → 클리어
      if (isSamePos(nextPos, state.goalPos)) {
        return { ...state, phase: 'clear', playerPos: nextPos };
      }

      // 속도 밸런스 업데이트 (빨간 -1, 파란 +1)
      const nextCell = state.grid[nextRow][nextCol];
      let speedBalance = state.speedBalance;
      if (nextCell === 2) speedBalance -= 1;
      else if (nextCell === 3) speedBalance += 1;

      return {
        ...state,
        playerPos: nextPos,
        visitedPath: [...state.visitedPath, nextPos],
        speedBalance,
      };
    }

    case 'MOVE_PLAYER': {
      if (state.phase !== 'playing') return state;

      const { direction } = action.payload;
      const delta = DIRECTION_DELTA[direction];
      const nextRow = state.playerPos.row + delta.row;
      const nextCol = state.playerPos.col + delta.col;

      // 범위 또는 벽 충돌 → 게임 오버
      if (
        nextRow < 0 ||
        nextRow >= state.gridSize ||
        nextCol < 0 ||
        nextCol >= state.gridSize ||
        state.grid[nextRow][nextCol] === 0
      ) {
        return { ...state, phase: 'gameover' };
      }

      const nextPos = { row: nextRow, col: nextCol };

      // 왔던 길 역행 → 게임 오버
      if (isInPath(state.visitedPath, nextPos)) {
        return { ...state, phase: 'gameover' };
      }

      // 도착지 도달 → 클리어
      if (isSamePos(nextPos, state.goalPos)) {
        return {
          ...state,
          phase: 'clear',
          playerPos: nextPos,
          lastDirection: direction,
        };
      }

      return {
        ...state,
        playerPos: nextPos,
        lastDirection: direction,
        visitedPath: [...state.visitedPath, nextPos],
      };
    }

    case 'GAME_OVER':
      return { ...state, phase: 'gameover' };

    case 'GAME_CLEAR':
      return { ...state, phase: 'clear' };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function useMazeReducer() {
  return useReducer(mazeReducer, initialState);
}

export type { Direction };
