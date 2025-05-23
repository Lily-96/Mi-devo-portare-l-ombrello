import React from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CityWeather from "./components/CityWeather";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/city-weather" element={<CityWeather />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
