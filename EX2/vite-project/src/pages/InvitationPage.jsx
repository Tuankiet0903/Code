import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// InvitationCard.jsx
// A single-file React component (default export) that uses Tailwind CSS and Framer Motion
// - Drop into a Vite + React + Tailwind project
// - Install framer-motion: `npm install framer-motion`
// - Usage: import InvitationCard from './InvitationCard.jsx' and render <InvitationCard />

const floatVariant = {
  animate: { y: [0, -10, 0], rotate: [0, 3, -3, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function InvitationCard({
  title = "Lễ Kỷ Niệm",
  host = "Nguyễn & Trần",
  date = "Chủ nhật, 14/12/2025 - 18:00",
  venue = "Nhà hàng Ánh Dương, Đà Nẵng",
  message = "Kính mời quý khách tới chung vui cùng chúng tôi trong buổi lễ ấm cúng.",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-pink-50">
      {/* floating decorative shapes */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ inset: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* subtle floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatVariant}
            animate="animate"
            style={{
              position: "absolute",
              width: 60 + i * 12,
              height: 60 + i * 12,
              borderRadius: 9999,
              top: `${8 + i * 12}%`,
              left: `${6 + i * 14}%`,
              opacity: 0.08 + i * 0.03,
              transform: "translateZ(0)",
              background:
                i % 2 === 0
                  ? "linear-gradient(135deg,#FDE68A,#FCA5A5)"
                  : "linear-gradient(135deg,#BFDBFE,#C7B8FF)",
            }}
          />
        ))}
      </motion.div>

      <motion.article
        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 overflow-hidden border border-white/60"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, scale: 0.98 },
          show: { opacity: 1, scale: 1, transition: { stiffness: 50 } },
        }}
      >
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <motion.h1
              className="text-3xl md:text-4xl font-extrabold text-rose-600"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              {title}
            </motion.h1>

            <motion.p
              className="mt-2 text-sm text-slate-600 max-w-xl"
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              {message}
            </motion.p>

            <motion.div
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
            >
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-white/60 border border-slate-100">
                <div className="text-xs text-slate-400">Người tổ chức</div>
                <div className="font-semibold mt-1">{host}</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-white/60 border border-slate-100">
                <div className="text-xs text-slate-400">Thời gian</div>
                <div className="font-semibold mt-1">{date}</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-white/60 border border-slate-100">
                <div className="text-xs text-slate-400">Địa điểm</div>
                <div className="font-semibold mt-1">{venue}</div>
              </div>
            </motion.div>

            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow-md hover:shadow-lg"
                onClick={() => setOpen(true)}
              >
                Xác nhận tham dự
              </motion.button>

              <a
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Thêm vào lịch
              </a>
            </div>
          </div>

          <motion.div
            className="w-40 hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.18 } }}
          >
            {/* Decorative invitation picture */}
            <div className="rounded-xl overflow-hidden shadow-inner border border-white/40">
              <div className="aspect-square bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center">
                <motion.div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-rose-700"
                  variants={floatVariant}
                  animate="animate"
                >
                  🎉
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* small animated confetti at bottom */}
        <div className="absolute left-4 right-4 bottom-4 flex justify-between gap-2 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [-6, -18, 0], opacity: [0.9, 0.6, 0.9] }}
              transition={{ delay: i * 0.06, duration: 1.6, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: 6 + (i % 3),
                height: 10 - (i % 4),
                borderRadius: 2,
                background: ["#FB7185", "#FDE68A", "#60A5FA", "#C7B8FF"][i % 4],
                transform: `rotate(${(i % 4) * 20}deg)`,
              }}
            />
          ))}
        </div>

        {/* RSVP Modal */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              <motion.div
                className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg z-10"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold">Xác nhận tham dự</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Vui lòng nhập tên và số điện thoại để chúng tôi xác nhận chỗ.
                </p>

                <form
                  className="mt-4 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    // In real app: submit to backend or show a success state
                    alert("Cảm ơn! Bạn đã xác nhận tham dự.");
                  }}
                >
                  <input
                    className="border p-3 rounded-lg"
                    placeholder="Tên của bạn"
                    required
                  />
                  <input
                    className="border p-3 rounded-lg"
                    placeholder="Số điện thoại"
                    required
                  />

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg"
                      onClick={() => setOpen(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-rose-500 text-white"
                    >
                      Gửi
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </div>
  );
}

/*
  Tips: 
  1. Add the component to your Vite app (src/components/InvitationCard.jsx) and import it in App.jsx.
  2. Install framer-motion: npm i framer-motion
  3. Tailwind should already be configured in your Vite project (tailwind.config.js + postcss).
  4. Customize props (title, host, date, venue, message) when using the component.
*/
