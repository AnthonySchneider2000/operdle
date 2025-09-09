# Operdle

A daily math puzzle game where players arrange mathematical operations to transform an input number into a target output number.

## 🎮 How to Play

Each day, you'll be presented with:
- An **input number** (starting value)
- A **target output number** (goal)
- A set of **mathematical operations** (usually 3-6 operations)

Your goal is to arrange the operations in the correct order to transform the input into the output.

### Available Operations
- Addition (+)
- Subtraction (-)
- Multiplication (×)
- Division (÷)
- Square/Cube operations
- Square root operations

### Game Features
- **Daily Puzzles**: New challenge every day
- **Drag & Drop Interface**: Smooth, modern UX for arranging operations
- **Calendar View**: Access previous days' puzzles
- **Progress Tracking**: Your results are saved locally
- **Completion Tracking**: Completed days show checkmarks on the calendar

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Bun (recommended) or npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd operdle
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Run the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **State Management**: TanStack Query
- **Calendar**: react-day-picker
- **Date Utilities**: date-fns
- **Storage**: Local Storage for user progress

## 📁 Project Structure

```
operdle/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with header
│   └── page.tsx           # Main game page
├── components/
│   ├── game/              # Game-specific components
│   │   ├── GameBoard.tsx  # Main game logic and UI
│   │   ├── GameCalendar.tsx # Calendar for day selection
│   │   └── OperationCard.tsx # Draggable operation cards
│   ├── ui/                # shadcn/ui components
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── use-game-data.ts   # Game data management
│   └── use-user-progress.ts # Progress tracking
├── lib/                   # Utility functions
│   ├── game-data.ts       # Puzzle generation logic
│   ├── game-logic.ts      # Game calculation logic
│   ├── storage.ts         # Local storage utilities
│   └── types.ts           # TypeScript type definitions
└── ...
```

## 🎯 Game Mechanics

- **Seeded Randomization**: Each day has a consistent, unique puzzle
- **Date Range**: Puzzles available from September 1st, 2025 onwards
- **One Play Per Day**: Once completed, you can only view results
- **Local Persistence**: Progress saved in browser storage
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Development Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

## 📅 Game Calendar

The calendar component allows users to:
- Navigate between available months (September 2025 - current month)
- View completion status for each day
- Select previous days to view results
- Navigation arrows are disabled outside valid date ranges

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: Drag and drop with visual feedback
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support
- **Theme Support**: Built-in theme system with customization options

## 📱 Mobile Support

Operdle is fully responsive and works seamlessly on:
- Desktop browsers
- Tablets
- Mobile phones (iOS Safari, Android Chrome)

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy Operdle is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to a Git repository
2. Import the project in Vercel
3. Deploy with zero configuration

### Other Platforms

Operdle can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
