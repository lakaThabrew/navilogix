import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";

export default function RadialShareMenu() {
  const [open, setOpen] = useState(false);

  // Auto-open on first render to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // circle geometry - adjusted for better fit
  const radius = 95;

  const items = useMemo(
    () => [
      {
        label: "WhatsApp",
        iconPath:
          "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.289.173-1.411-.074-.122-.272-.214-.57-.364z M12.067 0C5.412 0 0 5.412 0 12.067c0 2.124.55 4.192 1.594 6.012L0 24l6.095-1.597a12.023 12.023 0 0 0 5.972 1.564c6.655 0 12.067-5.412 12.067-12.067C24.134 5.412 18.722 0 12.067 0z M12.067 22.068c-1.91 0-3.784-.512-5.418-1.48L3.25 21.56l.99-3.626c-1.064-1.688-1.624-3.642-1.624-5.867 0-5.55 4.517-10.067 10.067-10.067 5.55 0 10.067 4.517 10.067 10.067 0 5.55-4.517 10.067-10.067 10.067z",
        color: "#25D366",
        angle: 0,
        onClick: () => window.open("https://wa.me/", "_blank"),
      },
      {
        label: "Facebook",
        iconPath:
          "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
        color: "#1877F2",
        angle: 51.4,
        onClick: () => window.open("https://facebook.com/", "_blank"),
      },
      {
        label: "Email",
        iconPath:
          "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
        color: "#EA4335",
        angle: 102.8,
        onClick: () => (window.location.href = "mailto:support@navilogix.com"),
      },
      {
        label: "Instagram",
        iconPath:
          "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
        color: "#E4405F",
        angle: 154.2,
        onClick: () => window.open("https://instagram.com/", "_blank"),
      },
      {
        label: "Web",
        iconPath:
          "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
        color: "#001F3F",
        angle: 205.6,
        onClick: () => window.open("https://navilogix.com", "_blank"),
      },
      {
        label: "GitHub",
        iconPath:
          "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
        color: "#333",
        angle: 257,
        onClick: () => window.open("https://github.com/", "_blank"),
      },
      {
        label: "Twitter",
        iconPath:
          "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
        color: "#1DA1F2",
        angle: 308.4,
        onClick: () => window.open("https://twitter.com/", "_blank"),
      },
    ],
    [],
  );

  const placed = items.map((it, idx) => {
    const a = (it.angle * Math.PI) / 180;
    return {
      ...it,
      x: Math.cos(a) * radius,
      y: Math.sin(a) * radius,
      delay: idx * 0.04,
    };
  });

  return (
    <div className="w-full flex items-center justify-center lg:justify-start">
      <div className="relative w-[450px] h-[450px] grid place-items-center overflow-visible">
        {/* Items */}
        <AnimatePresence>
          {open &&
            placed.map((it) => (
              <motion.button
                key={it.label}
                onClick={it.onClick}
                className="absolute w-12 h-12 rounded-full bg-white shadow-lg grid place-items-center group transition-colors hover:bg-gray-50"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  x: it.x,
                  y: it.y,
                  scale: 1,
                }}
                exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: it.delay,
                }}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={it.label}
              >
                <svg
                  className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                  style={{ color: it.color }}
                  viewBox="0 0 24 24"
                >
                  <path d={it.iconPath} />
                </svg>
                {/* Tooltip */}
                <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                  {it.label}
                </span>
              </motion.button>
            ))}
        </AnimatePresence>

        {/* Center Toggle Button */}
        <motion.button
          className="relative z-10 w-16 h-16 rounded-full bg-white shadow-2xl grid place-items-center border-2 border-primary/5"
          onClick={() => setOpen((v) => !v)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
            boxShadow: open ? "0 20px 25px -5px rgb(0 0 0 / 0.1)" : "0 0 20px rgba(0, 31, 63, 0.2)"
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Share"
        >
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Share2 size={28} className={open ? "text-secondary" : "text-primary"} />
          </motion.div>

          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-primary/20"
            animate={{
              opacity: open ? 1 : [0.4, 0.8, 0.4],
              scale: open ? 1.08 : [1, 1.1, 1],
              borderColor: open ? "#FF4136" : ["#001F3F", "#FF4136", "#001F3F"],
            }}
            transition={{
              duration: open ? 0.3 : 2,
              repeat: open ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.button>
      </div>
    </div>
  );
}
