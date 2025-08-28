import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = ["Easyway Classes", "Easyway AI"];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { ease: "easeIn", duration: 0.25 },
  },
};

const TypingMotion = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3500); // switch text every 3.5s

    return () => clearTimeout(timeout);
  }, [index]);

  const currentText = phrases[index];

  return (
    <div className="text-center lg:text-left">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentText}
          className="flex flex-wrap justify-center lg:justify-start font-bold
                     text-4xl sm:text-6xl lg:text-7xl 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-400 via-sky-300 to-gray-400
                     my-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentText.split("").map((char, i) => (
            <motion.span key={i} variants={letterVariants}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TypingMotion;
