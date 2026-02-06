"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import BreathingLung from "../breathinglung/BreathingLung";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    const animate = () => {
      // Smoother fade with lower alpha for silky trails
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(61, 71, 73, 0.08)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();

      const centerY = canvas.height / 2;
      const breathingAmplitude = 25;
      const breathingFrequency = 0.008;

      // Multiple wave layers for a flowing breeze effect
      for (let x = 0; x < canvas.width; x++) {
        let y = centerY;

        // Primary breathing wave - slow and gentle
        y +=
          Math.sin(x * breathingFrequency + time * 0.005) * breathingAmplitude;

        // Secondary wave - creates flow and movement
        y +=
          Math.sin(x * breathingFrequency * 0.6 + time * 0.0035) *
          breathingAmplitude *
          0.5;

        // Tertiary wave - adds organic variation
        y +=
          Math.cos(x * breathingFrequency * 1.5 + time * 0.0025) *
          breathingAmplitude *
          0.3;

        // Subtle depth wave
        y +=
          Math.sin(x * breathingFrequency * 0.3 + time * 0.002) *
          breathingAmplitude *
          0.2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Faster time increment
      time += 1.2;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 1 }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(61, 71, 73, 0.08) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.6,
        }}
      />

      {/* Breathing Lung - Smaller sizing */}
      <div className="relative z-10 flex items-center justify-center ">
        <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
          <BreathingLung />
        </div>
      </div>

      <div className="relative text-2xl md:text-2xl lg:text-6xl text-primary mb-2">
        <div>
          Lung
          <div>Inland Empire Lung</div>
        </div>
        <div>& Sleep Institute</div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm md:text-base font-semibold tracking-widest uppercase mb-4">
            Breathe | Sleep | Thrive
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Comprehensive Respiratory Care
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-light">
            Science-Led. Patient-Centered.
          </p>
        </div>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-light">
          Comprehensive care for pulmonary and sleep disorders with a commitment
          to delivering science-driven treatment aligned with your values.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
            SCHEDULE APPOINTMENT
          </button>
          <button className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md">
            LEARN MORE
          </button>
        </div>
      </div>

      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-8 h-8 text-gray-700 opacity-60" />
      </div> */}
    </section>
  );
}
