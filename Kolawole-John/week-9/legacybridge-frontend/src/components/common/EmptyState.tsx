import { FileQuestion, Search, XCircle } from 'lucide-react';

/**
 * Empty State Component
 * Shows friendly message when no data is available
 */

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'notFound' | 'search' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  title,
  description,
  icon = 'notFound',
  action,
}: EmptyStateProps) {
  const icons = {
    notFound: FileQuestion,
    search: Search,
    error: XCircle,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}