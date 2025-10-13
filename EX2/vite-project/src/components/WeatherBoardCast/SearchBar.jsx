import { useState, useEffect } from "react";

export default function SearchBar({ onSelectCity }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=8&language=en&format=json`
                );
                const data = await res.json();
                if (data.results) {
                    setSuggestions(data.results);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching city suggestions:", error);
            }
            setLoading(false);
        };

        const timer = setTimeout(fetchCities, 400); // debounce
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (city) => {
        setQuery(`${city.name}, ${city.country}`);
        setSuggestions([]);
        onSelectCity({
            name: city.name,
            lat: city.latitude,
            lon: city.longitude,
            country: city.country,
        });
    };

    // Convert country code (e.g., "US") → emoji flag 🇺🇸
    const getFlagEmoji = (countryCode) =>
        countryCode
            ? countryCode
                .toUpperCase()
                .replace(/./g, (char) =>
                    String.fromCodePoint(127397 + char.charCodeAt())
                )
            : "";

    return (
        <div className="relative w-80">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a city..."
                className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />

            {loading && (
                <p className="absolute top-full left-3 mt-1 text-xs text-white/80">
                    Searching...
                </p>
            )}

            {suggestions.length > 0 && (
                <ul className="absolute bg-white text-black mt-2 w-full rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((city, i) => (
                        <li
                            key={i}
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex justify-between"
                            onClick={() => handleSelect(city)}
                        >
                            <div>
                                <strong>{city.name}</strong>
                                {city.admin1 ? `, ${city.admin1}` : ""}
                                <span className="text-gray-600">
                                    {" "}
                                    - {city.country}
                                </span>
                            </div>
                            <span>{getFlagEmoji(city.country_code)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
