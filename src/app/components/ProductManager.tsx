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

    // Agora tudo isso está dentro da função:
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