import { createContext, useContext, useCallback } from 'react';
import type { MazeState, MazeAction } from '@/types/maze';
import { SPEED_INTERVALS } from '@/types/maze';
import { useMazeReducer } from '@hooks/useMazeReducer';
import { useCountdownTimer } from '@hooks/useCountdownTimer';
import { useKeyboardControl } from '@hooks/useKeyboardControl';
import { useAutoMove } from '@hooks/useAutoMove';

interface MazeContextType {
  state: MazeState;
  dispatch: React.Dispatch<MazeAction>;
}

const MazeContext = createContext<MazeContextType | undefined>(undefined);

export function MazeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useMazeReducer();

  // 분석 단계 카운트다운
  const handleTick = useCallback(() => dispatch({ type: 'TICK_ANALYZE' }), [dispatch]);
  const handleExpire = useCallback(() => dispatch({ type: 'BEGIN_PLAYING' }), [dispatch]);

  useCountdownTimer(state.phase, state.analyzingTimeLeft, handleTick, handleExpire);

  // 조작 단계 방향키
  useKeyboardControl(state.phase, dispatch);

  // speedBalance(파란-빨간)로 stepInterval 계산: balance=0 → 기본 속도
  const stepInterval = Math.max(
    SPEED_INTERVALS.min,
    Math.min(SPEED_INTERVALS.max, SPEED_INTERVALS.normal + state.speedBalance * SPEED_INTERVALS.step)
  );

  // 조작 단계 자동 전진
  useAutoMove(state.phase, stepInterval, dispatch);

  return (
    <MazeContext.Provider value={{ state, dispatch }}>
      {children}
    </MazeContext.Provider>
  );
}

export function useMazeContext(): MazeContextType {
  const context = useContext(MazeContext);
  if (!context) {
    throw new Error('useMazeContext는 MazeProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
