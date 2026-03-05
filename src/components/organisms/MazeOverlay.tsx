import { useCanvasDraw } from '@hooks/useCanvasDraw';

interface MazeOverlayProps {
  width: number;
  height: number;
  enabled: boolean;
}

export function MazeOverlay({ width, height, enabled }: MazeOverlayProps) {
  const canvasRef = useCanvasDraw(enabled);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute inset-0 ${enabled ? 'cursor-crosshair' : 'pointer-events-none'}`}
      style={{ zIndex: 10 }}
    />
  );
}
