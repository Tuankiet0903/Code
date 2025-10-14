import Tile from "./Tile";

export default function Board({ grid }) {
  const size = grid.length;
  const cellSize = 96; // px
  const gap = 10;

  return (
    <div
      className="relative bg-gray-800 rounded-lg p-2"
      style={{
        width: size * cellSize + (size + 1) * gap,
        height: size * cellSize + (size + 1) * gap,
      }}
    >
      {/* background grid */}
      {Array.from({ length: size * size }).map((_, i) => (
        <div
          key={`bg-${i}`}
          className="absolute bg-gray-700 rounded-lg opacity-30"
          style={{
            width: cellSize,
            height: cellSize,
            top: Math.floor(i / size) * (cellSize + gap) + gap,
            left: (i % size) * (cellSize + gap) + gap,
          }}
        />
      ))}

      {/* animated tiles */}
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell !== 0 ? (
            <Tile
              key={`${r}-${c}-${cell}-${Math.random()}`} // unique per render
              value={cell}
              row={r}
              col={c}
              size={cellSize}
              gap={gap}
            />
          ) : null
        )
      )}
    </div>
  );
}
