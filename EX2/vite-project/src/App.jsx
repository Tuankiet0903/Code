import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import ComicPage from './pages/ComicPage'
import WeatherBroadcast from './pages/WeatherBoardcast';
import Board2048 from './pages/2048page';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<ComicPage />} />
        <Route path="weather" element={<WeatherBroadcast />} />
        <Route path="2048" element={<Board2048 />} />
      </Routes>
    </>
  )
}

export default App
