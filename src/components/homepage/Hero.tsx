import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 py-20">
      <div className="flex-1 space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">
            DataBridge
          </h1>
          <p className="text-2xl text-indigo-400 font-medium">
            Smart predictions for smarter operations
          </p>
          <p className="text-xl text-gray-300 leading-relaxed">
            Make confident decisions about staffing, inventory, and operations with real-time business insights. 
            Our platform analyzes social media, local trends, and customer activity to help you predict demand 
            and optimize your business performance.
          </p>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/contact" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Get a Demo
          </Link>
          <Link 
            href="/pricing" 
            className="inline-block border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10 px-8 py-3 rounded-lg font-medium"
          >
            View Pricing
          </Link>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="relative rounded-lg overflow-hidden w-full max-w-2xl">
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