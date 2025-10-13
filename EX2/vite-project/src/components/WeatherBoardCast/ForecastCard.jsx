export default function ForecastCard({ date, max, min }) {
    const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
    });
    return (
        <div className="bg-white/15 rounded-2xl flex flex-col items-center justify-center p-4">
            <h3 className="font-semibold">{day}</h3>
            <img
                src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
                alt="icon"
                className="w-8 my-2"
            />
            <p className="text-lg font-bold">
                {max}° / <span className="text-white/70">{min}°</span>
            </p>
        </div>
    );
}
