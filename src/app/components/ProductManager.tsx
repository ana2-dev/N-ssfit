import { supabase } from './caminho/para/seu/arquivo/supabaseClient'
import { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Edit2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  value: number;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    minQuantity: 0,
    value: 0
  });

  useEffect(() => {
  const fetchProdutos = async () => {
    const { data, error } = await supabase.from('produtos').select('*');
    
    if (error) {
      console.error("Erro ao buscar produtos:", error);
    } else {
      setProducts(data);
    }
  };
  fetchProdutos();
}, []); 
const handleAdd = async () => {
      const newProduct = {
      id: Date.now().toString(),
      ...formData
    };
 const { error } = await supabase.from('historico').insert([
      { 
        produto_nome: newProduct.name, 
        quantidade_alterada: newProduct.quantity, 
        tipo_operacao: 'Cadastro' 
      }
    ]);

    if (error) {
      console.error("Erro ao salvar histórico no Supabase:", error);
    }
};
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('nessfit_products', JSON.stringify(updated));

    const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
    history.push({
      id: Date.now().toString(),
      type: 'product_added',
      description: `Produto adicionado: ${formData.name} - ${formData.quantity} ${formData.unit}`,
      date: new Date().toISOString()
    });
    localStorage.setItem('nessfit_history', JSON.stringify(history));

    setFormData({ name: '', quantity: 0, unit: 'kg', minQuantity: 0, value: 0 });
    setIsAdding(false);
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        quantity: product.quantity,
        unit: product.unit,
        minQuantity: product.minQuantity,
        value: product.value
      });
      setEditingId(id);
      setIsAdding(true);
    }
  };

  const handleUpdate = () => {
    const updated = products.map(p =>
      p.id === editingId ? { ...p, ...formData } : p
    );
    setProducts(updated);
    localStorage.setItem('nessfit_products', JSON.stringify(updated));

    const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
    history.push({
      id: Date.now().toString(),
      type: 'product_updated',
      description: `Produto atualizado: ${formData.name}`,
      date: new Date().toISOString()
    });
    localStorage.setItem('nessfit_history', JSON.stringify(history));

    setFormData({ name: '', quantity: 0, unit: 'kg', minQuantity: 0, value: 0 });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('nessfit_products', JSON.stringify(updated));

    if (product) {
      const history = JSON.parse(localStorage.getItem('nessfit_history') || '[]');
      history.push({
        id: Date.now().toString(),
        type: 'product_deleted',
        description: `Produto excluído: ${product.name}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('nessfit_history', JSON.stringify(history));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Produtos</h2>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ name: '', quantity: 0, unit: 'kg', minQuantity: 0, value: 0 });
          }}
          className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#45a049] transition-colors shadow-lg"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#4CAF50]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingId ? 'Editar Produto' : 'Adicionar Produto'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
                placeholder="Ex: Arroz Integral"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade Atual</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="un">un</option>
                <option value="l">l</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade Mínima</label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg font-semibold hover:bg-[#45a049] transition-colors"
            >
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', quantity: 0, unit: 'kg', minQuantity: 0, value: 0 });
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const isLowStock = product.quantity < product.minQuantity;
          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                isLowStock ? 'border-red-500' : 'border-[#4CAF50]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Package className={isLowStock ? 'text-red-500' : 'text-[#4CAF50]'} size={24} />
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
                    {isLowStock && (
                      <span className="text-xs text-red-600 font-semibold">ESTOQUE BAIXO!</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="font-semibold">{product.quantity} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínimo:</span>
                  <span className="font-semibold">{product.minQuantity} {product.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-semibold text-[#4CAF50]">R$ {product.value.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">Nenhum produto cadastrado</p>
      )}
    </div>
  );
}
