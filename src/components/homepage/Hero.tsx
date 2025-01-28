import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 py-20">
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">
            DataBridge
          </h1>
          <p className="text-2xl text-[#8b5cf6] font-medium">
            Smart predictions for smarter operations
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            Make confident decisions about staffing, inventory, and operations with real-time business insights. 
            Our platform analyzes social media, local trends, and customer activity to help you predict demand 
            and optimize your business performance.
          </p>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/contact" 
            className="inline-block bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get a Demo
          </Link>
          <Link 
            href="/pricing" 
            className="inline-block border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/10 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="relative rounded-lg overflow-hidden w-full max-w-2xl shadow-xl">
          <Image 
            src="/homepage/image1.png"
            alt="DataBridge Dashboard"
            width={800}
            height={1000}
            className="w-full h-auto object-contain rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
} 