'use client';

import { useState } from 'react';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    targetCustomer: '',
    averageContractValue: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/email/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to send demo request');
      }
  
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending demo request:', error);
      alert('There was an error submitting your demo request. Please try again later.');
    }
    
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p>Your demo request has been sent. We'll be in touch shortly!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Book Demo</h1>
      <p className="mb-8">
        Learn how ProspectAI can help your business grow.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="first.last@company.com"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company Name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="companyWebsite"
            className="block text-sm font-medium text-gray-700"
          >
            Company Website
          </label>
          <input
            type="url"
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://www.yourcompany.com"
            pattern="(https?:\/\/)?(www\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}"
            title="Please enter a valid URL. For example, https://www.yourcompany.com"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="companyDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Company Description
          </label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            placeholder="Your description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="targetCustomer"
            className="block text-sm font-medium text-gray-700"
          >
            Target Customer
          </label>
          <textarea
            id="targetCustomer"
            name="targetCustomer"
            value={formData.targetCustomer}
            onChange={handleChange}
            placeholder="B2B marketing agencies looking to enhance their client acquisition strategies through data-driven insights."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="averageContractValue"
            className="block text-sm font-medium text-gray-700"
          >
            Average Contract Value
          </label>
          <input
            type="text"
            id="averageContractValue"
            name="averageContractValue"
            value={formData.averageContractValue}
            onChange={handleChange}
            placeholder="$1,000 per year"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#974eea] text-white px-4 py-2 rounded-lg hover:bg-[#8b5cf6] transition-colors"
          >
            {isSubmitting ? 'Requesting...' : 'Request Demo'}
          </button>
        </div>
      </form>
    </div>
  );
} 