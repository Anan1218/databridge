'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const words = ['generate', 'monitor', 'analyze'];

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
            <span className="text-center">leads with AI</span>
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
          Our AI agents scan the web 24/7 to find valuable leads, insights, and customer conversations—so you don't have to.
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
      
      {/* Replace iPad with Lead Monitoring Table */}
      <div className="relative w-full flex justify-center -mt-4">
        <div 
          className="w-[96%] md:w-[80%] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-500 ease-out will-change-transform"
          style={{
            transform: `
              rotateX(${Math.max(0, 12 * (1 - scrollY))}deg)
              scale(${0.95 + (scrollY * 0.05)})
              translateY(${scrollY * -30}px)
            `,
            transformOrigin: 'center bottom',
          }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Lead Monitoring</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Website</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Summary</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">Purchase Intent</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      website: 'reddit',
                      summary: 'Looking for wedding photographers in San Francisco',
                      hasPurchaseIntent: true,
                    },
                    {
                      website: 'linkedin',
                      summary: 'Potentially needs help with lead generation for local business',
                      hasPurchaseIntent: false,
                    },
                    {
                      website: 'upwork',
                      summary: 'Looking for web developers to build their website',
                      hasPurchaseIntent: true,
                    },
                  ].map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {item.website === 'reddit' && (
                          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                            </svg>
                          </div>
                        )}
                        {item.website === 'linkedin' && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                          </div>
                        )}
                        {item.website === 'upwork' && (
                          <div className="w-8 h-8 rounded-full bg-[#14a800] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.summary}</td>
                      <td className="py-3 px-4">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          item.hasPurchaseIntent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.hasPurchaseIntent ? 'True' : 'False'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded" title="View Source">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-blue-100 rounded" title="Contact">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-red-100 rounded" title="Delete">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 