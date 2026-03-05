import { useEffect } from 'react';
import type { GamePhase } from '@/types/maze';
import type { MazeAction } from '@/types/maze';
import { keyToDirection } from '@/utils/mazeUtils';

/**
 * 방향키 입력을 처리하는 훅
 * phase가 'playing'일 때만 활성화
 */
export function useKeyboardControl(
  phase: GamePhase,
  dispatch: React.Dispatch<MazeAction>
) {
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'analyzing') return;

    function handleKeyDown(e: KeyboardEvent) {
      const direction = keyToDirection(e.key);
      if (!direction) return;
      e.preventDefault();
      dispatch({ type: 'SET_DIRECTION', payload: { direction } });
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, dispatch]);
}
