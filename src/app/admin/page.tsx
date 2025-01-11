"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { nanoid } from 'nanoid';
import PassesTab from './components/tabs/PassesTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import OrdersTab from './components/tabs/OrdersTab';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface Store {
  id: string;
  storeId: string;
  userId: string;
  name: string;
  storeUrl: string;
  createdAt: any; // Firebase Timestamp
  active: boolean;
  imageUrl: string;
  price: number;
  maxPasses: number;
}

interface Pass {
  id: string;
  createdAt: any; // Firebase Timestamp
  quantity: number;
  storeId: string;
  passId: string;
  active: boolean;
  usedAt: any | null;
  expiresAt: any;
  paymentIntentId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  productType: 'LineSkip' | 'Cover' | 'Menu' | string;
  passName: string;
  serviceFee: number;
  tipAmount: number;
  totalAmount: number;
}

interface StoreStats {
  [key: string]: {
    dailyPasses: {
      remainingPasses: number;
      date: string;
    } | null;
    dailyProfit: number;
    recentPasses: Pass[];
  }
}

type ActiveTab = 'ANALYTICS' | 'PASSES' | 'ORDERS';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    price: 20,
    maxPasses: 25,
    image: null as File | null,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    storeId: string | null;
  }>({
    isOpen: false,
    storeId: null,
  });

  const [storeStats, setStoreStats] = useState<StoreStats>({});
  const [activeTab, setActiveTab] = useState<ActiveTab>('PASSES');
  const [passes, setPasses] = useState<Pass[]>([]);

  // Function to load existing stores
  const loadStores = useCallback(async () => {
    try {
      setLoading(true);
      const storesRef = collection(db, "stores");
      const q = query(
        storesRef,
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const storesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Store[];

      setStores(storesData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading stores:', err);
      setError('Failed to load stores');
      setLoading(false);
    }
  }, [user?.uid]);

  // Load stores on mount
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }

    if (user) {
      loadStores();
    }
  }, [user, loading, router, loadStores]);

  // Load store stats
  useEffect(() => {
    const loadStoreStats = async () => {
      if (!stores.length) return;

      const stats: StoreStats = {};

      for (const store of stores) {
        try {
          // Get today's passes
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const passesRef = collection(db, "passes");
          const passesQuery = query(
            passesRef,
            where("storeId", "==", store.storeId),
            where("createdAt", ">=", today),
            where("active", "==", true)
          );

          const passesSnapshot = await getDocs(passesQuery);
          const activePasses = passesSnapshot.docs.length;

          // Get recent passes
          const recentPassesQuery = query(
            passesRef,
            where("storeId", "==", store.storeId),
            orderBy("createdAt", "desc"),
            limit(5)
          );

          const recentPassesSnapshot = await getDocs(recentPassesQuery);
          const recentPasses = recentPassesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Pass[];

          // Calculate daily profit
          const dailyProfit = recentPasses
            .filter(pass => {
              const passDate = pass.createdAt.toDate();
              return passDate >= today;
            })
            .reduce((total, pass) => total + (pass.quantity * store.price), 0);

          stats[store.storeId] = {
            dailyPasses: {
              remainingPasses: store.maxPasses - activePasses,
              date: today.toISOString(),
            },
            dailyProfit,
            recentPasses,
          };
        } catch (error) {
          console.error(`Error loading stats for store ${store.storeId}:`, error);
        }
      }

      setStoreStats(stats);
    };

    loadStoreStats();
  }, [stores]);

  // Load passes
  useEffect(() => {
    const loadPasses = async () => {
      if (!stores.length) return;

      try {
        const passesRef = collection(db, "passes");
        const passesQuery = query(
          passesRef,
          where("storeId", "in", stores.map(store => store.storeId)),
          orderBy("createdAt", "desc"),
          limit(100)
        );

        const passesSnapshot = await getDocs(passesQuery);
        const passesData = passesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Pass[];

        setPasses(passesData);
      } catch (error) {
        console.error('Error loading passes:', error);
      }
    };

    loadPasses();
  }, [stores]);

  const handleDeleteClick = (storeId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      storeId,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.storeId) return;

    try {
      await deleteDoc(doc(db, "stores", deleteConfirmation.storeId));
      setStores(stores.filter((store) => store.id !== deleteConfirmation.storeId));
      setDeleteConfirmation({ isOpen: false, storeId: null });
    } catch (err) {
      console.error('Error deleting store:', err);
      setError('Failed to delete store');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    if (!user?.uid) {
      setError("You must be logged in to create a pass");
      setIsGenerating(false);
      return;
    }

    try {
      // Generate a unique store ID
      const storeId = nanoid();

      let imageUrl = '';
      if (newStore.image) {
        const storageRef = ref(storage, `store-images/${storeId}`);
        const uploadResult = await uploadBytes(storageRef, newStore.image);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // Create the store document
      const storeData = {
        storeId,
        userId: user.uid,
        name: newStore.name,
        price: newStore.price,
        maxPasses: newStore.maxPasses,
        storeUrl: `${BASE_URL}/store/${storeId}`,
        createdAt: new Date(),
        active: true,
        imageUrl,
      };

      const docRef = await addDoc(collection(db, "stores"), storeData);

      // Add the new store to the local state
      setStores([
        {
          id: docRef.id,
          ...storeData,
        },
        ...stores,
      ]);

      // Reset form
      setNewStore({
        name: "",
        price: 20,
        maxPasses: 25,
        image: null,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating store:', err);
      setError('Failed to create store');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading || authLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Active Passes:</span>
            <span className="font-bold">{stores.reduce((acc, store) => 
              acc + (storeStats[store.storeId]?.dailyPasses?.remainingPasses || 0), 0)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary bg-indigo-600"
          >
            Add Pass
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex">
          {[
            { id: 'ANALYTICS', label: 'Analytics' },
            { id: 'PASSES', label: 'Passes' },
            { id: 'ORDERS', label: 'Orders' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'PASSES' && (
          <PassesTab 
            stores={stores} 
            storeStats={storeStats} 
            onDeleteClick={handleDeleteClick} 
          />
        )}
        
        {activeTab === 'ANALYTICS' && (
          <AnalyticsTab 
            stores={stores} 
            storeStats={storeStats}
          />
        )}
        
        {activeTab === 'ORDERS' && (
          <OrdersTab 
            stores={stores}
            passes={passes}
          />
        )}
      </div>

      {/* Add Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Pass</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={newStore.name}
                    onChange={(e) =>
                      setNewStore({ ...newStore, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price per Pass ($)
                  </label>
                  <input
                    type="number"
                    value={newStore.price}
                    onChange={(e) =>
                      setNewStore({
                        ...newStore,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Passes per Night
                  </label>
                  <input
                    type="number"
                    value={newStore.maxPasses}
                    onChange={(e) =>
                      setNewStore({
                        ...newStore,
                        maxPasses: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Venue Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewStore({
                        ...newStore,
                        image: e.target.files ? e.target.files[0] : null,
                      })
                    }
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isGenerating ? "Creating..." : "Create Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this store? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, storeId: null })
                }
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-primary bg-red-500 hover:bg-red-600"
              >
                Delete Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
