import { useEffect, useState } from "react";
import Section from "../components/Comic/Section";
import Navbar from "../components/Comic/Navbar";
import { hotMangas, exclusiveMangas } from "../data/manga";
import { topReaders, topContributes } from "../data/account";

import ad1 from "../assets/Your-old-code.jpg";
import ad2 from "../assets/why.jpg";

const memes = [
    {
        src: ad1,
        alt: "ad1",
    },
    {
        src: ad2,
        alt: "ad2",
    },
];

export default function ComicPage() {
    const [currentAd, setCurrentAd] = useState(0);

    // Tự động đổi quảng cáo mỗi 3 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAd((prev) => (prev + 1) % memes.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0f1a2b] min-h-screen w-full flex justify-center">
            {/* Container tổng (3 cột) */}
            <div className="flex w-full max-w-[1600px]">
                {/* Quảng cáo trái */}
                <aside className="hidden xl:flex flex-col items-center w-52 p-3 text-white text-sm bg-[#0c1423] shrink-0 pt-10">
                    {/* <h1 className="mb-4 font-semibold text-orange-400">Quảng cáo</h1> */}
                    <div className="relative min-w-[350px] h-[500px] rounded-md overflow-hidden shadow-md right-[120px] top-[100px]">
                        {memes.map((img, index) => (
                            <img
                                key={index}
                                src={img.src}
                                alt={img.alt}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentAd ? "opacity-100" : "opacity-0"
                                    }`}
                            />
                        ))}
                    </div>
                </aside>

                {/* Nội dung chính */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Navbar />
                    <main className="p-6">
                        <Section title="Truyện Hay" mangas={hotMangas} />
                        <Section title="Độc Quyền Truyện QQ" mangas={exclusiveMangas} />
                        <Section title="Truyện Hay" mangas={hotMangas} />
                        <Section title="Độc Quyền Truyện QQ" mangas={exclusiveMangas} />
                    </main>
                </div>

                {/* Bảng xếp hạng */}
                <aside className="hidden xl:flex flex-col w-52 p-4 text-white bg-[#0c1423] shrink-0 space-y-8">
                    {/* Top Reader */}
                    <div className="pt-12">
                        <h2 className="text-lg font-semibold mb-4 text-orange-400">
                            Top Reader
                        </h2>
                        <ul className="space-y-3">
                            {topReaders.map((reader) => (
                                <li
                                    key={reader.id}
                                    className="flex items-center gap-3 bg-[#1a2438] rounded-lg p-2 hover:bg-[#24324d] transition"
                                >
                                    <img
                                        src={reader.avatar}
                                        alt={reader.name}
                                        className="w-10 h-10 rounded-full border border-gray-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{reader.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {reader.readCount} truyện
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Top Contribute */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-orange-400">
                            Top Contribute
                        </h2>
                        <ul className="space-y-3">
                            {topContributes.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex items-center gap-3 bg-[#1a2438] rounded-lg p-2 hover:bg-[#24324d] transition"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border border-gray-500"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-gray-400">
                                            {user.readCount} truyện
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
