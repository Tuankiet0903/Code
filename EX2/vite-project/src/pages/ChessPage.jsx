import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard, ChessboardProvider } from "react-chessboard";
import Engine from "../utils/chess/StockfishEngine.js";

export default function ChessPage() {
  const pieceSymbol = {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
  };
  const pieceSymbolBlack = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
  };

  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [status, setStatus] = useState("White to move");
  const [history, setHistory] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const engineRef = useRef(null);

  useEffect(() => {
    const engine = new Engine();
    engine.start((bestMove) => {
      if (!bestMove) return;

      chessGame.move({
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: "q",
      });

      setChessPosition(chessGame.fen());
      setHistory(chessGame.history({ verbose: true }));
      updateStatus();

      // Nếu đang AutoPlay, lặp lại sau 200ms
      if (isAutoPlay && !chessGame.isGameOver()) {
        setTimeout(() => {
          engineRef.current.makeMove(chessGame.fen());
        }, 300);
      }
    });

    engineRef.current = engine;
    return () => engine.terminate();
  }, [isAutoPlay]);

  const updateStatus = () => {
    if (chessGame.isCheckmate()) {
      const winner = chessGame.turn() === "w" ? "Black" : "White";
      setStatus(`♛ Checkmate! ${winner} wins!`);
    } else if (chessGame.isStalemate()) {
      setStatus("🤝 Stalemate! It's a draw.");
    } else if (chessGame.isDraw()) {
      setStatus("🤝 Draw by repetition or 50-move rule.");
    } else if (chessGame.isCheck()) {
      const player = chessGame.turn() === "w" ? "White" : "Black";
      setStatus(`⚠️ Check! ${player} is in danger.`);
    } else {
      setStatus(`${chessGame.turn() === "w" ? "White" : "Black"} to move`);
    }
  };

  // 🟡 Highlight valid moves when clicking a square
  const getMoveOptions = (square) => {
    const moves = chessGame.moves({ square, verbose: true });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    for (const move of moves) {
      newSquares[move.to] = {
        background:
          chessGame.get(move.to) &&
          chessGame.get(move.to).color !== chessGame.get(square).color
            ? "radial-gradient(circle, rgba(255,0,0,.3) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }

    newSquares[square] = { background: "rgba(255,255,0,0.4)" };
    setOptionSquares(newSquares);
    return true;
  };

  // ⚡ Handle clicking on board squares
  const onSquareClick = ({ square, piece }) => {
    if (isAutoPlay) return; // disable in bot mode
    if (!moveFrom && piece) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // Try to move to target square
    const moves = chessGame.moves({ square: moveFrom, verbose: true });
    const foundMove = moves.find((m) => m.from === moveFrom && m.to === square);

    if (!foundMove) {
      const hasMoveOptions = getMoveOptions(square);
      setMoveFrom(hasMoveOptions ? square : "");
      return;
    }

    const move = chessGame.move({ from: moveFrom, to: square, promotion: "q" });
    if (move) {
      setChessPosition(chessGame.fen());
      setHistory(chessGame.history({ verbose: true }));
      updateStatus();

      // Gọi bot chơi nước tiếp theo
      setTimeout(() => {
        engineRef.current.makeMove(chessGame.fen());
      }, 300);
    }
  };

  // 🧩 Chessboard config
  const chessboardOptions = {
    id: "click-to-move",
    position: chessPosition,
    allowDragging: false, // click to move only
    onSquareClick,
    squareStyles: optionSquares,
  };

  // ♻️ Reset the game
  const resetGame = () => {
    chessGame.reset();
    setChessPosition(chessGame.fen());
    setMoveFrom("");
    setOptionSquares({});
    setStatus("White to move");
    setHistory([]);
  };

  // 🔄 Toggle PvE <-> AutoPlay
  const toggleAutoPlay = () => {
    const nextMode = !isAutoPlay;
    setIsAutoPlay(nextMode);

    if (nextMode) {
      // start Bot vs Bot
      setTimeout(() => {
        engineRef.current.makeMove(chessGame.fen());
      }, 400);
      resetGame();
    }
  };

  return (
    <div className="flex flex-col items-center py-8 gap-6 text-center text-white w-full">
      <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-md">
        ♟️ React Chess Game ({isAutoPlay ? "Bot vs Bot" : "Player vs Bot"})
      </h1>

      {/* Main content area */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 bg-gray-900 p-6 rounded-2xl shadow-2xl w-[95%] md:w-[80%] max-w-6xl">
        {/* Chessboard area */}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg">
          <p className="mb-3 text-green-300 text-lg font-medium">{status}</p>
          <ChessboardProvider options={chessboardOptions}>
            <Chessboard />
          </ChessboardProvider>

          <div className="flex gap-3 mt-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all"
            >
              New Game
            </button>
            <button
              onClick={toggleAutoPlay}
              className={`px-4 py-2 font-semibold rounded-lg transition-all ${
                isAutoPlay
                  ? "bg-red-500 hover:bg-red-400 text-white"
                  : "bg-green-500 hover:bg-green-400 text-black"
              }`}
            >
              {isAutoPlay ? "Stop AutoPlay" : "Start AutoPlay"}
            </button>
          </div>
        </div>

        {/* Move history */}
        <div className="bg-gray-800 rounded-xl min-w-[170px] p-4 md:w-64 h-[704px] shadow-inner border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-yellow-300 mb-3 text-center">
            Move History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-400 italic text-center">No moves yet</p>
          ) : (
            <div className="flex-1 overflow-y-auto rounded-md">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-gray-800 z-10">
                  <tr className="text-yellow-400 border-b border-gray-600 text-center">
                    <th className="w-1/5 py-1">#</th>
                    <th className="w-2/5 py-1">White</th>
                    <th className="w-2/5 py-1">Black</th>
                  </tr>
                </thead>

                <tbody>
                  {Array.from({ length: Math.ceil(history.length / 2) }).map(
                    (_, i) => {
                      const white = history[i * 2];
                      const black = history[i * 2 + 1];

                      return (
                        <tr
                          key={i}
                          className={`hover:bg-gray-700/40 transition ${
                            i % 2 === 0 ? "bg-gray-700/20" : ""
                          }`}
                        >
                          <td className="py-1 px-1 text-gray-400 text-center">
                            {i + 1}
                          </td>
                          <td className="py-1 px-1 text-white text-center">
                            {white
                              ? `${pieceSymbol[white.piece]} ${white.san}`
                              : ""}
                          </td>
                          <td className="py-1 px-1 text-white text-center">
                            {black
                              ? `${pieceSymbolBlack[black.piece]} ${black.san}`
                              : ""}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
