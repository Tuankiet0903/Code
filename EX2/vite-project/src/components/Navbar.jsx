import { useNavigate } from "react-router";

const MenuCates = [
  { tag: "Homepage", link: "/" },
  { tag: "Weather", link: "/weather" },
  { tag: "2048", link: "/2048" },
  { tag: "Chess", link: "/chess" },
  { tag: "Chess Multiplayer", link: "/chess-multiplayer" },
  { tag: "Three.js", link: "/threejs" },
  { tag: "Products", link: "/products" },
  { tag: "Invitation", link: "/invitation" },
];

export default function Navbar() {
  let navigate = useNavigate();
  return (
    <header className="dark:bg-[#111]">
      {/* Thanh menu phụ */}
      <div className="dark:bg-[#003cff] flex items-center justify-evenly text-sm px-8">
        {MenuCates.map((item, index) => (
          <button
            key={index}
            className={
              "px-4 py-4 hover:dark:bg-orange-400 transition text-white text-lg font-semibold"
            }
            onClick={() => navigate(item.link)}
          >
            {item.tag}
          </button>
        ))}
      </div>
    </header>
  );
}
