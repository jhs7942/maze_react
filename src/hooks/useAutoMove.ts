import { useEffect } from 'react';
import type { GamePhase, MazeAction } from '@/types/maze';

/** playing 단계에서 stepInterval마다 AUTO_STEP을 디스패치하는 훅 */
export function useAutoMove(phase: GamePhase, stepInterval: number, dispatch: React.Dispatch<MazeAction>) {
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => dispatch({ type: 'AUTO_STEP' }), stepInterval);
    return () => clearInterval(id);
  }, [phase, stepInterval, dispatch]);
}
