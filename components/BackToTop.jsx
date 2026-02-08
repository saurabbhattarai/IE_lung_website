'use client';

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false); // Changed to FALSE

  useEffect(() => {
    console.log('✅ BackToTop mounted!');

    const toggleVisibility = () => {
      console.log('Scroll Y:', window.scrollY);
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
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
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-[#3D4749] text-white font-bold py-3 px-4 rounded-full shadow-2xl transition z-50"
        style={{ width: '50px', height: '50px' }}
      >
        ↑
      </button>
    )
  );
}