"use client";
import { useState } from 'react';
import Link from 'next/link';

interface FaqProps {
  openModal: () => void;
}

export function Faq({ openModal }: FaqProps) {
  const faqs = [
    {
      question: "How does the lead generation work?",
      answer: "Our AI agents actively monitor social media platforms to find quality leads based on contextual information. They analyze conversations and posts to identify potential customers with specific needs, then categorize and prioritize them for your business.",
    },
    {
      question: "What kind of market research can I conduct?",
      answer: "You can track customer reviews, pricing trends, competitor analysis, and industry news across multiple sources. Our platform provides real-time insights into your market position and helps you stay ahead of industry trends.",
    },
    {
      question: "What data sources can I integrate with?",
      answer: "Our platform offers seamless integration with a variety of data sources. Whether you need social media data, market research databases, or custom data sources, our system supports multiple integration methods to ensure you have all the information you need.",
    },
    {
      question: "How does team collaboration work?",
      answer: "Multiple team members can access shared workspaces, collaborate on analysis, and make data-driven decisions together. You can manage permissions, share insights, and work collectively on projects, making it perfect for businesses of all sizes.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 customer support to assist you with any issues or questions. Our dedicated support team is available around the clock, and Enterprise customers get additional benefits like a dedicated account manager and custom SLA.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 mt-4">
      <div className="text-center mb-8">
        <span className="text-[#8b5cf6] text-sm font-medium">FAQ</span>
        <h2 className="text-3xl font-medium text-gray-900 mt-1">Got Questions?</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100 transition-all flex justify-between items-center text-gray-900"
            >
              <span className="font-medium">{item.question}</span>
              <span className="text-lg text-[#8b5cf6]">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="font-light p-4 bg-white border border-gray-100 mt-1 rounded-lg text-gray-700">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generate Leads Section */}
      <div className="mt-[3.2rem] -mb-4 text-center relative bg-[#ffffff] rounded-2xl">
        <h2 className="text-[2rem] font-medium text-gray-900 mb-1">Generate Quality Leads Today</h2>
        <p className="text-[1.05rem] leading-relaxed text-[#4b5563] mb-4 max-w-2xl mx-auto">
          Harness our AI-powered insights to identify, engage, and convert promising leads effortlessly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/book-demo"
            className="inline-block bg-[#974eea] text-white px-5 py-2.5 rounded-lg font-normal transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)]"
          >
            Book Demo
          </Link>
          <Link 
            href="/contact" 
            className="inline-block border border-[#d5d4d4] text-[#000000] hover:bg-[#8b5cf6]/5 px-4 py-2.5 rounded-lg font-normal transition-all hover:scale-105"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
} 