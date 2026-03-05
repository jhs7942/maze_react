import { useEffect, useRef } from 'react';
import type { GamePhase } from '@/types/maze';

/**
 * 분석 단계 카운트다운 타이머
 * phase가 'analyzing'일 때 매 1초마다 onTick 호출
 * analyzingTimeLeft가 0이 되면 onExpire 호출
 */
export function useCountdownTimer(
  phase: GamePhase,
  analyzingTimeLeft: number,
  onTick: () => void,
  onExpire: () => void
) {
  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onTickRef.current = onTick; }, [onTick]);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    if (analyzingTimeLeft <= 0) {
      onExpireRef.current();
      return;
    }

    const id = setInterval(() => {
      onTickRef.current();
    }, 1000);

    return () => clearInterval(id);
  }, [phase, analyzingTimeLeft]);
}
