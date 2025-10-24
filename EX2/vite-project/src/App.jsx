import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import ComicPage from "./pages/ComicPage";
import WeatherBroadcast from "./pages/WeatherBoardcast";
import Board2048 from "./pages/2048Page";
import Navbar from "./components/Navbar.jsx";
import ChessPage from "./pages/ChessPage.jsx";
import ChessPageMultiplayer from "./pages/ChessPageMulti.jsx";
import ThreejsPage from "./pages/Threejs.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<ComicPage />} />
        <Route path="weather" element={<WeatherBroadcast />} />
        <Route path="2048" element={<Board2048 />} />
        <Route path="chess" element={<ChessPage />} />
        <Route path="chess-multiplayer" element={<ChessPageMultiplayer />} />
        <Route
          path="threejs"
          element={
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "calc(100vh - 60px)",
              }}
            >
              <ThreejsPage />
            </div>
          }
        />
        <Route path="products" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
