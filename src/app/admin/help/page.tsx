'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdEmail, MdHelp, MdArticle, MdChat } from 'react-icons/md';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  articles: {
    title: string;
    description: string;
  }[];
}

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of setting up and using DataBridge',
      icon: <MdHelp className="w-6 h-6 text-purple-600" />,
      articles: [
        {
          title: 'Setting up your first workspace',
          description: 'Learn how to create and configure your workspace'
        },
        {
          title: 'Connecting data sources',
          description: 'Guide to integrating your first data source'
        },
        {
          title: 'Understanding the dashboard',
          description: 'Overview of the main dashboard features'
        }
      ]
    },
    {
      id: 'data-sources',
      title: 'Data Sources',
      description: 'Everything about managing your data connections',
      icon: <MdArticle className="w-6 h-6 text-purple-600" />,
      articles: [
        {
          title: 'Available data sources',
          description: 'Overview of all supported data integrations'
        },
        {
          title: 'Custom data integration',
          description: 'How to set up custom data sources'
        },
        {
          title: 'Troubleshooting connections',
          description: 'Common issues and their solutions'
        }
      ]
    }
  ];

  const selectedCategoryData = helpCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-4">Help Center</h1>
        {/* <p className="text-gray-600">
          Find answers to common questions or reach out to our support team.
        </p> */}
      </div>

      {/* Contact Support Card */}
      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <MdEmail className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Need direct assistance?</h2>
            <p className="text-gray-600 mb-4">
              Our support team typically responds within 24 hours on business days.
            </p>
            <div className="flex gap-4">
              <a 
                href="mailto:support@trydatabridge.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MdEmail className="w-5 h-5" />
                Contact Support
              </a>
              {/* <button 
                className="inline-flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <MdChat className="w-5 h-5" />
                Start Chat
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      {/* <div className="grid md:grid-cols-2 gap-6">
        {helpCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`text-left p-6 rounded-lg border transition-all ${
              selectedCategory === category.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                {category.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-1">
                  {category.title}
                </h3>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div> */}

      {/* Selected Category Articles */}
      {/* {selectedCategoryData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            {selectedCategoryData.title} Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {selectedCategoryData.articles.map((article, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 transition-all"
              >
                <h3 className="text-lg font-semibold text-black mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {article.description}
                </p>
                <button className="text-purple-600 font-medium hover:text-purple-700">
                  Read more →
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}