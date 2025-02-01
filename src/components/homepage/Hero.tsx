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
    <div className="relative px-4" ref={containerRef}>
      <div className="flex flex-col items-center max-w-[1200px] mx-auto mt-9">
        <div className="w-full text-center mb-8">
          <h1 className="text-[3.2rem] font-bold text-gray-900 leading-tight mb-2">
            <div>The best way to build</div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3">
                <div
                  key={currentWord}
                  className={`${colors[currentWord]} overflow-hidden`}
                >
                  {renderStaggeredWord(words[currentWord])}
                </div>
                <div>in one page</div>
              </div>
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
          
          <p className="text-base text-gray-600 leading-relaxed animate-fade-in max-w-[660px] mx-auto mb-4">
            Simplify SEO analytics with <span className="font-semibold">Google Analytics</span>, <span className="font-semibold">Search Console</span> & <span className="font-semibold">Indexing</span> in one intuitive dashboard. 
            Effortlessly track key insights for all your websites in one place.
          </p>

          <div className="flex gap-3 justify-center mb-4">
            <Link 
              href="/contact" 
              className="inline-block bg-[#974eea] text-white px-5 py-2.5 rounded-lg font-normal transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)]"
            >
              Get Started - It's Free
            </Link>
            <Link 
              href="/demo" 
              className="inline-block border border-[#d5d4d4] text-[#000000] hover:bg-[#8b5cf6]/5 px-4 py-2.5 rounded-lg font-normal transition-all hover:scale-105"
            >
              Live Demo
            </Link>
          </div>

          <div className="flex items-center gap-2 justify-center mb-1">
            <div className="flex items-center gap-2 mt-3">
              <Image src="/laurel-left.svg" alt="" width={16} height={16} className="h-4" />
              <div className="text-center">
                <div className="text-[#5b5f7d] font-medium">Product of the day</div>
                <div className="text-[#5b5f7d] text-xl font-semibold">1st</div>
              </div>
              <Image src="/laurel-right.svg" alt="" width={24} height={24} className="h-6" />
            </div>
          </div>
        </div>
        
        {/* iPad Dashboard Container */}
        <div className="w-full [perspective:1500px] relative flex justify-center -mt-4">
          <div 
            className="absolute left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" 
            style={{ 
              bottom: '-40px',
              transform: 'translateY(100%)',
              zIndex: 10
            }}
          />
          
          <div 
            className="relative w-[80%] transition-all duration-500 ease-out will-change-transform"
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