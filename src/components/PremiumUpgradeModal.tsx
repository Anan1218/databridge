interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export default function PremiumUpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  title = "Maximum Sources Reached",
  description = "You have reached the maximum number of spaces available in your plan.",
}: PremiumUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
} 