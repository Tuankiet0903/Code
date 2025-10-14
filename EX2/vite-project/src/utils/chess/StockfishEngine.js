export default class Engine {
  constructor() {
    this.engine = null;
    this.onBestMove = null;
  }

  start(onBestMove) {
    this.onBestMove = onBestMove;
    this.engine = new Worker(new URL("./stockfish.wasm.js", import.meta.url));

    this.engine.onmessage = (event) => {
      const line = event.data;
      if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        if (this.onBestMove) this.onBestMove(move);
      }
    };
  }

  makeMove(fen) {
    this.engine.postMessage("position fen " + fen);
    this.engine.postMessage("go movetime 200");
  }

  terminate() {
    if (this.engine) this.engine.terminate();
  }
}
