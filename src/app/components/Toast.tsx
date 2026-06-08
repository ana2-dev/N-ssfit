import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-[#4CAF50]',
      icon: <CheckCircle size={20} />
    },
    error: {
      bg: 'bg-red-600',
      icon: <AlertCircle size={20} />
    },
    info: {
      bg: 'bg-blue-600',
      icon: <Info size={20} />
    }
  };

  const style = styles[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideDown">
      <div className={`${style.bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        {style.icon}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:opacity-70 transition-opacity"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
