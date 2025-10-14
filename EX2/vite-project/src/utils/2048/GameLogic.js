// src/utils/gameLogic.js
export const GRID_SIZE = 4;

export const getRandomEmptyCell = (grid) => {
  const emptyCells = [];
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (!cell) emptyCells.push({ r, c });
    })
  );
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const addNewTile = (grid) => {
  const newGrid = grid.map((row) => row.slice());
  const cell = getRandomEmptyCell(newGrid);
  if (cell) {
    newGrid[cell.r][cell.c] = {
      id: crypto.randomUUID(),
      value: Math.random() < 0.9 ? 2 : 4,
      row: cell.r,
      col: cell.c,
    };
  }
  return newGrid;
};

export const createEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(null));

export const move = (direction, grid, score, setScore, setGrid) => {
  let moved = false;
  const newGrid = createEmptyGrid().map((row) => row.slice());
  let newScore = score;

  const dir = {
    ArrowLeft: { dr: 0, dc: -1, r: [0, GRID_SIZE, 1], c: [0, GRID_SIZE, 1] },
    ArrowRight: {
      dr: 0,
      dc: 1,
      r: [0, GRID_SIZE, 1],
      c: [GRID_SIZE - 1, -1, -1],
    },
    ArrowUp: { dr: -1, dc: 0, r: [0, GRID_SIZE, 1], c: [0, GRID_SIZE, 1] },
    ArrowDown: {
      dr: 1,
      dc: 0,
      r: [GRID_SIZE - 1, -1, -1],
      c: [0, GRID_SIZE, 1],
    },
  }[direction];

  if (!dir) return;

  // Track which tiles merged to prevent double merge
  const mergedFlag = createEmptyGrid().map((row) => row.map(() => false));

  for (let r = dir.r[0]; r !== dir.r[1]; r += dir.r[2]) {
    for (let c = dir.c[0]; c !== dir.c[1]; c += dir.c[2]) {
      const tile = grid[r][c];
      if (!tile) continue;

      let newR = r;
      let newC = c;

      while (true) {
        const nextR = newR + dir.dr;
        const nextC = newC + dir.dc;

        if (nextR < 0 || nextR >= GRID_SIZE || nextC < 0 || nextC >= GRID_SIZE)
          break;

        const nextTile = newGrid[nextR][nextC];
        if (!nextTile) {
          newR = nextR;
          newC = nextC;
        } else if (!mergedFlag[nextR][nextC] && nextTile.value === tile.value) {
          // merge with existing tile
          newR = nextR;
          newC = nextC;
          break;
        } else break;
      }

      if (newGrid[newR][newC]) {
        // merge tile, giữ id của tile lớn để animation mượt
        newGrid[newR][newC] = {
          ...newGrid[newR][newC],
          value: newGrid[newR][newC].value * 2,
          merged: true,
          row: newR,
          col: newC,
        };
        mergedFlag[newR][newC] = true;
        newScore += newGrid[newR][newC].value;
      } else {
        // di chuyển tile mà không tạo id mới
        newGrid[newR][newC] = {
          ...tile,
          row: newR,
          col: newC,
          merged: false,
        };
      }

      if (newR !== r || newC !== c) moved = true;
    }
  }

  if (moved) {
    const withNew = addNewTile(newGrid);
    setGrid(withNew);
    setScore(newScore);
  }
};
