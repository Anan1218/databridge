"use client";
import { useState } from 'react';
import Link from 'next/link';

export function Faq() {
  const faqs = [
    {
      question: "How does DataBridge's AI forecasting work?",
      answer: "Our AI system analyzes your historical sales data, local events, weather patterns, and other relevant factors to generate accurate demand forecasts. The system continuously learns and adapts to improve prediction accuracy over time.",
    },
    {
      question: "What data do I need to get started?",
      answer: "You'll need at least 6 months of historical sales data to begin. Our system can integrate with most major POS systems and inventory management platforms to automatically import your data.",
    },
    {
      question: "How accurate are the predictions?",
      answer: "Our AI typically achieves 85-95% accuracy in demand forecasting, depending on the industry and data quality. The system's accuracy improves over time as it learns from your specific business patterns.",
    },
    {
      question: "Can DataBridge integrate with my existing systems?",
      answer: "Yes, DataBridge integrates with major retail management systems, POS systems, and inventory platforms. We provide APIs and pre-built integrations for seamless data flow.",
    },
    {
      question: "How quickly can I see results?",
      answer: "Most retailers see meaningful improvements in inventory efficiency within the first month. The full benefits of staff optimization and automated planning typically materialize within 2-3 months of implementation.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 mt-7 md:mt-10">
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

      {/* Start Building Section */}
      <div className="mt-[2.2rem] md:mt-[3.2rem] -mb-4 text-center relative bg-[#ffffff] rounded-2xl">
        <h2 className="text-[2rem] font-medium text-gray-900 mb-1">Start building today</h2>
        <p className="text-[1.05rem] leading-relaxed text-[#4b5563] mb-4 max-w-2xl mx-auto">
          Create and customize your perfect dashboard with ease, tailored to your needs.
        </p>
        <div className="flex gap-3 justify-center">
          <Link 
            href="/contact" 
            className="inline-block bg-[#974eea] text-white px-3.5 py-2.5 rounded-lg font-normal text-[0.95rem] transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)]"
          >
            Get Started - It's Free
          </Link>
          <Link 
            href="/demo" 
            className="inline-block bg-white border border-gray-300 text-[#374151] px-3.5 py-2.5 rounded-lg font-normal text-[0.95rem] transition-all hover:bg-gray-50"
          >
            Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
} 