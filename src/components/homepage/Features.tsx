'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FeaturesProps {
  openModal: () => void;
}

const testimonials = [
  {
    name: 'James Johnson',
    role: 'SEO Manager',
    content: "SEO Statsify is the best SEO tool I have ever used 👏👏",
    image: "/path/to/james.jpg"
  },
  {
    name: 'Sophia Martinez',
    role: 'Freelance SEO Specialist',
    content: "SEO Statsify has saved me countless hours of work while delivering incredible results. 👏👏",
    image: "/path/to/sophia.jpg"
  },
  {
    name: 'Dennis',
    role: 'SEO Director',
    content: "I've never seen anything like this before. It's amazing. I love it 💕",
    image: "/path/to/dennis.jpg"
  },
  {
    name: 'William Taylor',
    role: 'E-commerce Founder',
    content: "A game-changer for SEO! The insights and ease of use are unmatched. Highly recommend.",
    image: "/path/to/william.jpg"
  },
  {
    name: 'Linda Williams',
    role: 'Product Marketing',
    content: "I love the simplicity of the tool. It makes my job easier.",
    image: "/path/to/linda.jpg"
  },
  {
    name: 'Jane Laura',
    role: 'Digital Marketer',
    content: "This is hands down the best SEO tool I've ever used 🚀",
    image: "/path/to/jane.jpg"
  },
  {
    name: 'Robert Smith',
    role: 'Agency Co-Founder',
    content: "I don't know what to say. I'm speechless. This is amazing 🌟",
    image: "/path/to/robert.jpg"
  },
  {
    name: 'Olivia Green',
    role: 'SEO Consultant',
    content: "I've tried many tools, but none come close to this. Simple, powerful, and effective. ⭐",
    image: "/path/to/olivia.jpg"
  }
];

export function Features({ openModal }: FeaturesProps) {
  const [visibleTestimonials, setVisibleTestimonials] = useState(testimonials.slice(0, 6));
  const [currentIndex, setCurrentIndex] = useState(-1);
  // const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Start the cycle after initial render
    const startTimeout = setTimeout(() => {
      setCurrentIndex(0);
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (currentIndex === -1) return;

    const updateTestimonial = () => {
      // setIsTransitioning(true);
      
      // Wait for fade out (0.75s)
      setTimeout(() => {
        const newTestimonials = [...visibleTestimonials];
        const hiddenTestimonials = testimonials.filter(
          t => !visibleTestimonials.includes(t)
        );
        
        if (hiddenTestimonials.length > 0) {
          const randomNewTestimonial = hiddenTestimonials[Math.floor(Math.random() * hiddenTestimonials.length)];
          newTestimonials[currentIndex] = randomNewTestimonial;
          setVisibleTestimonials(newTestimonials);
        }
        
        // Start fade in (0.75s)
        setTimeout(() => {
          // setIsTransitioning(false);
          
          // Wait for visibility duration (2s)
          setTimeout(() => {
            setCurrentIndex((currentIndex + 1) % 6);
          }, 1800);
        }, 560);
      }, 560);
    };

    updateTestimonial();
  }, [currentIndex, visibleTestimonials]);

  return (
    <>
      {/* Testimonials Section */}
      {/* <section className="pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-medium text-stone-950">Our Reviews 👋</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleTestimonials.map((testimonial, idx) => (
              <div 
                key={`${testimonial.name}-${idx}`}
                className={`group relative bg-white p-4 rounded-xl border border-purple-100 hover:shadow-xl`}
                style={{
                  transform: `translateY(${currentIndex === idx && isTransitioning ? '10px' : '0'})`,
                  opacity: currentIndex === idx && isTransitioning ? 0 : 1,
                  transition: 'all 750ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="mb-2 text-purple-400">
                  <svg className="w-6 h-6 opacity-80" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"/>
                  </svg>
                </div>

                <p className="text-[0.9rem] text-gray-700 mb-4 relative z-10">{testimonial.content}</p>
                
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <span className="text-base font-medium text-purple-700">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-[0.85rem]">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <div className="bg-white">
        <section className="pt-16 pb-14">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-7 relative z-10">
              <div className="space-y-0.5">
                <h2 className="text-xl font-medium text-gray-900">Everything you need</h2>
                <h3 className="text-[2.75rem] font-semibold bg-gradient-to-r from-[#6366F1] to-pink-500 text-transparent bg-clip-text">All-in-one platform</h3>
              </div>
            </div>

            {/* Main Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Market Research */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-purple-100 hover:border-purple-600 transition-colors duration-300">
                <div className="h-60 relative">
                  <Image 
                    src="/features/data-extraction.png"
                    alt="Data Monitoring"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="p-8 -mt-4 relative">
                  <h3 className="text-xl font-semibold mb-3">Data Monitoring</h3>
                  <p className="text-gray-600">
                    Track customer reviews, pricing, trends, and news across multiple sources. Get real-time insights into your market position and competitors.
                  </p>
                </div>
              </div>

              {/* Lead Generation */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-purple-100 hover:border-purple-600 transition-colors duration-300">
                <div className="h-60 relative">
                  <Image 
                    src="/features/lead-generation.png"
                    alt="Lead Generation"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="p-8 -mt-4 relative">
                  <h3 className="text-xl font-semibold mb-3">Lead Generation</h3>
                  <p className="text-gray-600">
                    Our agents monitor social media to find quality leads based on contextual information, and categorize them for your use.
                  </p>
                </div>
              </div>

            </div>

            {/* Integration Section */}
            <div className="mt-6 grid md:grid-cols-3 gap-7">
              <div className="bg-white rounded-2xl p-5 pb-14 shadow-sm border border-purple-100 relative group overflow-hidden hover:border-blue-600">
              <div className="h-44 relative">
                  <Image 
                    src="/features/help.png"
                    alt="Review Analytics"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="text-blue-600 font-semibold mb-2">SUPPORT</div>
                <h3 className="text-xl font-bold mb-3">24/7 Customer Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is available around the clock to assist you with any issues or questions. Get help anytime, anywhere, ensuring your business runs smoothly.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 pb-14 shadow-sm border border-purple-100 relative group overflow-hidden hover:border-purple-600">
              <div className="h-44 relative">
                  <Image 
                    src="/features/data-integrations.png"
                    alt="Review Analytics"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="text-purple-600 font-semibold mb-2">INTEGRATION</div>
                <h3 className="text-xl font-bold mb-3">Seamless Data Integrations</h3>
                <p className="text-gray-600">
                  Connect effortlessly with various data sources, including CRMs, ERPs, and cloud storage. Ensure your data is always up-to-date and accessible for analysis.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 pb-14 shadow-sm border border-purple-100 relative group overflow-hidden hover:border-green-600">
              <div className="h-44 relative">
                  <Image 
                    src="/features/workspace.png"
                    alt="Review Analytics"
                    width={600}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="text-green-600 font-semibold mb-2">COLLABORATION</div>
                <h3 className="text-xl font-bold mb-3">Team Access</h3>
                <p className="text-gray-600">
                  Share insights with your team, collaborate on analysis, and make data-driven decisions together. Perfect for businesses of all sizes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 -mt-10">
            <h2 className="text-3xl font-medium text-gray-900">Simple, Affordable Pricing</h2>
            <p className="text-neutral-700 mt-2 font-normal">Choose the plan that works best for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Perfect for getting started</p>
              <button 
                onClick={openModal}
                className="w-full bg-[#8b5cf6] text-white rounded-lg py-2.5 mb-6 hover:bg-[#7c3aed] transition-colors"
              >
                Get Started
              </button>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All Features Included
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Cancel Anytime
                </li>
              </ul>
            </div>

            {/* Monthly Plan */}
            <div className="bg-[#faf5ff] rounded-2xl p-6 border-[1px] border-[#8b5cf6] relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#8b5cf6] text-white px-3 py-1 rounded-full text-sm">
                Most popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">$5</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 text-sm mb-6">Full Platform Access</p>
              <button 
                onClick={openModal}
                className="w-full bg-[#8b5cf6] text-white rounded-lg py-2.5 mb-6 hover:bg-[#7c3aed] transition-colors"
              >
                Get Started Monthly
              </button>
              <ul className="space-y-4">
              <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Full Platform Access
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 10 data sources
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 3 workspaces
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  5 team members
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Money back guarantee
                </li>
              </ul>
            </div>

            {/* Yearly Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Yearly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">$50</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-[#4b4545] text-sm mb-6">Get 2 Months Free!</p>
              <button 
                onClick={openModal}
                className="w-full bg-[#8b5cf6] text-white rounded-lg py-2.5 mb-6 hover:bg-[#7c3aed] transition-colors"
              >
                Get Started Yearly
              </button>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Full Platform Access
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 10 data sources
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 3 workspaces
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  5 team members
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  24/7 Support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Money back guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
