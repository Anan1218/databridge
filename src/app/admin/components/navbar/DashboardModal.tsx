import { MdClose, MdCalendarToday, MdShowChart, MdTextFields } from "react-icons/md";
import { DashboardType } from '@/types/workspace';
import { nanoid } from 'nanoid';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDashboard: (type: DashboardType) => void;
}

const dashboardTypes = [
  {
    id: 'calendar' as DashboardType,
    name: 'Calendar View',
    description: 'Add an event calendar to track and display upcoming events',
    icon: <MdCalendarToday className="w-6 h-6 text-purple-600" />,
  },
  {
    id: 'graph' as DashboardType,
    name: 'Data Graph',
    description: 'Visualize your data with customizable charts and graphs',
    icon: <MdShowChart className="w-6 h-6 text-purple-600" />,
  },
  {
    id: 'text' as DashboardType,
    name: 'Text Component',
    description: 'Add formatted text, lists, or custom content',
    icon: <MdTextFields className="w-6 h-6 text-purple-600" />,
  }
];

export default function DashboardModal({
  isOpen,
  onClose,
  onCreateDashboard,
}: DashboardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative mx-auto max-w-md rounded-xl bg-white p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">
              Add New Dashboard Component
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Select the type of component you want to add to your dashboard:
          </p>

          <div className="space-y-4">
            {dashboardTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  onCreateDashboard(type.id);
                  onClose();
                }}
                className="w-full p-4 rounded-lg border border-gray-200 hover:border-purple-500 
                          hover:bg-purple-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 bg-purple-50 group-hover:bg-white 
                                w-12 h-12 rounded-lg flex items-center justify-center">
                    {type.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}