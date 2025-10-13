import { useEffect, useState, useRef } from "react";
import MangaCard from "./MangaCard";

export default function Section({ title, mangas }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(7);
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // 🧮 Tính số item hiển thị theo width
    useEffect(() => {
        const updateVisibleCount = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const cardWidth = 160 + 16; // min-w 160 + gap 16
            const count = Math.floor(containerWidth / cardWidth);
            setVisibleCount(count || 1);
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    const total = mangas.length;
    const step = Math.floor(visibleCount / 2); // số item trượt mỗi lần
    const cardWidth = 160 + 16;

    // ⏱️ Tự động slide
    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [visibleCount, total]);

    // 📦 Dịch chuyển slider
    useEffect(() => {
        if (!trackRef.current) return;
        const offset = currentIndex * cardWidth;
        trackRef.current.style.transform = `translateX(-${offset}px)`;
    }, [currentIndex]);

    // 👉 Slide phải
    const handleNext = () => {
        setCurrentIndex((prev) => {
            const next = prev + step;
            if (next + visibleCount > total) return 0; // quay lại đầu
            return next;
        });
    };

    // 👈 Slide trái
    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const next = prev - step;
            if (next < 0) return total - visibleCount; // nhảy về cuối
            return next;
        });
    };

    // 🧭 Xác định đang ở nửa đầu hay nửa sau
    const isFirstHalf = currentIndex < total / 2;

    return (
        <section className="mb-10 relative">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center pl-4">
                <span className="text-red-500 mr-2">★</span> {title}
            </h2>

            <div ref={containerRef} className="overflow-hidden w-full relative px-4">
                <div
                    ref={trackRef}
                    className="flex gap-4 transition-transform duration-700 ease-[cubic-bezier(0.45,0,0.55,1)]"
                    style={{ willChange: "transform" }}
                >
                    {mangas.map((manga, index) => (
                        <MangaCard key={index} manga={manga} />
                    ))}
                </div>

                {/* 👈 Button trái */}

                <button
                    onClick={handlePrev}
                    className="absolute top-2/5 -translate-y-1/2 left-2 flex items-center justify-center 
               w-10 h-10 dark:bg-gray-300/30 backdrop-blur-sm rounded-lg 
               text-white text-xl font-bold hover:dark:bg-gray-400/40 transition pb-1"
                >
                    ‹
                </button>


                {/* 👉 Nút phải */}

                <button
                    onClick={handleNext}
                    className="absolute top-2/5 -translate-y-1/2 right-2 flex items-center justify-center 
               w-10 h-10 dark:bg-gray-300/30 backdrop-blur-sm rounded-lg 
               text-white text-xl font-bold hover:dark:bg-gray-400/40 transition pb-1"
                >
                    ›
                </button>

            </div>
        </section>
    );
}
