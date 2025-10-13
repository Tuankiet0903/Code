export default function MangaCard({ manga }) {
    return (
        <div className="min-w-[160px] transform transition-transform duration-300 hover:scale-105">
            <div className="relative h-[220px] overflow-hidden rounded-md shadow-md">
                <img
                    src={manga.image}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 dark:bg-sky-500 dark:text-white text-xs px-1 py-[1px] rounded">
                    {manga.time}
                </span>
                {manga.hot && (
                    <span className="absolute top-1 right-1 dark:bg-red-500 dark:text-white text-xs px-1 py-[1px] rounded">
                        Hot
                    </span>
                )}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-white truncate">{manga.title}</h3>
            <p className="text-xs text-gray-300">{manga.chapter}</p>
        </div>
    );
}
