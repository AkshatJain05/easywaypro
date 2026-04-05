import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        background: "radial-gradient(ellipse at 60% 40%, #0a0f1e 0%, #050810 60%, #000308 100%)",
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      {/* Ambient glow layer */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.06) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Orbital ring system */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>

        {/* Outermost slow ring */}
        <motion.div
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1px solid rgba(99,102,241,0.15)",
            borderTopColor: "rgba(99,102,241,0.6)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        {/* Middle ring — counter-rotate */}
        <motion.div
          style={{
            position: "absolute",
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "1.5px solid rgba(56,189,248,0.12)",
            borderBottomColor: "rgba(56,189,248,0.65)",
            borderLeftColor: "rgba(56,189,248,0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
        />

        {/* Inner fast ring */}
        <motion.div
          style={{
            position: "absolute",
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "2px solid rgba(251,191,36,0.08)",
            borderRightColor: "rgba(251,191,36,0.5)",
            borderTopColor: "rgba(251,191,36,0.2)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />

        {/* Center pulse orb */}
        <motion.div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.95), rgba(99,102,241,0.7) 60%, rgba(56,189,248,0.3) 100%)",
            boxShadow:
              "0 0 12px rgba(56,189,248,0.6), 0 0 32px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>

      {/* Label + dots */}
      <div className="flex flex-col items-center gap-3 mt-10">
        <motion.p
          style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(148,163,184,0.6)",
            fontWeight: 500,
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Loading
        </motion.p>

        {/* Dot bar */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              style={{
                display: "block",
                width: i === 1 || i === 2 ? 14 : 5,
                height: 3,
                borderRadius: 2,
                background:
                  i === 1
                    ? "rgba(56,189,248,0.8)"
                    : i === 2
                    ? "rgba(99,102,241,0.6)"
                    : "rgba(100,116,139,0.3)",
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;