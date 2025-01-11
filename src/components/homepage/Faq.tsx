"use client";
import { useState } from 'react';

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
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {faqs.map((item, index) => (
        <div key={index} className="w-full">
          <button
            onClick={() => toggleFaq(index)}
            className="w-full bg-white bg-opacity-5 p-4 rounded-lg text-left hover:bg-opacity-10 transition-all flex justify-between items-center"
          >
            <span>{item.question}</span>
            <span className="text-xl">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-white bg-opacity-5 mt-1 rounded-lg">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 