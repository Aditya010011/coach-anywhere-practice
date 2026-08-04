// Lightweight dependency-free confetti burst.
export function fireConfetti(durationMs = 1800) {
  if (typeof document === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  root.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(root);

  const colors = ["#7c3aed", "#a855f7", "#f0b429", "#22c55e", "#3b82f6"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("span");
    const size = 6 + Math.random() * 6;
    p.style.cssText = `position:absolute;top:-5vh;left:${Math.random() * 100}vw;width:${size}px;height:${size * 1.6}px;background:${colors[i % colors.length]};border-radius:2px;opacity:1`;
    root.appendChild(p);
    p.animate(
      [
        { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate3d(${(Math.random() - 0.5) * 240}px, 110vh, 0) rotate(${Math.random() * 900}deg)`,
          opacity: 0.9,
        },
      ],
      {
        duration: durationMs * (0.6 + Math.random() * 0.6),
        easing: "cubic-bezier(0.2, 0.7, 0.4, 1)",
        fill: "forwards",
      },
    );
  }

  window.setTimeout(() => root.remove(), durationMs * 1.4);
}
