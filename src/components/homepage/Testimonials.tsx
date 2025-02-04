'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    role: 'Photography',
    content: '"Looking for wedding photographers in San Francisco with availability next month"',
  },
  {
    role: 'Retail',
    content: '"Flower shop distribution opportunities in Las Vegas - wholesale partnerships"',
  },
  {
    role: 'Food Service',
    content: '"Restaurant owners seeking local organic produce suppliers in Portland"',
  },
  {
    role: 'Real Estate',
    content: '"Property management companies looking for maintenance contractors in Miami"',
  }
];

// Duplicate the testimonials array to ensure smooth infinite scrolling
const duplicatedTestimonials = [...testimonials, ...testimonials];

export function Testimonials() {
  return (
    <div className="py-16 px-4">
      <h2 className="text-center text-3xl font-bold mb-2">
        How It Works 🔍
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Define the leads you want in English, and we will find them for you
      </p>
      
      <div className="relative mt-12 max-w-5xl mx-auto">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
        
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-scroll">
            {/* First set of testimonials */}
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`first-${index}`}
                className="w-[280px] flex-shrink-0 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 transition-colors duration-300 hover:bg-gray-100"
              >
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mb-3">
                  {testimonial.role}
                </span>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
            {/* Second set of testimonials for seamless looping */}
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`second-${index}`}
                className="w-[280px] flex-shrink-0 bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 transition-colors duration-300 hover:bg-gray-100"
              >
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mb-3">
                  {testimonial.role}
                </span>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}