import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 py-20">
      <div className="flex-1 space-y-6">
        <h1 className="text-6xl font-bold">
          DataBridge
        </h1>
        <p className="text-xl text-gray-300">
          Simplify complex retail demand challenges using AI-powered forecasting.{' '}
          <span className="text-indigo-400">Reduce inventory costs</span> and{' '}
          <span className="text-indigo-400">optimize staffing</span> with data-driven predictions.
          Join retailers saving over $100,000 annually in operational costs.
        </p>
        <Link 
          href="/signin" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          Get Started
        </Link>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="relative rounded-lg overflow-hidden w-full max-w-2xl">
          <Image 
            src="/homepage/image1.png"
            alt="Demo"
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