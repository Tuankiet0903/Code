import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Chess } from "chess.js";
import { Chessboard, ChessboardProvider } from "react-chessboard";

let socket = null;

export default function ChessPageMulti() {
  const chessRef = useRef(new Chess());
  const chess = chessRef.current;

  const [chessPosition, setChessPosition] = useState(chess.fen());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [status, setStatus] = useState("Disconnected");
  const [history, setHistory] = useState([]);
  const [playerColor, setPlayerColor] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // ⚙️ Kết nối socket thủ công
  const connectSocket = () => {
    if (socket && socket.connected) return;

    socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setStatus("Connecting to server...");

    socket.on("connect", () => {
      setIsConnected(true);
      setPlayerId(socket.id);
      setStatus("🟢 Connected! Waiting for opponent...");
      socket.emit("joinGame");
    });

    socket.on("assignColor", ({ color, selfId, opponentId }) => {
      setPlayerColor(color);
      setPlayerId(selfId);
      setOpponentId(opponentId);
      setStatus("🎮 Opponent found! Game starts.");
    });

    socket.on("status", (msg) => setStatus(msg));

    socket.on("move", (move) => {
      chess.move(move);
      syncState();
    });

    socket.on("resetGame", () => {
      chess.reset();
      syncState();
      setStatus("♻️ Game reset!");
    });

    socket.on("opponentLeft", () => {
      setStatus("❌ Opponent left. Waiting for new player...");
      setOpponentId("");
      chess.reset();
      syncState();
      setTimeout(() => socket.emit("joinGame"), 1000);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setStatus("🔴 Disconnected from server.");
      setOpponentId("");
      setPlayerId("");
      setPlayerColor(null);
    });
  };

  // ❌ Ngắt kết nối socket
  const disconnectSocket = () => {
    if (socket) {
      socket.emit("leaveGame");
      socket.disconnect();
      socket = null;
    }
    setStatus("🔌 Disconnected manually.");
    setIsConnected(false);
    setOpponentId("");
    setPlayerColor(null);
    chess.reset();
    syncState();
  };

  const handleBeforeUnload = () => {
    if (socket) {
      socket.emit("leaveGame");
      socket.disconnect();
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (socket) socket.disconnect();
    };
  }, []);

  // 🧩 Đồng bộ giao diện
  const syncState = () => {
    setChessPosition(chess.fen());
    setHistory(chess.history({ verbose: true }));
    updateStatus();
  };

  const updateStatus = () => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "Black" : "White";
      setStatus(`🏁 Checkmate! ${winner} wins!`);
    } else if (chess.isDraw()) {
      setStatus("🤝 It's a draw!");
    } else if (chess.isCheck()) {
      setStatus(
        `⚠️ Check! ${chess.turn() === "w" ? "White" : "Black"} in danger`
      );
    } else {
      setStatus(`${chess.turn() === "w" ? "White" : "Black"} to move`);
    }
  };

  const getMoveOptions = (square) => {
    const moves = chess.moves({ square, verbose: true });
    if (!moves.length) return setOptionSquares({});

    const highlights = {};
    for (const move of moves) {
      highlights[move.to] = {
        background: chess.get(move.to)
          ? "radial-gradient(circle, rgba(255,0,0,.4) 70%, transparent 70%)"
          : "radial-gradient(circle, rgba(0,0,0,.2) 35%, transparent 35%)",
        borderRadius: "50%",
      };
    }
    highlights[square] = { background: "rgba(255,255,0,0.3)" };
    setOptionSquares(highlights);
  };

  const onSquareClick = ({ square, piece }) => {
    if (!playerColor || !opponentId) return;
    if (chess.turn() !== playerColor) return;

    if (!moveFrom && piece) {
      getMoveOptions(square);
      setMoveFrom(square);
      return;
    }

    const move = chess.move({ from: moveFrom, to: square, promotion: "q" });
    if (!move) {
      getMoveOptions(square);
      setMoveFrom(square);
      return;
    }

    socket.emit("move", move);
    syncState();
    setMoveFrom("");
    setOptionSquares({});
  };

  const chessboardOptions = {
    id: "multiplayer-chess",
    position: chessPosition,
    onSquareClick,
    squareStyles: optionSquares,
    allowDragging: false,
    boardOrientation: playerColor === "b" ? "black" : "white",
  };

  return (
    <div className="flex flex-col items-center py-8 gap-6 text-center text-white w-full">
      <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-md">
        ♟️ Multiplayer Chess
      </h1>

      {/* Connect / Disconnect */}
      <div className="flex gap-4">
        <button
          onClick={connectSocket}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isConnected
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400"
          }`}
          disabled={isConnected}
        >
          🔗 Connect
        </button>

        <button
          onClick={disconnectSocket}
          className="px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-400"
        >
          ❌ Disconnect
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8 bg-gray-900 p-6 rounded-2xl shadow-2xl w-[95%] md:w-[80%] max-w-6xl">
        {/* CHESSBOARD */}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg relative">
          <div className="absolute top-2 left-4 text-sm text-gray-400">
            🧑‍💻 You:{" "}
            <span className="text-yellow-400 font-semibold">
              {playerId ? playerId.slice(0, 6) : "N/A"}
            </span>
          </div>

          {opponentId ? (
            <div className="absolute top-2 right-4 text-sm text-gray-400">
              ⚔️ Opponent:{" "}
              <span className="text-green-400 font-semibold">
                {opponentId.slice(0, 6)}
              </span>
            </div>
          ) : (
            <div className="absolute top-2 right-4 text-sm text-gray-400 italic">
              Waiting for opponent...
            </div>
          )}

          <p className="mb-3 mt-6 text-green-300 text-lg font-medium">
            {status}
          </p>

          <ChessboardProvider options={chessboardOptions}>
            <Chessboard />
          </ChessboardProvider>
        </div>

        {/* MOVE HISTORY */}
        <div className="bg-gray-800 rounded-xl min-w-[170px] p-4 md:w-64 h-[704px] shadow-inner border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-yellow-300 mb-3 text-center">
            Move History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-400 italic text-center">No moves yet</p>
          ) : (
            <div className="flex-1 overflow-y-auto rounded-md custom-scroll">
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
                            {white?.san || ""}
                          </td>
                          <td className="py-1 px-1 text-white text-center">
                            {black?.san || ""}
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
