import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/**
 * Notes:
 * - Make sure the font you're using (e.g., "Georama") is a variable font that supports "wght".
 * - If the font file isn't loaded yet, weights won't show change until it is loaded.
 */

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, base: 100 },
  title: { min: 400, max: 900, base: 400 },
};

const renderText = (text, className, baseWeight = 400) =>
  [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      // IMPORTANT: inline-block + will-change helps browser paint and animation performance
      style={{
        display: "inline-block",
        willChange: "font-variation-settings",
        fontVariationSettings: `"wght" ${baseWeight}`,
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const setup = (container, type) => {
      if (!container) return () => {};
      const letters = [...container.querySelectorAll("span")];
      if (!letters.length) return () => {};

      const { min, max, base } = FONT_WEIGHTS[type];

      // cache container rect and center positions of letters
      let containerRect = container.getBoundingClientRect();
      let positions = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return r.left + r.width / 2;
      });

      // quick setters to set fontVariationSettings fast
      const setters = letters.map((l) =>
        gsap.quickSetter(l, "fontVariationSettings", "")
      );

      // current and target arrays for per-frame interpolation
      const current = letters.map(() => base);
      const target = letters.map(() => base);

      // single tick that lerps current -> target and updates setters
      const tick = () => {
        // simple lerp factor; tweak for snappier or smoother
        const lerp = 0.18;
        for (let i = 0; i < letters.length; i++) {
          const c = current[i];
          const t = target[i];
          const next = c + (t - c) * lerp;
          current[i] = next;
          // set as: "wght" 450  (no extra quotes)
          setters[i](`"wght" ${next.toFixed(2)}`);
        }
      };

      gsap.ticker.add(tick);

      const handleMouseMove = (e) => {
        const mouseX = e.clientX - containerRect.left;
        for (let i = 0; i < letters.length; i++) {
          const distance = Math.abs(mouseX - positions[i]);
          // same Gaussian-like falloff you used (adjust divisor for spread)
          const intensity = Math.exp(-(distance * distance) / 18000);
          target[i] = min + (max - min) * intensity;
        }
      };

      const handleMouseLeave = () => {
        for (let i = 0; i < target.length; i++) target[i] = base;
      };

      const handleResize = () => {
        containerRect = container.getBoundingClientRect();
        positions = letters.map((l) => {
          const r = l.getBoundingClientRect();
          return r.left + r.width / 2;
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", handleResize);

      // cleanup
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", handleResize);
        gsap.ticker.remove(tick);
      };
    };

    const cleanTitle = setup(titleRef.current, "title");
    const cleanSubtitle = setup(subtitleRef.current, "subtitle");

    // entrance stagger (optional)
    gsap.from(subtitleRef.current?.querySelectorAll("span"), {
      opacity: 0,
      y: 8,
      stagger: 0.02,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.from(titleRef.current?.querySelectorAll("span"), {
      opacity: 0,
      y: 24,
      stagger: 0.03,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.08,
    });

    return () => {
      cleanTitle && cleanTitle();
      cleanSubtitle && cleanSubtitle();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {renderText("Hey, I'm Husnain Welcome to my", "text-3xl font-georama", 100)}
      </p>

      <h1 ref={titleRef} className="mt-7">
        {renderText("portfolio", "text-9xl italic font-georama", 400)}
      </h1>

      <div className="small-screen">
        <p>This portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
