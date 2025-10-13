export default function TodayMain({ city, weather }) {
    const current = weather.current;
    const today = new Date(weather.daily.time[0]).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="grid grid-cols-3 gap-6 items-center">
            <div className="bg-white/20 rounded-2xl p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold">{today}</h2>
                <p className="text-white/80">{city}</p>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
                    alt="Weather Icon"
                    className="w-20 my-4"
                />
                <h3 className="text-5xl font-semibold">{current.temperature_2m}°C</h3>
                <p className="text-lg mt-2">
                    Humidity: {current.relative_humidity_2m}%
                </p>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-white/15 rounded-2xl p-5 flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-lg">Today</h3>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
                        alt=""
                        className="w-12 my-2"
                    />
                    <p className="text-2xl font-bold">
                        {weather.daily.temperature_2m_max[0]}° / {weather.daily.temperature_2m_min[0]}°
                    </p>
                </div>
                <div className="bg-white/15 rounded-2xl p-5 flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-lg">Tomorrow</h3>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/414/414825.png"
                        alt=""
                        className="w-12 my-2"
                    />
                    <p className="text-2xl font-bold">
                        {weather.daily.temperature_2m_max[1]}° / {weather.daily.temperature_2m_min[1]}°
                    </p>
                </div>
            </div>
        </div>
    );
}
