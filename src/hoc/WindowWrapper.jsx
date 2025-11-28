import useWindowStore from "#store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex } = windows[windowKey];
    const ref = useRef(null);

    // Run animations on open/close
    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (isOpen) {
        // Make visible immediately
        el.style.display = "block";

        // OPEN animation
        gsap.fromTo(
          el,
          { opacity: 0.8, scale: 0.8, y: 40 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
        );
      } else {
        // CLOSE animation
        gsap.to(el, {
          opacity: 0,
          scale: 0.9,
          duration: 0.25,
          ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
          },
        });
      }
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;
      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });
      return () => instance.kill();
    }, []);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{
          zIndex,
          display: "none", // hidden by default
          transformOrigin: "center",
        }}
        className="absolute"
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
};

export default WindowWrapper;
