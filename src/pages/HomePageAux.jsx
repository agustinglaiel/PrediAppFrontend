import React from "react";

const HomePageAux = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* ── Floating particles background ── */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full opacity-20"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `hsl(${200 + Math.random() * 40}, 80%, 65%)`,
              animation: `floatParticle ${6 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main card ── */}
      <div className="animate-fadeInUp relative z-10 mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
        {/* Gears animation */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {/* Left gear */}
          <svg
            className="animate-spinSlow h-16 w-16 text-sky-400 sm:h-20 sm:w-20"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 30a20 20 0 100 40 20 20 0 000-40zm0 30a10 10 0 110-20 10 10 0 010 20z" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="46"
                y="5"
                width="8"
                height="18"
                rx="3"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>

          {/* Right gear (counter-rotate, offset) */}
          <svg
            className="animate-spinSlowReverse -ml-3 h-12 w-12 text-amber-400 sm:h-14 sm:w-14"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 30a20 20 0 100 40 20 20 0 000-40zm0 30a10 10 0 110-20 10 10 0 010 20z" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <rect
                key={angle}
                x="46"
                y="5"
                width="8"
                height="18"
                rx="3"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
          </svg>
        </div>

        {/* Wrench & cone icons row */}
        <div className="mb-6 flex items-center justify-center gap-4 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            🔧
          </span>
          <span className="animate-pulse text-5xl">🚧</span>
          <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>
            🛠️
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fadeInUp mb-3 text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
          ¡Estamos trabajando en{" "}
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            mejoras
          </span>{" "}
          para vos!
        </h1>

        {/* Subtitle */}
        <p className="animate-fadeInUp mb-8 text-center text-base leading-relaxed text-slate-300 sm:text-lg"
           style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          Pronto estaremos productivos. Estamos preparando algo increíble 🏎️
        </p>

        {/* Animated progress bar */}
        <div className="animate-fadeInUp mx-auto mb-6 h-2 w-4/5 overflow-hidden rounded-full bg-white/10"
             style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
          <div className="animate-progressSlide h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500 bg-[length:200%_100%]" />
        </div>

        {/* Pulsing dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400"
              style={{
                animation: "dotPulse 1.4s ease-in-out infinite",
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      {/* ── Keyframes injected via <style> ── */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          25%      { transform: translateY(-30px) translateX(10px); }
          50%      { transform: translateY(-10px) translateX(-15px); }
          75%      { transform: translateY(-40px) translateX(5px); }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spinSlowReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        @keyframes progressSlide {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%           { transform: scale(1);   opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-spinSlow {
          animation: spinSlow 6s linear infinite;
        }
        .animate-spinSlowReverse {
          animation: spinSlowReverse 4.5s linear infinite;
        }
        .animate-progressSlide {
          animation: progressSlide 2.5s linear infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePageAux;
