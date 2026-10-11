'use client';

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={scrollToTop}
          className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#3D4749] text-xl font-bold text-white shadow-2xl transition hover:bg-[#2d3538]"
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    )
  );
}