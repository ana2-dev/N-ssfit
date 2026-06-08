import { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ClearHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearHistoryDialog({ isOpen, onClose, onConfirm }: ClearHistoryDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
      setIsValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsValid(confirmText.trim().toUpperCase() === 'EXCLUIR');
  }, [confirmText]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      onClose();
      setConfirmText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
        <div className="p-6 border-b-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Limpar Histórico</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-800 font-medium leading-relaxed">
              Tem certeza de que deseja apagar todo o seu histórico? Esta ação é irreversível e todos os registros serão deletados permanentemente.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Para confirmar, digite <span className="text-red-600 font-bold">EXCLUIR</span> no campo abaixo:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                confirmText.length > 0 && !isValid
                  ? 'border-red-300 bg-red-50 focus:border-red-500'
                  : isValid
                  ? 'border-green-500 bg-green-50 focus:border-green-600'
                  : 'border-gray-300 focus:border-gray-400'
              }`}
              placeholder="Digite EXCLUIR para confirmar"
              autoFocus
            />
            {confirmText.length > 0 && !isValid && (
              <p className="text-sm text-red-600">
                Digite exatamente "EXCLUIR" (maiúsculas)
              </p>
            )}
            {isValid && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Trash2 size={14} />
                Confirmação válida
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os registros de movimentações, entregas e alterações serão permanentemente removidos.
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isValid
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Trash2 size={20} />
            {isValid ? 'Confirmar Exclusão' : 'Digite EXCLUIR'}
          </button>
        </div>
      </div>
    </div>
  );
}
