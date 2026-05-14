import { useEffect, useState } from "react";

const COLORS = ["#a78bfa", "#4ade80", "#67e8f9", "#f0abfc", "#fbbf24"];

export function Confetti({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (show) setPieces(Array.from({ length: 80 }, (_, i) => i));
    else setPieces([]);
  }, [show]);
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 2 + Math.random() * 2;
        const color = COLORS[i % COLORS.length];
        const size = 6 + Math.random() * 8;
        const rotate = Math.random() * 360;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-20px",
              width: size,
              height: size * 0.4,
              background: color,
              transform: `rotate(${rotate}deg)`,
              animation: `confetti-fall ${duration}s ${delay}s linear forwards`,
              borderRadius: "2px",
            }}
          />
        );
      })}
      <style>{`@keyframes confetti-fall {
        to { transform: translateY(110vh) rotate(720deg); opacity: 0.4; }
      }`}</style>
    </div>
  );
}
