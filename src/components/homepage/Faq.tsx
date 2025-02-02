"use client";
import { useState } from 'react';

interface FaqProps {
  openModal: () => void;
}

export function Faq({ openModal }: FaqProps) {
  const faqs = [
    {
      question: "How does the AI data extraction work?",
      answer: "Our AI system uses advanced natural language processing to extract key information from documents, websites, and databases. It can handle structured and unstructured data with high accuracy.",
    },
    {
      question: "What types of data sources can I connect?",
      answer: "You can connect to 550+ data sources including financial filings, market research databases, CRM systems, and public web sources. Our system supports APIs, web scraping, and direct integrations.",
    },
    {
      question: "How accurate is the data analysis?",
      answer: "Our AI achieves 95%+ accuracy in data extraction and analysis. The system continuously learns and improves through machine learning models trained on millions of data points.",
    },
    {
      question: "Can I automate workflows with the platform?",
      answer: "Yes, you can create automated workflows for data collection, analysis, and reporting. Set up triggers and actions to streamline your data processes.",
    },
    {
      question: "How quickly can I get started?",
      answer: "Most users can set up their first data pipeline within 15 minutes. Our intuitive interface and pre-built templates make it easy to start extracting and analyzing data immediately.",
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

      {/* Start Building Section */}
      <div className="mt-[3.2rem] -mb-4 text-center relative bg-[#ffffff] rounded-2xl">
        <h2 className="text-[2rem] font-medium text-gray-900 mb-1">Start building today</h2>
        <p className="text-[1.05rem] leading-relaxed text-[#4b5563] mb-4 max-w-2xl mx-auto">
          Create and customize your perfect dashboard with ease, tailored to your needs.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={openModal}
            className="inline-block bg-[#974eea] text-white px-3.5 py-2.5 rounded-lg font-normal text-[0.95rem] transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_45px_12px_rgba(167,139,250,0.35)]"
          >
            Get Started
          </button>
          <button 
            onClick={openModal}
            className="inline-block bg-white border border-gray-300 text-[#374151] px-3.5 py-2.5 rounded-lg font-normal text-[0.95rem] transition-all hover:bg-gray-50"
          >
            Live Demo
          </button>
        </div>
      </div>
    </div>
  );
} 