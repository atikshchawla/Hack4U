"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Reusable Spring Configuration
const spring = { type: "spring", stiffness: 400, damping: 30 };

export function TextInput({ label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-lg font-medium text-white">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-white/30 py-3 text-xl text-white placeholder:text-white/40 focus:outline-none focus:border-green-500 transition-colors"
      />
    </div>
  );
}

export function AnimatedDropdown({ options, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className={cn("relative w-full", className)}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl text-left transition-colors border border-white/5"
      >
        <span className={cn("text-lg", selected ? "text-white" : "text-white/60")}>
          {selected || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={spring}
        >
          <ChevronDown className="w-5 h-5 text-white/70" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={spring}
            className="absolute z-50 left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-white/80 hover:bg-green-600/20 hover:text-green-400 cursor-pointer transition-colors"
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}