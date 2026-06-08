import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        <div className={`p-6 border-b-4 ${variant === 'danger' ? 'border-red-500' : 'border-yellow-500'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <AlertTriangle className={variant === 'danger' ? 'text-red-600' : 'text-yellow-600'} size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 leading-relaxed text-lg">{message}</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-colors shadow-lg ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#FF8C42] hover:bg-[#e67935]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
