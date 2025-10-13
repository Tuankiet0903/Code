import SearchBar from "./SearchBar";
import TodayCard from "./TodayMain";
import HourlyForecast from "./HourlyForecast";
import ForecastCard from "./ForecastCard";

export default function WeatherLayout() {
    return (
        <div className="max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-wide">Weather Broadcast</h1>
                <SearchBar />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <TodayCard />
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <ForecastCard title="Today" temp={21} condition="Partly Cloudy" />
                    <ForecastCard title="Tomorrow" temp={24} condition="Sunny" />
                </div>
            </div>

            <HourlyForecast />

            <div className="grid grid-cols-7 gap-3">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
                    <ForecastCard key={idx} title={day} temp={22 + idx} condition="Sunny" compact />
                ))}
            </div>
        </div>
    );
}
