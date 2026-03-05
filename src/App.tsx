import { MazeProvider, useMazeContext } from '@context/MazeContext';
import { DifficultySelectPage } from '@pages/DifficultySelectPage';
import { MazeGamePage } from '@pages/MazeGamePage';

function AppContent() {
  const { state } = useMazeContext();

  if (state.phase === 'idle') {
    return <DifficultySelectPage />;
  }

  return <MazeGamePage />;
}

export default function App() {
  return (
    <MazeProvider>
      <AppContent />
    </MazeProvider>
  );
}
