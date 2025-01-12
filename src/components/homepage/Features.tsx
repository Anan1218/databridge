import { 
  HiNewspaper, 
  HiStar, 
  HiMegaphone,
  HiChatBubbleBottomCenterText,
  HiEnvelope,
  HiCalendar
} from "react-icons/hi2"

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <HiNewspaper className="w-8 h-8 text-indigo-400" />,
    title: 'Local News & Social Media Monitoring',
    description: 'Automatically collect and analyze mentions of your business from local news sources and social media platforms.',
  },
  {
    icon: <HiStar className="w-8 h-8 text-indigo-400" />,
    title: 'Reputation Monitoring',
    description: 'Track and analyze your business reputation across review sites and social platforms to maintain a positive brand image.',
  },
  {
    icon: <HiMegaphone className="w-8 h-8 text-indigo-400" />,
    title: 'Brand Mention Tracking',
    description: 'Stay informed about every mention of your brand online with our comprehensive web scraping technology.',
  },
  {
    icon: <HiChatBubbleBottomCenterText className="w-8 h-8 text-indigo-400" />,
    title: 'AI-Powered Insights',
    description: 'Get concise, GPT-powered summaries of trends and insights displayed directly on your dashboard.',
  },
  {
    icon: <HiEnvelope className="w-8 h-8 text-indigo-400" />,
    title: 'Weekly Email Reports',
    description: 'Receive detailed weekly email reports summarizing key metrics and insights about your business.',
  },
  {
    icon: <HiCalendar className="w-8 h-8 text-indigo-400" />,
    title: 'Google Calendar Integration',
    description: 'Seamlessly integrate business insights with your Google Calendar for better operational planning.',
  },
]

export function Features() {
  return (
    <section className="relative py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Your Business Command Center</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Monitor, analyze, and act on real-time business intelligence with our comprehensive suite of tools.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
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
