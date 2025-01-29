"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { businessTypes } from '@/utils/businessQueries';
import { UserData } from '@/types/user';

interface WelcomeFlowProps {
  onComplete: (completed: boolean) => void;
}

const businessTypeOptions = Object.values(businessTypes);

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const [step, setStep] = useState(1);
  const [locationError, setLocationError] = useState("");
  const { user } = useAuthContext();

  const [userData, setUserData] = useState<UserData>({
    location: "",
    businessName: "",
    website: "",
    createdAt: new Date(),
    email: user?.email || "",
    businessType: 'restaurant',
    dataSources: [],
    enabledDashboards: []
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  useEffect(() => {
    if (user?.email) {
      setUserData(prev => ({
        ...prev,
        email: user.email!
      }));
    }
  }, [user?.email]);

  const validateLocation = async (location: string) => {
    setLocationError("");
    
    if (!location || location.trim().length < 5) {
      setLocationError("Please enter a complete address (e.g., 123 Main St, New York, NY)");
      return false;
    }

    const hasStreetNumber = /^\d+/.test(location);
    if (!hasStreetNumber) {
      setLocationError("Address must start with a street number");
      return false;
    }

    const hasStreetName = /\d+\s+[a-zA-Z\s]+/.test(location);
    if (!hasStreetName) {
      setLocationError("Please include a street name");
      return false;
    }

    const cityStatePattern = /,\s*[a-zA-Z\s]+,\s*[A-Z]{2}(?:\s*\d{5})?$/;
    if (!cityStatePattern.test(location)) {
      setLocationError("Please include city and state (e.g., New York, NY)");
      return false;
    }

    const parts = location.split(',').map(part => part.trim());
    if (parts.length < 3) {
      setLocationError("Please enter a complete address with street, city, and state");
      return false;
    }

    const state = parts[parts.length - 1].split(' ')[0];
    if (!/^[A-Z]{2}$/.test(state)) {
      setLocationError("Please include a valid two-letter state code (e.g., NY)");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await validateLocation(userData.location);
      if (!isValid) return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleFinish = async () => {
    if (!user?.uid) {
      console.error('No user ID available');
      alert('User not properly authenticated. Please try again.');
      return;
    }

    try {
      // First create the user document
      console.log('Creating user...', { uid: user.uid, userData });
      
      const initResponse = await fetch('/api/users/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: user.uid,
          userData: {
            ...userData,
            email: user.email
          }
        })
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize user');
      }

      // Then create their default workspace
      const workspacePayload = {
        uid: user.uid,
        workspace: {
          name: userData.businessName ? `${userData.businessName} Workspace` : 'My Workspace',
          ownerEmail: user.email,
          ownerName: userData.businessName || ''
        }
      };

      console.log('Creating workspace with payload:', workspacePayload);

      const workspaceResponse = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workspacePayload)
      });

      const workspaceData = await workspaceResponse.json();
      console.log('Workspace response:', workspaceData);

      if (!workspaceResponse.ok) {
        throw new Error(workspaceData.error || 'Failed to create workspace');
      }

      onComplete(true);
    } catch (error) {
      console.error("Error during finish:", error);
      alert(error instanceof Error ? error.message : 'Setup failed. Please try again.');
    }
  };

  const handleExit = () => {
    if (user?.uid) {
      user.delete().catch(console.error);
    }
    onComplete(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-[600px] p-10 relative shadow-2xl">
        <button 
          onClick={handleExit}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">Let's Get Started!</h2>
          <p className="text-gray-600 mt-2">Please fill in your business details</p>
        </div>
        
        <div className="min-h-[180px] space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userData.location}
                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  locationError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } focus:ring-2 focus:border-transparent transition-all text-gray-700`}
                placeholder="e.g., 123 Main St, New York, NY"
                required
              />
              {locationError && (
                <div className="mt-2 text-red-500 text-sm flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{locationError}</span>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                value={userData.website || ''}
                onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
                placeholder="https://www.example.com"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={step === 3 ? handleFinish : handleNext}
            className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors"
          >
            {step === 3 ? 'Finish' : 'Next'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Step {step} of 3 {step === 1 ? "- Required" : "- Optional"}
          </p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 w-16 rounded-full ${s === step ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
