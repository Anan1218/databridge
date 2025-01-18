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
import NewsSummary from './components/tabs/NewsSummary';

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

type ActiveTab = 'ANALYTICS' | 'PASSES' | 'ORDERS' | 'NEWS';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <NewsSummary />
      </div>
    </div>
  );
}
