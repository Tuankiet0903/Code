export default function HourlyForecast() {
    const data = [
        { time: "09:00", temp: 21 },
        { time: "12:00", temp: 24 },
        { time: "15:00", temp: 27 },
        { time: "18:00", temp: 23 },
        { time: "21:00", temp: 20 },
    ];

    return (
        <div className="bg-white/10 p-5 rounded-2xl">
            <h2 className="text-xl font-semibold mb-3">Hourly Forecast</h2>
            <div className="flex justify-between">
                {data.map((h, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <p>{h.time}</p>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1163/1163661.png"
                            alt="icon"
                            className="w-8 my-1"
                        />
                        <p className="font-semibold">{h.temp}°C</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
