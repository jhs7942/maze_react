import { formatTime } from '@/utils/mazeUtils';

interface TimerDisplayProps {
  seconds: number;
  isUrgent?: boolean;
}

export function TimerDisplay({ seconds, isUrgent = false }: TimerDisplayProps) {
  return (
    <span
      className={`font-mono text-2xl font-bold tabular-nums transition-colors ${
        isUrgent ? 'text-red-500 animate-pulse' : 'text-white'
      }`}
    >
      {formatTime(seconds)}
    </span>
  );
}
