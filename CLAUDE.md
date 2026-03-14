# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

To run a single test file: `npx vitest run game.test.js` or `npx vitest run ai.test.js`

To play the game: open `index.html` (two-player) or `index-vs-computer.html` (vs AI) directly in a browser — no build step or dev server needed.

## Architecture

The project is split into two independent game modes, each with its own HTML entry point and controller script, sharing a common game engine and AI module.

**Core modules:**
- `game.js` — Game engine. Manages board state (9-element array, `null`/`"X"`/`"O"`), turn tracking, win/draw detection. Exports a `createGame()` factory function.
- `ai.js` — AI opponent. Exports `getBestMove(cells, computerMark)` which returns an optimal cell index (0–8). Strategy priority: win > block > center > corners > edges.

**Controllers:**
- `script.js` — Two-player mode. Wires DOM events to `game.js`.
- `script-vs-computer.js` — Human vs computer mode. Uses both `game.js` and `ai.js`; computer always plays `"O"`, triggers its move after a 300ms delay.

**Board indexing:**
```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

Win detection uses 8 `WIN_LINES` (3 rows, 3 columns, 2 diagonals) defined independently in both `game.js` and `ai.js`.

**Tests:** `game.test.js` (22 tests) and `ai.test.js` (15 tests) use Vitest and cover all game states and AI strategies.

## Git Workflow

After every change to this repository, commit and push to GitHub so that version history is preserved and context is not lost between Claude sessions.

```bash
git add <specific-files>
git commit -m "descriptive message explaining what and why"
git push origin main
```

- Stage specific files rather than `git add .` to avoid accidentally including unintended files.
- Write commit messages that capture the intent behind the change, not just what changed — future sessions rely on this history for context.
- Push immediately after committing. Do not accumulate unpushed commits.
