import confetti from "canvas-confetti";

export const fireSuccessConfetti = () => {
  // Phase 1: Left and Right Cannons
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#8B5CF6", "#6366F1", "#EC4899", "#3B82F6"],
  });

  fire(0.2, {
    spread: 60,
    colors: ["#A855F7", "#38BDF8", "#F43F5E", "#10B981"],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#F59E0B", "#8B5CF6", "#6366F1"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#EC4899", "#8B5CF6", "#10B981"],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#38BDF8", "#8B5CF6", "#F59E0B"],
  });

  // Phase 2: Center Stars Firework Burst after 300ms
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 360,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#8B5CF6", "#C084FC", "#38BDF8", "#F472B6", "#FBBF24"],
      shapes: ["star"],
      scalar: 1.2,
      zIndex: 9999,
    });
  }, 350);
};
