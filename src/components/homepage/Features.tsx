import { HiChartBar } from "react-icons/hi2"
import { HiClock } from "react-icons/hi2"
import { HiUserGroup } from "react-icons/hi2"
import { HiCog } from "react-icons/hi2"

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <HiChartBar className="w-8 h-8 text-indigo-400" />,
    title: 'Demand Forecasting',
    description: 'Leverage AI to predict customer demand patterns, optimize inventory levels, and reduce stockouts and overstock situations.',
  },
  {
    icon: <HiClock className="w-8 h-8 text-indigo-400" />,
    title: 'Staff Optimization',
    description: 'Schedule the right number of staff at the right time based on predicted customer traffic and sales volumes.',
  },
  {
    icon: <HiUserGroup className="w-8 h-8 text-indigo-400" />,
    title: 'Customer Insights',
    description: 'Understand customer behavior patterns and preferences to make data-driven merchandising and marketing decisions.',
  },
  {
    icon: <HiCog className="w-8 h-8 text-indigo-400" />,
    title: 'Automated Planning',
    description: 'Automate inventory planning and staff scheduling with AI-powered recommendations tailored to your business.',
  },
]

export function Features() {
  return (
    <section className="relative py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Retail Intelligence</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Transform your retail operations with DataBridge's advanced demand forecasting and optimization tools.</p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-indigo-500/10 rounded-lg p-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
