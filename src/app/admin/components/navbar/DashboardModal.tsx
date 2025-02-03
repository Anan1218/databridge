import { MdClose, MdCalendarToday, MdShowChart, MdTextFields } from "react-icons/md";
import { DashboardType } from '@/types/workspace';
import Link from 'next/link';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDashboard: (type: DashboardType) => void;
}

const dashboardTypes = [
  {
    id: 'leads_table' as DashboardType,
    name: 'Leads Table',
    description: 'View and manage your leads in a customizable table format',
    icon: <MdTextFields className="w-6 h-6 text-purple-600" />,
    disabled: false
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
              Add New Leads Collection
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
                  if (!type.disabled) {
                    onCreateDashboard(type.id);
                    onClose();
                  }
                }}
                className={`w-full p-4 rounded-lg border transition-all duration-200 group relative
                  ${type.disabled 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                    : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'}`}
                disabled={type.disabled}
              >
                {type.disabled && (
                  <Link href="/admin/help" className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors">
                    Contact Us
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${type.disabled 
                      ? 'bg-gray-100' 
                      : 'bg-purple-50 group-hover:bg-white'}`}>
                    {type.icon}
                  </div>
                  <div className="text-left">
                    <h3 className={`font-semibold ${
                      type.disabled ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {type.name}
                    </h3>
                    <p className={`text-sm ${
                      type.disabled ? 'text-gray-400' : 'text-gray-500'
                    }`}>
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