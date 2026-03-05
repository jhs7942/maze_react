# 미로찾기 게임 구현 계획

## 기술 스택

- **프레임워크**: React 최신버진, TypeScript 5
- **빌드 도구**: Vite 5
- **스타일**: Tailwind CSS
- **상태 관리**: useReducer + Context API
- **컴포넌트 설계**: Atomic Design (atoms / molecules / organisms)
- **경로 별칭**: `@/` → `src/` (tsconfig.paths + vite resolve.alias 동기화)

---

## 게임 흐름

```
난이도 선택 화면
     ↓ (난이도 선택)
미로 생성 + 분석 단계 (1분)
  - 사용자: 마우스로 경로를 펜처럼 그릴 수 있음
  - 원(플레이어) + 초록 칸(도착지) 표시
     ↓ (1분 경과)
조작 단계
  - 원이 자동으로 한 칸 전진
  - 사용자: 방향키로 원 조작
  - 벽 충돌 or 왔던 길 되돌아가기 → 게임 오버
  - 초록 칸 도달 → 게임 클리어
     ↓
게임 오버 / 클리어 팝업
  - "새 게임" 버튼 → 난이도 선택 화면으로 이동
```

---

## 난이도별 미로 크기

| 난이도 | 미로 크기 |
|--------|-----------|
| easy   | 11 × 11   |
| medium | 21 × 21   |
| hard   | 31 × 31   |

---

## 디렉토리 구조

```
maze_react/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── maze.ts                  # 전체 타입 정의
    ├── context/
    │   └── MazeContext.tsx          # Context + Provider + useMazeContext
    ├── hooks/
    │   ├── useMazeReducer.ts        # Reducer + initialState
    │   ├── useCountdownTimer.ts     # 분석 단계 카운트다운 (60초)
    │   ├── useKeyboardControl.ts    # 방향키 입력 처리
    │   └── useCanvasDraw.ts         # 마우스 펜 그리기 처리
    ├── utils/
    │   ├── mazeGenerator.ts         # DFS 기반 미로 생성 알고리즘
    │   └── mazeUtils.ts             # 좌표 계산, 방향 벡터 등 유틸
    ├── components/
    │   ├── index.ts
    │   ├── atoms/
    │   │   ├── DifficultyBadge.tsx  # 난이도 표시 배지
    │   │   ├── TimerDisplay.tsx     # 남은 시간 표시
    │   │   └── IconButton.tsx       # 공통 아이콘 버튼
    │   ├── molecules/
    │   │   ├── DifficultyCard.tsx   # 난이도 선택 카드 (이름 + 설명 + 크기)
    │   │   ├── MazeCell.tsx         # 미로 단일 셀 (벽/통로/플레이어/도착지)
    │   │   └── GameResultPopup.tsx  # 게임 오버 / 클리어 팝업
    │   └── organisms/
    │       ├── MazeBoard.tsx        # 미로 전체 그리드 + 캔버스 오버레이
    │       ├── MazeOverlay.tsx      # 펜 그리기용 Canvas 레이어
    │       └── GameHeader.tsx       # 난이도 표시 + 타이머
    └── pages/
        ├── DifficultySelectPage.tsx # 난이도 선택 화면
        └── MazeGamePage.tsx         # 미로 게임 메인 화면
```

---

## 타입 정의 (`types/maze.ts`)

```typescript
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

/** 방향 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 미로 셀 타입
 * 0 = 벽, 1 = 통로
 */
export type CellType = 0 | 1;

/**
 * 전체 게임 상태
 */
export interface MazeState {
  difficulty: Difficulty;
  grid: CellType[][];           // 2D 미로 배열 (0=벽, 1=통로)
  gridSize: number;             // 미로 한 변의 셀 수

  playerPos: Position;          // 현재 플레이어 위치
  goalPos: Position;            // 도착지 위치

  phase: GamePhase;

  analyzingTimeLeft: number;    // 분석 단계 남은 시간 (초)

  visitedPath: Position[];      // 조작 단계에서 플레이어가 지나온 경로 (역방향 방지용)
  lastDirection: Direction | null; // 직전 이동 방향 (자동 전진에 사용)
}
```

---

## Reducer 액션 목록

```typescript
export type MazeAction =
  // 난이도 선택 → 미로 생성 + 분석 단계 시작
  | { type: 'START_GAME'; payload: { difficulty: Difficulty } }

  // 분석 단계: 카운트다운 틱 (1초마다)
  | { type: 'TICK_ANALYZE' }

  // 분석 단계 종료 → 조작 단계로 전환 (타이머 만료 시)
  | { type: 'BEGIN_PLAYING' }

  // 조작 단계: 방향키 입력으로 플레이어 이동
  | { type: 'MOVE_PLAYER'; payload: { direction: Direction } }

  // 자동 전진 (분석 단계 종료 직후 직전 방향으로 한 칸 전진)
  | { type: 'AUTO_ADVANCE' }

  // 게임 오버 (벽 충돌 or 되돌아가기)
  | { type: 'GAME_OVER' }

  // 게임 클리어 (도착지 도달)
  | { type: 'GAME_CLEAR' }

  // 새 게임 (난이도 선택 화면으로 초기화)
  | { type: 'RESET_GAME' };
```

---

## 컴포넌트별 Props 인터페이스

### Atoms

```typescript
// DifficultyBadge.tsx
interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

// TimerDisplay.tsx
interface TimerDisplayProps {
  seconds: number;     // 남은 시간 (초)
  isUrgent?: boolean;  // 10초 이하일 때 강조 표시
}

// IconButton.tsx
interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### Molecules

```typescript
// DifficultyCard.tsx
interface DifficultyCardProps {
  difficulty: Difficulty;
  mazeSize: string;       // ex) "11 × 11"
  description: string;    // ex) "작은 미로, 입문용"
  onClick: () => void;
}

// MazeCell.tsx
interface MazeCellProps {
  type: CellType;         // 0=벽, 1=통로
  isPlayer: boolean;
  isGoal: boolean;
  isVisited: boolean;     // 이미 지나온 셀 (표시용)
  cellSize: number;       // px 단위 셀 크기
}

// GameResultPopup.tsx
interface GameResultPopupProps {
  result: 'gameover' | 'clear';
  onNewGame: () => void;
}
```

### Organisms

```typescript
// MazeBoard.tsx
interface MazeBoardProps {
  grid: CellType[][];
  playerPos: Position;
  goalPos: Position;
  visitedPath: Position[];
  phase: GamePhase;
  cellSize: number;
}

// MazeOverlay.tsx
interface MazeOverlayProps {
  width: number;    // canvas width (px)
  height: number;   // canvas height (px)
  enabled: boolean; // 분석 단계에서만 활성화
}

// GameHeader.tsx
interface GameHeaderProps {
  difficulty: Difficulty;
  phase: GamePhase;
  analyzingTimeLeft: number;
}
```

### Pages

```typescript
// DifficultySelectPage.tsx
// Props 없음 - Context에서 dispatch 사용

// MazeGamePage.tsx
// Props 없음 - Context에서 state/dispatch 사용
```

---

## 미로 생성 알고리즘

- **방식**: DFS(깊이 우선 탐색) 기반 Recursive Backtracking
- 홀수 크기 그리드(11×11 등)에서 셀(1,1) 기준으로 시작
- 벽(0)으로 가득 찬 그리드에서 통로(1)를 뚫어 나가는 방식
- 시작점: (1, 1) / 도착점: (gridSize-2, gridSize-2)
- 플레이어 초기 위치: 시작점 (1, 1)

---

## 핵심 게임 로직 요약

### 분석 단계
- 미로 전체가 보이는 상태
- 플레이어(원)와 도착지(초록 칸) 표시
- Canvas 오버레이로 마우스 펜 그리기 가능
- 60초 카운트다운 → 만료 시 자동으로 조작 단계로 전환

### 조작 단계
- 타이머 만료 직후 `AUTO_ADVANCE`: 마지막으로 향한 방향(기본: 오른쪽)으로 한 칸 자동 전진
- 이후 방향키(ArrowUp/Down/Left/Right)로 플레이어 이동
- **게임 오버 조건**:
  1. 이동하려는 방향이 벽(0)일 때
  2. 이동하려는 위치가 `visitedPath`에 포함될 때 (왔던 길 역행)
- **클리어 조건**: 이동 후 위치 === `goalPos`

### 새 게임
- `RESET_GAME` 액션 → phase를 `'idle'`로 초기화 → 난이도 선택 화면 렌더
