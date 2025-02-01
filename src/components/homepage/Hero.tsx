'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const words = ['Analytics', 'Insights', 'Predictions', 'Performance'];

const colors = [
  'text-[#ca16a1]',  // Pink (Analytics)
  'text-[#a055cf]',  // Purple (Insights)
  'text-[#43a868]',  // Green (Predictions)
  'text-[#468de3]'   // Blue (Performance)
];

export function Hero() {
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
      }, 400);
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
    <div className="relative w-full" ref={containerRef}>
      <div className="flex flex-col items-center max-w-[1200px] mx-auto mt-1 md:mt-6">
        <div className="w-full text-center">
          <h1 className="text-[1.8rem] md:text-[3.2rem] font-bold text-gray-900 leading-tight">
            <div className="mb-1 md:mb-0">The best way to build</div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-3">
              <div
                key={currentWord}
                className={`${colors[currentWord]} overflow-hidden whitespace-nowrap mb-0 md:mb-0`}
              >
                {renderStaggeredWord(words[currentWord])}
              </div>
              <div className="md:inline-block">in one page</div>
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
          
          <p className="text-sm md:text-base text-gray-800 leading-relaxed animate-fade-in max-w-[660px] mx-auto mt-2 md:mt-1.7 mb-4 md:mb-4 px-4 md:px-0">
            Simplify SEO analytics with <span className="font-semibold">Google Analytics</span>, <span className="font-semibold">Search Console</span> & <span className="font-semibold">Indexing</span> in one intuitive dashboard. 
            Effortlessly track key insights for all your websites in one place.
          </p>

          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
            <Link 
              href="/contact" 
              className="inline-block bg-[#974eea] text-white px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg font-normal transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)] text-sm md:text-base"
            >
              Get Started - It's Free
            </Link>
            <Link 
              href="/demo" 
              className="inline-block border border-[#d5d4d4] text-[#000000] hover:bg-[#8b5cf6]/5 px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg font-normal transition-all hover:scale-105 text-sm md:text-base"
            >
              Live Demo
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <img src="/laurel-left.svg" alt="" className="h-3 md:h-4" />
              <div className="text-center">
                <div className="text-[#5b5f7d] text-xs md:text-base font-medium whitespace-nowrap">Product of the day</div>
                <div className="text-[#5b5f7d] text-sm md:text-xl font-semibold">1st</div>
              </div>
              <img src="/laurel-right.svg" alt="" className="h-4 md:h-6" />
            </div>
          </div>
        </div>
        
        {/* iPad Dashboard Container */}
        <div className="w-full [perspective:1500px] relative flex justify-center">
          <div 
            className="absolute left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" 
            style={{ 
              bottom: '-40px',
              transform: 'translateY(100%)',
              zIndex: 10
            }}
          />
          
          <div 
            className="relative w-[90%] md:w-[80%] transition-all duration-500 ease-out will-change-transform"
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
              className="relative rounded-[2.5rem] overflow-hidden bg-black p-[10px] will-change-transform shadow-2xl transition-all duration-700"
            >
              {/* iPad Camera */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-md z-10 border border-gray-700" />
              
              {/* Screen Content */}
              <div className="relative rounded-[2.4rem] overflow-hidden bg-white">
                <Image 
                  src="/homepage/image1.png"
                  alt="DataBridge Dashboard"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transform-gpu"
                  priority
                  loading="eager"
                  sizes="(max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 