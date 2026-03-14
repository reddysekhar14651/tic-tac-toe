# Tic Tac Toe

A simple two-player tic-tac-toe game that runs in the browser.

## How to play

1. Open `index.html` in your browser (double-click the file or drag it into a browser window).
2. Players take turns clicking empty cells. X goes first, then O.
3. First player to get three in a row (horizontal, vertical, or diagonal) wins.
4. Click **New game** to play again.

No server or build step required.

## Testing

Unit tests use [Vitest](https://vitest.dev/). Run them with:

```bash
npm test
```

Run tests in watch mode (re-run on file changes):

```bash
npm run test:watch
```

Tests cover game logic: initial state, valid and invalid moves, all win conditions (rows, columns, diagonals), draw detection, and reset.
