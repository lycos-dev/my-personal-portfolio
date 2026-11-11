"use client";

import type { CSSProperties } from "react";

/** A brief grayscale sakura-petal shower. No images, timers, or render loops. */
const petals = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 43 + 17) % 97}%`,
  delay: `${(i % 9) * .31 + Math.floor(i / 9) * .35}s`,
  duration: `${5.4 + (i % 6) * .64}s`,
  size: `${9 + (i % 5) * 2.6}px`,
  drift: `${(i % 2 ? -1 : 1) * (34 + (i * 13) % 115)}px`,
  shade: ["#c6c8cf", "#9fa3ab", "#e1e2e5", "#7f848e"][i % 4],
}));

export function GrayPetalFall() {
  return (
    <div className="gray-petal-field" aria-hidden="true">
      {petals.map((petal, index) => (
        <svg
          key={index}
          className="gray-sakura-petal"
          viewBox="0 0 24 30"
          width="24"
          height="30"
          focusable="false"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: `calc(${petal.size} * 1.25)`,
            fill: petal.shade,
            "--petal-drift": petal.drift,
          } as CSSProperties}
        >
          <path d="M12 2 C7.5 1.2 3.2 5.5 3.5 12 C3.7 18.6 9.4 25.6 12 28 C14.7 25.8 20.5 18.7 20.5 12 C20.7 5.6 16.5 1.3 12 2 Z" />
          <path d="M12 8 C11.7 13.5 12 18.7 12 25" stroke="#34363b" strokeOpacity=".24" strokeWidth=".8" fill="none" />
        </svg>
      ))}
    </div>
  );
}
