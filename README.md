# 2048 Game

A modern implementation of the classic 2048 puzzle game built with React, TypeScript, and Tailwind CSS. Features AI-powered move suggestions using Claude API and a beautiful dark mode.

## 🎮 Live Demo

[Play the game here](https://your-deployment-url.vercel.app)

## ✨ Features

- 🎯 Classic 2048 gameplay with smooth animations
- 🤖 AI-powered move suggestions using Claude API
- 🌓 Dark mode with system preference detection
- 💾 LocalStorage persistence for theme preference
- ⌨️ Keyboard controls (arrow keys)
- 📱 Responsive design
- ♿ Accessible UI with ARIA labels

## 🏗️ Architecture

This project follows a clean, layered architecture with clear separation of concerns:

```mermaid
graph TD
    A[UI Layer] --> B[State Management Layer]
    B --> C[Core Logic Layer]
    A --> D[Theme System]
    A --> E[AI Service Layer]
    
    subgraph "UI Layer"
        A1[Components]
        A2[Icons]
    end
    
    subgraph "State Management"
        B1[Hooks]
        B2[React Context]
    end
    
    subgraph "Core Logic"
        C1[Board Operations]
        C2[Tile Generation]
        C3[Merge Logic]
        C4[Game Rules]
    end
    
    subgraph "Services"
        E1[Claude API]
    end
    
    subgraph "Theme"
        D1[ThemeProvider]
        D2[ThemeContext]
        D3[Storage]
    end
```

## 📁 Project Structure

```
src/
├── core/                      # Core game logic (pure functions)
│   ├── types.ts              # Type definitions and enums
│   ├── constants.ts          # Game constants
│   ├── index.ts              # Unified exports
│   ├── board/                # Board-related operations
│   │   ├── boardFactory.ts   # Board initialization
│   │   ├── boardQuery.ts     # Board state queries
│   │   └── boardTransform.ts # Board transformations (rotation)
│   ├── tile/                 # Tile operations
│   │   └── tileGenerator.ts  # Random tile generation
│   └── merge/                # Merge logic
│       ├── lineMerger.ts     # Single line merge algorithm
│       └── boardMerger.ts    # Board-wide merge operations
│
├── hooks/                     # React hooks for state management
│   ├── useGameState.ts       # Main game state and actions
│   └── useKeyboard.ts        # Keyboard event handling
│
├── services/                  # External services
│   └── aiService.ts          # Claude AI integration
│
├── theme/                     # Theme system (dark/light mode)
│   ├── types.ts              # Theme types and constants
│   ├── storage.ts            # LocalStorage utilities
│   ├── ThemeContext.tsx      # React Context and hook
│   ├── ThemeProvider.tsx     # Theme provider component
│   ├── ThemeToggle.tsx       # Toggle button component
│   └── index.ts              # Unified exports
│
├── components/                # React UI components
│   ├── Game.tsx              # Main game container
│   ├── Board.tsx             # 4x4 game board grid
│   ├── Tile.tsx              # Individual tile component
│   ├── ScoreBoard.tsx        # Score display
│   ├── Button.tsx            # Reusable button component
│   ├── AIHint.tsx            # AI suggestion UI
│   └── icons.ts              # Centralized icon exports
│
├── App.tsx                    # Root application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles and Tailwind config
```

## 🎯 Layer Responsibilities

### 1. Core Logic Layer (`src/core/`)

**Purpose**: Pure, framework-agnostic game logic

**Responsibilities**:
- Board state management and transformations
- Tile generation and placement
- Merge algorithms for all directions
- Game state validation (win/lose conditions)
- Board queries (empty cells, adjacent tiles, etc.)

**Key Principles**:
- Pure functions only (no side effects)
- Fully testable in isolation
- No UI or framework dependencies
- Single Responsibility Principle

**Sub-modules**:
- `board/`: Board creation, queries, and transformations
- `tile/`: Tile generation logic
- `merge/`: Line and board merge algorithms

### 2. State Management Layer (`src/hooks/`)

**Purpose**: React state management and business logic orchestration

**Responsibilities**:
- Game state (board, score, status)
- User action handling (move, restart, continue)
- State persistence (best score)
- Event handling (keyboard inputs)

**Communication**:
- **From UI**: Receives user actions via hook methods
- **To Core**: Calls pure functions from core layer
- **To UI**: Provides state via React hooks

### 3. Services Layer (`src/services/`)

**Purpose**: External API integrations

**Responsibilities**:
- Claude AI API communication
- Prompt engineering for optimal suggestions
- Error handling and fallbacks
- Response validation

### 4. Theme System (`src/theme/`)

**Purpose**: Centralized theme management

**Responsibilities**:
- Dark/light mode switching
- System preference detection
- LocalStorage persistence
- Theme context provision

**Features**:
- Automatic system theme detection
- User preference persistence
- Smooth transitions
- Accessibility support

### 5. UI Layer (`src/components/`)

**Purpose**: Visual presentation and user interaction

**Responsibilities**:
- Rendering game state
- User input capture
- Visual feedback and animations
- Accessibility features

**Key Components**:
- `Game`: Main container, layout orchestration
- `Board`: 4x4 grid layout
- `Tile`: Individual tile with color mapping
- `ScoreBoard`: Score display
- `AIHint`: AI suggestion interface

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant State
    participant Core
    participant Storage

    User->>UI: Press Arrow Key
    UI->>State: move(direction)
    State->>Core: mergeBoard(board, direction)
    Core-->>Core: Calculate new board state
    Core-->>State: Return new board + score
    State->>Core: addRandomTile(board)
    State->>Core: Check game status
    State->>State: Update React state
    State->>Storage: Save best score
    State-->>UI: Re-render with new state
    UI-->>User: Display updated board
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/game2048.git
cd game2048
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

1. Use **arrow keys** to move tiles
2. When two tiles with the same number touch, they **merge into one**
3. Create a tile with the number **2048** to win
4. The game ends when no moves are possible

### AI Assistant

Click the **🤖 Get AI Hint** button to get move suggestions from Claude AI. The AI analyzes the current board and suggests the optimal move to:
- Avoid game over
- Maximize score
- Increase chances of reaching 2048

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 📦 Key Dependencies

```json
{
  "react": "^18.3.1",
  "typescript": "~5.6.2",
  "tailwindcss": "^4.1.14",
  "@tailwindcss/postcss": "^4.1.14",
  "@anthropic-ai/sdk": "^0.65.0",
  "lucide-react": "^0.544.0",
  "vite": "^5.4.10"
}
```

## 🎨 Design Principles

### Clean Code
- Single Responsibility Principle
- Pure functions for game logic
- Clear separation of concerns
- Meaningful naming conventions

### Modularity
- Each module has a single, well-defined purpose
- Loose coupling between layers
- High cohesion within modules
- Easy to test and maintain

### Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly

## 🌙 Dark Mode

The app supports dark mode with:
- Automatic system preference detection
- Manual toggle via button
- LocalStorage persistence
- Smooth transitions

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Original 2048 game by Gabriele Cirulli
- Claude AI by Anthropic
- Icons by Lucide

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
