import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, base: 100 },
  title: { min: 400, max: 900, base: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `"wght" ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return;

  const letters = container.querySelectorAll("span");
  const { min, max, base } = FONT_WEIGHTS[type];

  // Pre-calc positions
  const positions = [...letters].map((letter) => {
    const rect = letter.getBoundingClientRect();
    return rect.left + rect.width / 2;
  });

  const animateLetter = (letter, weight, duration = 0.22) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `"wght" ${weight}`,
    });
  };

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter, i) => {
      const distance = Math.abs(mouseX - positions[i]);
      const intensity = Math.exp(-(distance * distance) / 18000);
      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, base, 0.3));
  };

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    // Hover setup
    const cleanTitle = setupTextHover(titleRef.current, "title");
    const cleanSubtitle = setupTextHover(subtitleRef.current, "subtitle");

    // Entrance animation
    gsap.from(subtitleRef.current?.querySelectorAll("span"), {
      opacity: 0,
      y: 10,
      stagger: 0.02,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.from(titleRef.current?.querySelectorAll("span"), {
      opacity: 0,
      y: 30,
      stagger: 0.03,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.1,
    });

    return () => {
      cleanTitle && cleanTitle();
      cleanSubtitle && cleanSubtitle();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {renderText(
          "Hey, I'm Husnain Welcome to my",
          "text-3xl font-georama",
          100
        )}
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
