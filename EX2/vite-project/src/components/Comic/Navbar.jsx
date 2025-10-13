import { Search } from "lucide-react";

const MenuCates = [
    "Trang Chủ",
    "Thể Loại",
    "Xếp Hạng",
    "Con Gái",
    "Con Trai",
    "Tìm Truyện",
    "Lịch Sử",
    "Theo Dõi",
    "Thảo Luận",
    "Fanpage",
    "Yêu Cầu Dịch Truyện",
]

export default function Navbar() {
    return (
        <header className="dark:bg-[#111] text-white">
            {/* Thanh trên */}
            <nav className="flex items-center justify-between px-8 py-3 border-b border-gray-800">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-orange-400 tracking-tight">
                    TRUYEN<span className="text-white">Cười</span>
                </h1>

                {/* Thanh tìm kiếm */}
                <div className="relative w-1/3">
                    <input
                        type="text"
                        placeholder="Bạn muốn tìm truyện gì"
                        className="w-full dark:bg-[#1a1a1a] text-gray-200 pl-10 pr-4 py-2 rounded-full 
                                   focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Nút đăng ký / đăng nhập */}
                <div className="space-x-3">
                    <button className="dark:bg-[#009700] hover:bg-[#015e01] px-4 py-1.5 rounded-md text-sm font-medium">
                        Đăng ký
                    </button>
                    <button className="dark:bg-[#0069d9] hover:bg-[#0056b3] px-4 py-1.5 rounded-md text-sm font-medium">
                        Đăng nhập
                    </button>
                    {/* <ThemeToggle /> */}
                </div>
            </nav>

            {/* Thanh menu phụ */}
            <div className="dark:bg-[#1b1b1b] flex items-center justify-evenly text-sm px-8">
                {MenuCates.map((item, index) => (
                    <button
                        key={index}
                        className={"px-4 py-4 hover:dark:bg-orange-400 transition text-white text-md"}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </header>
    );
}
