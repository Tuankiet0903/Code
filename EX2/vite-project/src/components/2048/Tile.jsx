import React from "react";

export default function Tile({ value, row, col, merged }) {
  const getTileColor = (val) => {
    const colors = {
      2: "#fceabb",
      4: "#f8b500",
      8: "#ff8c00",
      16: "#ff5f00",
      32: "#ff3300",
      64: "#ff0000",
      128: "#cc00ff",
      256: "#9900ff",
      512: "#6600ff",
      1024: "#3300ff",
      2048: "#00cc99",
    };
    return colors[val] || "#333";
  };

  return (
    <div
      className={`tile ${merged ? "merged" : ""}`}
      style={{
        transform: `translate(${col * 90}px, ${row * 90}px)`,
        backgroundColor: getTileColor(value),
      }}
    >
      {value}
    </div>
  );
}
