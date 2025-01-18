"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { useAuthContext } from "@/contexts/AuthContext";

interface WelcomeFlowProps {
  onComplete: (completed: boolean) => void;
}

interface UserData {
  location: string;
  businessName?: string;
  website?: string;
  googleMaps?: string;
  yelpUrl?: string;
  createdAt: Date;
  email: string;
}

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const { user } = useAuthContext();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    location: "",
    businessName: "",
    website: "",
    googleMaps: "",
    yelpUrl: "",
    createdAt: new Date(),
    email: user?.email || "",
  });

  // Add effect to handle body scroll lock
  useEffect(() => {
    // Lock scroll when component mounts
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to remove lock when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []); // Empty dependency array means this runs once on mount

  // Add effect to set email when user is available
  useEffect(() => {
    if (user?.email) {
      setUserData(prev => ({
        ...prev,
        email: user.email!
      }));
    }
  }, [user?.email]);

  const validateLocation = async (location: string) => {
    setIsValidating(true);
    setLocationError("");
    
    // Check for minimum length
    if (!location || location.trim().length < 5) {
      setLocationError("Please enter a complete address (e.g., 123 Main St, New York, NY)");
      setIsValidating(false);
      return false;
    }

    // Check for street number
    const hasStreetNumber = /^\d+/.test(location);
    if (!hasStreetNumber) {
      setLocationError("Address must start with a street number");
      setIsValidating(false);
      return false;
    }

    // Check for street name
    const hasStreetName = /\d+\s+[a-zA-Z\s]+/.test(location);
    if (!hasStreetName) {
      setLocationError("Please include a street name");
      setIsValidating(false);
      return false;
    }

    // Check for city and state
    // Matches patterns like: "city, ST" or "city, state"
    const cityStatePattern = /,\s*[a-zA-Z\s]+,\s*[a-zA-Z]{2}(?:\s*\d{5})?$/i;
    if (!cityStatePattern.test(location)) {
      setLocationError("Please include city and state (e.g., New York, NY)");
      setIsValidating(false);
      return false;
    }

    // Split the address to verify city and state are present
    const parts = location.split(',').map(part => part.trim());
    if (parts.length < 3) { // Street, City, State (with optional ZIP)
      setLocationError("Please enter a complete address with street, city, and state");
      setIsValidating(false);
      return false;
    }

    // Verify state format (2 letters)
    const state = parts[parts.length - 1].split(' ')[0];
    if (!/^[A-Z]{2}$/i.test(state)) {
      setLocationError("Please include a valid two-letter state code (e.g., NY)");
      setIsValidating(false);
      return false;
    }

    setIsValidating(false);
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await validateLocation(userData.location);
      if (!isValid) return;
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Save user data only on completion
      try {
        if (!user?.uid) {
          throw new Error('No authenticated user found');
        }

        if (!user.email) {
          throw new Error('No email found for user');
        }

        const userDocData = {
          ...userData,
          email: user.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Create user document
        await setDoc(doc(db, "users", user.uid), userDocData);
        
        // Create empty reports collection with initial pending status
        const reportsRef = collection(db, "users", user.uid, "reports");
        await setDoc(doc(reportsRef, "initial"), {
          createdAt: new Date(),
          data: {},
          status: "pending"
        });

        // Trigger report generation via FastAPI
        try {
          const response = await fetch('/api/generate-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.uid,
              email: user.email,
              location: userData.location,
              businessName: userData.businessName,
              website: userData.website,
              googleMaps: userData.googleMaps,
              yelpUrl: userData.yelpUrl
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to trigger report generation');
          }

          console.log('Report generation triggered successfully');
        } catch (error) {
          console.error('Error triggering report generation:', error);
          // Note: We don't throw here as we still want to complete the signup process
        }

        onComplete(true);
      } catch (error) {
        console.error("Error saving user data:", error);
        alert('There was an error saving your information. Please try again.');
      }
    }
  };

  const handleExit = () => {
    // Delete the user account if it exists since setup wasn't completed
    if (user?.uid) {
      user.delete().catch(console.error);
    }
    onComplete(false); // Pass false to indicate incomplete setup
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-[600px] p-10 relative shadow-2xl">
        <button 
          onClick={handleExit}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Let's Get Started!</h2>
          <p className="text-gray-500 mt-2">Please fill in your business details</p>
        </div>
        
        <div className="min-h-[180px]">
          {step === 1 && (
            <div>
              <label className="block">
                <span className="text-gray-700 text-sm font-medium block mb-2">
                  Location <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    locationError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:ring-2 focus:border-transparent transition-all text-gray-900`}
                  placeholder="e.g., 123 Main St, New York, NY"
                  required
                />
              </label>
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
              <label className="block">
                <span className="text-gray-700 text-sm font-medium mb-2 block">Business Name</span>
                <input
                  type="text"
                  value={userData.businessName || ''}
                  onChange={(e) => setUserData({ ...userData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter your business name"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block">
                <span className="text-gray-700 text-sm font-medium mb-2 block">Website</span>
                <input
                  type="url"
                  value={userData.website || ''}
                  onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="https://www.example.com"
                />
              </label>
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="block">
                <span className="text-gray-700 text-sm font-medium mb-2 block">Google Maps Link</span>
                <input
                  type="url"
                  value={userData.googleMaps || ''}
                  onChange={(e) => setUserData({ ...userData, googleMaps: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="https://maps.google.com/..."
                />
              </label>
            </div>
          )}

          {step === 5 && (
            <div>
              <label className="block">
                <span className="text-gray-700 text-sm font-medium mb-2 block">Yelp Link</span>
                <input
                  type="url"
                  value={userData.yelpUrl || ''}
                  onChange={(e) => setUserData({ ...userData, yelpUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="https://www.yelp.com/..."
                />
              </label>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              onClick={async () => {
                if (step === 1) {
                  if (userData.location) {
                    const isValid = await validateLocation(userData.location);
                    if (isValid) setStep(step + 1);
                  }
                } else if (step === 5) {
                  handleNext();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={step === 1 && !userData.location}
              className={`px-6 py-2 rounded-lg font-medium transition-colors
                ${step === 1 && !userData.location 
                  ? 'bg-blue-300 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {step === 5 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Step {step} of 5 {step === 1 ? "- Required" : "- Optional"}
          </p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
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
