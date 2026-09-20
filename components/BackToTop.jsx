'use client';

import { useState, useEffect } from 'react';

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-6 w-6"
      fill="currentColor"
    >
      <path d="M16.04 3.5C9.63 3.5 4.5 8.53 4.5 14.82c0 2.25.63 4.42 1.8 6.3L4.8 27.5l6.6-1.74a11.96 11.96 0 0 0 4.64 1.02c6.41 0 11.54-5.03 11.54-11.32C27.58 8.53 22.45 3.5 16.04 3.5Zm0 20.9c-1.44 0-2.85-.39-4.08-1.13l-.29-.17-3.92 1.03 1.05-3.82-.19-.32A9.82 9.82 0 0 1 6.3 14.8c0-5.2 4.2-9.39 9.74-9.39s9.74 4.19 9.74 9.39c0 5.21-4.2 9.4-9.74 9.4Zm5.36-7.08c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.65.14-.19.29-.73.95-.9 1.15-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.57-.89-2.15-.24-.59-.48-.5-.66-.5h-.56c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.4 0 1.42 1.02 2.77 1.17 2.96.15.19 2.02 3.08 4.9 4.32.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z"/>
    </svg>
  );
}

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

  const whatsappLink = `https://wa.me/18402580972?text=${encodeURIComponent('Hi, I need consultation for ...')}`;

  return (
    isVisible && (
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.38)] transition-all duration-300 hover:scale-105"
        >
          <WhatsAppIcon />
        </a>

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