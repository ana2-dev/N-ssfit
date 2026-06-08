import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Alert({ type, message, onClose, action }: AlertProps) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: <CheckCircle className="text-green-600" size={24} />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: <AlertCircle className="text-red-600" size={24} />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: <Info className="text-blue-600" size={24} />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: <AlertCircle className="text-yellow-600" size={24} />
    }
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded-r-lg flex items-center justify-between shadow-md animate-slideDown`}>
      <div className="flex items-center gap-3 flex-1">
        {style.icon}
        <p className={`${style.text} font-medium flex-1`}>{message}</p>
      </div>
      <div className="flex items-center gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className={`${style.text} font-semibold hover:underline transition-all`}
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity`}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
