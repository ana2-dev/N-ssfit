import { useState, useEffect } from 'react';
import { Plus, Trash2, TruckIcon } from 'lucide-react';

interface Delivery {
  id: string;
  supplier: string;
  product: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'pending' | 'completed';
}

export function DeliveryManager() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    quantity: 0,
    unit: 'kg',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const stored = localStorage.getItem('nessfit_deliveries');
    if (stored) {
      setDeliveries(JSON.parse(stored));
    }
  }, []);

  const handleAdd = () => {
    const newDelivery: Delivery = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending'
    };

    const updated = [...deliveries, newDelivery];
    setDeliveries(updated);
    localStorage.setItem('nessfit_deliveries', JSON.stringify(updated));

    const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
    history.push({
      id: Date.now().toString(),
      type: 'delivery_added',
      description: `Entrega adicionada: ${formData.product} - ${formData.quantity} ${formData.unit}`,
      date: new Date().toISOString()
    });
    localStorage.setItem('nessfit_history', JSON.stringify(history));

    setFormData({ supplier: '', product: '', quantity: 0, unit: 'kg', date: new Date().toISOString().split('T')[0] });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const delivery = deliveries.find(d => d.id === id);
    const updated = deliveries.filter(d => d.id !== id);
    setDeliveries(updated);
    localStorage.setItem('nessfit_deliveries', JSON.stringify(updated));

    if (delivery) {
      const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
      history.push({
        id: Date.now().toString(),
        type: 'delivery_deleted',
        description: `Entrega excluída: ${delivery.product} - ${delivery.quantity} ${delivery.unit}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('nessfit_history', JSON.stringify(history));
    }
  };

  const handleComplete = (id: string) => {
    const updated = deliveries.map(d =>
      d.id === id ? { ...d, status: 'completed' as const } : d
    );
    setDeliveries(updated);
    localStorage.setItem('nessfit_deliveries', JSON.stringify(updated));

    const delivery = deliveries.find(d => d.id === id);
    if (delivery) {
      const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
      history.push({
        id: Date.now().toString(),
        type: 'delivery_completed',
        description: `Entrega recebida: ${delivery.product} - ${delivery.quantity} ${delivery.unit}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('nessfit_history', JSON.stringify(history));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Entregas</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#FF8C42] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e67935] transition-colors shadow-lg"
        >
          <Plus size={20} />
          Nova Entrega
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF8C42]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Adicionar Entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none"
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none"
                placeholder="Nome do produto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="un">un</option>
                <option value="l">l</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Prevista</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAdd}
              className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg font-semibold hover:bg-[#45a049] transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Entregas Pendentes</h3>
        {deliveries.filter(d => d.status === 'pending').map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <TruckIcon className="text-blue-500 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{delivery.product}</h4>
                  <p className="text-gray-600 mt-1">Fornecedor: {delivery.supplier}</p>
                  <p className="text-gray-600">Quantidade: {delivery.quantity} {delivery.unit}</p>
                  <p className="text-gray-600">Data prevista: {new Date(delivery.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleComplete(delivery.id)}
                  className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#45a049] transition-colors"
                >
                  Recebido
                </button>
                <button
                  onClick={() => handleDelete(delivery.id)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {deliveries.filter(d => d.status === 'pending').length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhuma entrega pendente</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Entregas Concluídas</h3>
        {deliveries.filter(d => d.status === 'completed').map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#4CAF50] opacity-75">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <TruckIcon className="text-[#4CAF50] mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{delivery.product}</h4>
                  <p className="text-gray-600 mt-1">Fornecedor: {delivery.supplier}</p>
                  <p className="text-gray-600">Quantidade: {delivery.quantity} {delivery.unit}</p>
                  <p className="text-gray-600">Data: {new Date(delivery.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(delivery.id)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {deliveries.filter(d => d.status === 'completed').length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhuma entrega concluída</p>
        )}
      </div>
    </div>
  );
}
