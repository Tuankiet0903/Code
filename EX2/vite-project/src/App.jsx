import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import ComicPage from './pages/ComicPage'
import WeatherBroadcast from './pages/WeatherBoardcast';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<ComicPage />} />
        <Route path="weather" element={<WeatherBroadcast />} />
      </Routes>
    </>
  )
}

export default App
