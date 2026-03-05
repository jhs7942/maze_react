interface GameResultPopupProps {
  result: 'gameover' | 'clear';
  onNewGame: () => void;
}

export function GameResultPopup({ result, onNewGame }: GameResultPopupProps) {
  const isClear = result === 'clear';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
        <div className="text-7xl">{isClear ? '🎉' : '💀'}</div>
        <h2 className={`text-3xl font-extrabold ${isClear ? 'text-green-600' : 'text-red-600'}`}>
          {isClear ? '클리어!' : '게임 오버'}
        </h2>
        <p className="text-gray-500 text-center text-sm">
          {isClear
            ? '미로를 성공적으로 탈출했습니다!'
            : '벽에 부딪히거나 왔던 길로 돌아갔습니다.'}
        </p>
        <button
          onClick={onNewGame}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors"
        >
          새 게임
        </button>
      </div>
    </div>
  );
}
