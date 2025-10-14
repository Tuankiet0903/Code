import React, { useEffect, useState } from "react";
import { addNewTile, createEmptyGrid, move } from "../utils/2048/GameLogic.js";
import Tile from "../components/2048/Tile.jsx";

export default function GameBoard() {
  const [grid, setGrid] = useState(addNewTile(createEmptyGrid()));
  const [score, setScore] = useState(0);

  const resetGame = () => {
    setGrid(addNewTile(createEmptyGrid()));
    setScore(0);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        move(e.key, grid, score, setScore, setGrid);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [grid, score]);

  return (
    <div className="game-container">
      <h1>2048 Game</h1>
      <p>Score: {score}</p>

      <div className="board">
        {grid
          .flat()
          .map((tile) =>
            tile ? (
              <Tile
                key={tile.id}
                value={tile.value}
                row={tile.row}
                col={tile.col}
                merged={tile.merged}
              />
            ) : null
          )}
      </div>

      <button className="reset-btn" onClick={resetGame}>
        🔁 Reset Game
      </button>
      <p>Use Arrow Keys to move tiles</p>
    </div>
  );
}
