import React, { useEffect } from "react";

const PARTICLES_ID = "particles-js";

const loadParticlesScript = () => {
  return new Promise((resolve, reject) => {
    if (window.particlesJS) {
      resolve();
      return;
    }
    const existingScript = document.querySelector('script[src*="particles.min.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const Particles = () => {
  useEffect(() => {
    let destroyed = false;
    loadParticlesScript().then(() => {
      if (destroyed) return;
      if (window.particlesJS) {
        window.particlesJS(PARTICLES_ID, {
          particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" },
            },
            modes: {
              grab: { distance: 140, line_linked: { opacity: 1 } },
            },
          },
          retina_detect: true,
        });
      }
    });
    return () => {
      destroyed = true;
      // Clean up the particles.js canvas
      const container = document.getElementById(PARTICLES_ID);
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      id={PARTICLES_ID}
      className="absolute top-0 left-0 w-full h-full z-10"
    ></div>
  );
};

export default Particles;