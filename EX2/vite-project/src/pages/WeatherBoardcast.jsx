import { useEffect } from "react";
import { useState } from "react";
import SearchBar from "../components/WeatherBoardCast/SearchBar";
import TodayMain from "../components/WeatherBoardCast/TodayMain";
import HourlyForecast from "../components/WeatherBoardCast/HourlyForecast";
import ForecastCard from "../components/WeatherBoardCast/ForecastCard";

function WeatherBoardcast() {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState({
        name: "Ho Chi Minh City",
        lat: 10.75,
        lon: 106.67,
        country: "VN",
    });

    useEffect(() => {
        fetchWeather(location.lat, location.lon);
    }, [location]);

    async function fetchWeather(lat, lon) {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
            );
            const data = await res.json();
            setWeather(data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 animate-gradient-x">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-6xl w-full text-white space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-wide">Weather Broadcast</h1>
                    <SearchBar onSelectCity={setLocation} />
                </div>

                {weather ? (
                    <>
                        <TodayMain city={location.name} weather={weather} />
                        <HourlyForecast />
                        <div className="grid grid-cols-7 gap-4">
                            {weather.daily.time.map((day, idx) => (
                                <ForecastCard
                                    key={idx}
                                    date={day}
                                    max={weather.daily.temperature_2m_max[idx]}
                                    min={weather.daily.temperature_2m_min[idx]}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p>Loading weather...</p>
                )}
            </div>
        </div>
    );
}

export default WeatherBoardcast;
