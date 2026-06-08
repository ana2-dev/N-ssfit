import { useState, useEffect } from 'react';
import { Clock, Package, TruckIcon, Trash2, RotateCcw } from 'lucide-react';
import { ClearHistoryDialog } from './ClearHistoryDialog';
import { Toast } from './Toast';

interface HistoryEntry {
  id: string;
  type: string;
  description: string;
  date: string;
}

export function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('nessfit_history');
    if (stored) {
      setHistory(JSON.parse(stored).reverse());
    } else {
      setHistory([]);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('product')) return <Package className="text-[#4CAF50]" size={24} />;
    if (type.includes('delivery')) return <TruckIcon className="text-blue-500" size={24} />;
    return <Clock className="text-gray-500" size={24} />;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      product_added: 'Produto Adicionado',
      product_updated: 'Produto Atualizado',
      product_deleted: 'Produto Excluído',
      delivery_added: 'Entrega Adicionada',
      delivery_completed: 'Entrega Recebida',
      delivery_deleted: 'Entrega Excluída'
    };
    return labels[type] || type;
  };

  const handleClearHistory = () => {
    localStorage.removeItem('nessfit_history');
    setHistory([]);
    setShowToast(true);
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(h => h.type.includes(filter));

  return (
    <>
      <ClearHistoryDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearHistory}
      />

      {showToast && (
        <Toast
          message="Histórico limpo com sucesso"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Histórico de Movimentações</h2>
          <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-[#FF8C42] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'product' ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setFilter('delivery')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'delivery' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Entregas
          </button>
        </div>
      </div>

      {/* Botão Limpar Histórico - Só aparece se houver histórico */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Gerenciar Histórico</h3>
              <p className="text-sm text-gray-600">
                {history.length} registro{history.length !== 1 ? 's' : ''} de movimentação{history.length !== 1 ? 'ões' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowClearDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <Trash2 size={18} />
              Limpar Histórico
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredHistory.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#FF8C42]">
            <div className="flex items-start gap-4">
              {getIcon(entry.type)}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{getTypeLabel(entry.type)}</h4>
                    <p className="text-gray-600 mt-1">{entry.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-t-4 border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {history.length === 0 ? 'Nenhum histórico' : 'Nenhuma movimentação encontrada'}
            </h3>
            <p className="text-gray-600 mb-6">
              {history.length === 0
                ? 'As movimentações de produtos e entregas aparecerão aqui.'
                : 'Tente ajustar os filtros para ver mais resultados.'}
            </p>
            {history.length === 0 && (
              <p className="text-sm text-gray-500">
                Comece adicionando produtos ou entregas para gerar seu histórico.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
