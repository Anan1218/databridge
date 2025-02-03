'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const words = ['find', 'monitor', 'analyze'];

const colors = [
  'text-[#ca16a1]',
  'text-[#a055cf]',
  'text-[#43a868]',
  // 'text-[#468de3]'   // Blue (Performance)
];

interface HeroProps {
  openModal: () => void;
}

export function Hero({ openModal }: HeroProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && containerRef.current) {
        requestAnimationFrame(() => {
          const rect = containerRef.current!.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const elementTop = rect.top;
          const elementHeight = rect.height;
          
          const progress = Math.max(0, Math.min(1, 
            1 - ((elementTop + elementHeight) / (viewportHeight + elementHeight))
          ));
          
          setScrollY(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsExiting(false);
      }, 600);
    }, 3000);
    return () => clearInterval(wordInterval);
  }, []);

  const renderStaggeredWord = (word: string) => {
    if (isExiting) {
      return (
        <div className="animate-word-exit">
          {word}
        </div>
      );
    }
    return (
      <div className="flex">
        {word.split('').map((letter, i) => (
          <span
            key={i}
            className="animate-letter-enter"
            style={{ 
              animationDelay: `${i * 35}ms`,
              display: 'inline-block'
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="text-center">The best way to</span>
          </div>
          <div className="flex items-center justify-center gap-2 whitespace-nowrap mb-8">
            <div
              key={currentWord}
              className={`${colors[currentWord]} overflow-hidden lg:mr-2 min-w-[80px] sm:min-w-[120px] text-center flex justify-center`}
            >
              {renderStaggeredWord(words[currentWord])}
            </div>
            <span className="text-center">customers with AI</span>
          </div>
        </h1>
        
        <style jsx global>{`
          @keyframes letterEnter {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes wordExit {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-10px);
            }
          }
          
          .animate-letter-enter {
            animation: letterEnter 0.4s ease forwards;
            opacity: 0;
          }

          .animate-word-exit {
            animation: wordExit 0.4s ease forwards;
          }
        `}</style>
        
        <p className="text-base text-gray-600 leading-relaxed animate-fade-in max-w-[660px] mx-auto mb-4 text-center">
          Our AI agents scan the web 24/7 to find valuable leads, insights, and customer conversations—so you don't have to. Automate data extraction and stay ahead effortlessly.
        </p>

        <div className="flex gap-3 justify-center mb-12 mt-8">
          <button 
            onClick={openModal}
            className="inline-block bg-[#974eea] text-white px-5 py-2.5 rounded-lg font-normal transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)]"
          >
            Get Started
          </button>
          <Link 
            href="/contact" 
            className="inline-block border border-[#d5d4d4] text-[#000000] hover:bg-[#8b5cf6]/5 px-4 py-2.5 rounded-lg font-normal transition-all hover:scale-105"
          >
            Live Demo
          </Link>
        </div>
      </div>
      
      {/* iPad Dashboard Container */}
      <div className="relative w-full [perspective:1500px] flex justify-center -mt-4">
        <div 
          className="absolute left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" 
          style={{ 
            bottom: '-40px',
            transform: 'translateY(100%)',
            zIndex: 10
          }}
        />
        
        <div 
          className="relative w-[96%] md:w-[80%] transition-all duration-500 ease-out will-change-transform"
          style={{
            transform: `
              rotateX(${Math.max(0, 12 * (1 - scrollY))}deg)
              scale(${0.95 + (scrollY * 0.05)})
              translateY(${scrollY * -30}px)
            `,
            transformOrigin: 'center bottom',
          }}
        >
          <div 
            className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-black p-[6px] md:p-[10px] will-change-transform shadow-2xl transition-all duration-700"
          >
            {/* iPad Camera */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-md z-10 border border-gray-700 hidden md:block" />
            
            {/* Screen Content */}
            <div className="relative rounded-[1.2rem] md:rounded-[2.4rem] overflow-hidden bg-white">
              <Image 
                src="/homepage/image1.png"
                alt="DataBridge Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto object-cover transform-gpu"
                priority
                loading="eager"
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 