import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TruckIcon, DollarSign, ShoppingCart, X, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [isFirstAccess, setIsFirstAccess] = useState(false);

  useEffect(() => {
    const storedProducts = localStorage.getItem('nessfit_products');
    const storedDeliveries = localStorage.getItem('nessfit_deliveries');

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedDeliveries) setDeliveries(JSON.parse(storedDeliveries));

    // Verificar se é o primeiro acesso
    const hasProducts = storedProducts && JSON.parse(storedProducts).length > 0;
    const hasDeliveries = storedDeliveries && JSON.parse(storedDeliveries).length > 0;
    setIsFirstAccess(!hasProducts && !hasDeliveries);
  }, []);

  const lowStockProducts = products.filter(p => p.quantity < p.minQuantity);
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const totalStockValue = products.reduce((sum, p) => sum + p.value, 0);

  const productPurchases: { [key: string]: number } = {};
  products.forEach(p => {
    productPurchases[p.name] = (productPurchases[p.name] || 0) + 1;
  });
  const topProductEntry = Object.entries(productPurchases).sort((a, b) => b[1] - a[1])[0];
  const topProduct = topProductEntry ? { name: topProductEntry[0], purchases: topProductEntry[1] } : null;

  const topIngredient = products.length > 0
    ? products.reduce((max, p) => p.value > (max?.value || 0) ? p : max, products[0])
    : null;

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const notifs = [];
    lowStockProducts.forEach((p, index) => {
      notifs.push({
        id: `low-${index}`,
        type: 'low-stock',
        message: `${p.name} em estoque baixo (${p.quantity} ${p.unit})`,
        dismissed: false
      });
    });
    pendingDeliveries.forEach((d, index) => {
      notifs.push({
        id: `delivery-${index}`,
        type: 'delivery',
        message: `Entrega pendente: ${d.product} - ${d.quantity}${d.unit}`,
        dismissed: false
      });
    });
    setNotifications(notifs);
  }, [products, deliveries]);

  const dismissNotification = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, dismissed: true } : n));
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);

  const stats = {
    totalStockValue,
    lowStockItems: lowStockProducts.length,
    pendingDeliveries: pendingDeliveries.length,
    topProduct,
    topIngredient
  };

  // Se for primeiro acesso, mostrar empty state especial
  if (isFirstAccess) {
    return (
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={32} />
              <h2 className="text-3xl font-bold">Bem-vindo ao Néssfit Stock!</h2>
            </div>
            <p className="text-lg opacity-90 mb-6">
              Seu sistema de gerenciamento de estoque está pronto para uso. Comece adicionando seus primeiros produtos e entregas para ter total controle do seu inventário.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate?.('products')}
                className="bg-white text-[#FF8C42] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar Primeiro Produto
              </button>
              <button
                onClick={() => onNavigate?.('deliveries')}
                className="bg-[#4CAF50] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#45a049] transition-colors shadow-lg flex items-center gap-2"
              >
                <TruckIcon size={20} />
                Cadastrar Entrega
              </button>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#4CAF50]">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ArrowRight className="text-[#4CAF50]" />
            Como começar
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#FFE4CC] to-[#FFF5E6] rounded-xl">
              <div className="w-16 h-16 bg-[#FF8C42] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-white" size={32} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-lg">1. Adicione Produtos</h4>
              <p className="text-gray-600 text-sm mb-4">
                Cadastre os ingredientes e produtos que você mantém em estoque
              </p>
              <button
                onClick={() => onNavigate?.('products')}
                className="text-[#FF8C42] font-semibold hover:underline flex items-center gap-1 mx-auto"
              >
                Ir para Produtos <ArrowRight size={16} />
              </button>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] rounded-xl">
              <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="text-white" size={32} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-lg">2. Gerencie Entregas</h4>
              <p className="text-gray-600 text-sm mb-4">
                Acompanhe entregas de fornecedores e mantenha o estoque atualizado
              </p>
              <button
                onClick={() => onNavigate?.('deliveries')}
                className="text-[#4CAF50] font-semibold hover:underline flex items-center gap-1 mx-auto"
              >
                Ir para Entregas <ArrowRight size={16} />
              </button>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-[#E3F2FD] to-[#F3E5F5] rounded-xl">
              <div className="w-16 h-16 bg-[#2196F3] rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white" size={32} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 text-lg">3. Monitore Dados</h4>
              <p className="text-gray-600 text-sm mb-4">
                Acompanhe métricas, custos e receba alertas de estoque baixo
              </p>
              <span className="text-gray-400 font-medium text-sm">
                Disponível após cadastro
              </span>
            </div>
          </div>
        </div>

        {/* Empty State Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF8C42] opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Valor Total em Estoque</h3>
              <DollarSign className="text-[#FF8C42]" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-400">R$ 0,00</p>
            <p className="text-sm text-gray-400 mt-2">Aguardando produtos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#4CAF50] opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Produto Mais Comprado</h3>
              <ShoppingCart className="text-[#4CAF50]" size={28} />
            </div>
            <p className="text-xl text-gray-400 mt-2">Nenhum produto cadastrado</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#D4A574] opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Ingrediente Mais Caro</h3>
              <Package className="text-[#D4A574]" size={28} />
            </div>
            <p className="text-xl text-gray-400 mt-2">Nenhum produto cadastrado</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Estoque Baixo</h3>
              <AlertTriangle className="text-red-500" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-400">0</p>
            <p className="text-sm text-gray-400 mt-2">Tudo sob controle</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Entregas Pendentes</h3>
              <TruckIcon className="text-blue-500" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-400">0</p>
            <p className="text-sm text-gray-400 mt-2">Nenhuma entrega pendente</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Produtos em Estoque</h3>
              <Package className="text-purple-500" size={28} />
            </div>
            <p className="text-3xl font-bold text-gray-400">0</p>
            <p className="text-sm text-gray-400 mt-2">Comece adicionando</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard normal com dados
  return (
    <div className="space-y-6">
      {activeNotifications.length > 0 && (
        <div className="space-y-3">
          {activeNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-600" size={24} />
                <p className="text-yellow-800 font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF8C42]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Valor Total em Estoque</h3>
            <DollarSign className="text-[#FF8C42]" size={28} />
          </div>
          <p className="text-3xl font-bold text-gray-800">R$ {stats.totalStockValue.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Investimento atual</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#4CAF50]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Produto Mais Comprado</h3>
            <ShoppingCart className="text-[#4CAF50]" size={28} />
          </div>
          {stats.topProduct ? (
            <>
              <p className="text-3xl font-bold text-gray-800">{stats.topProduct.name}</p>
              <p className="text-sm text-gray-500 mt-2">{stats.topProduct.purchases} registro(s)</p>
            </>
          ) : (
            <p className="text-xl text-gray-400 mt-2">Nenhum produto cadastrado</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#D4A574]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Ingrediente Mais Caro</h3>
            <Package className="text-[#D4A574]" size={28} />
          </div>
          {stats.topIngredient ? (
            <>
              <p className="text-3xl font-bold text-gray-800">{stats.topIngredient.name}</p>
              <p className="text-sm text-gray-500 mt-2">Custo: R$ {stats.topIngredient.value.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-xl text-gray-400 mt-2">Nenhum produto cadastrado</p>
          )}
        </div>

        <div
          onClick={() => setSelectedCard(selectedCard === 'low-stock' ? null : 'low-stock')}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Estoque Baixo</h3>
            <AlertTriangle className="text-red-500" size={28} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.lowStockItems}</p>
          <p className="text-sm text-gray-500 mt-2">Produtos precisam de reposição</p>
        </div>

        <div
          onClick={() => setSelectedCard(selectedCard === 'deliveries' ? null : 'deliveries')}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Entregas Pendentes</h3>
            <TruckIcon className="text-blue-500" size={28} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.pendingDeliveries}</p>
          <p className="text-sm text-gray-500 mt-2">Aguardando recebimento</p>
        </div>

        <div
          onClick={() => setSelectedCard(selectedCard === 'stock' ? null : 'stock')}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Produtos em Estoque</h3>
            <Package className="text-purple-500" size={28} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{products.length}</p>
          <p className="text-sm text-gray-500 mt-2">Itens cadastrados</p>
        </div>
      </div>

      {selectedCard === 'low-stock' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Produtos com Estoque Baixo</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Atual: {product.quantity} {product.unit} / Mínimo: {product.minQuantity} {product.unit}
                    </p>
                  </div>
                  <span className="text-red-600 font-bold">Baixo!</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum produto com estoque baixo</p>
          )}
        </div>
      )}

      {selectedCard === 'deliveries' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Entregas Pendentes</h3>
          {pendingDeliveries.length > 0 ? (
            <div className="space-y-3">
              {pendingDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{delivery.product}</p>
                    <p className="text-sm text-gray-600">
                      {delivery.supplier} - {delivery.quantity} {delivery.unit}
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium">{new Date(delivery.date).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhuma entrega pendente</p>
          )}
        </div>
      )}

      {selectedCard === 'stock' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Produtos em Estoque</h3>
          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.quantity} {product.unit}
                    </p>
                  </div>
                  <span className="text-purple-600 font-bold">R$ {product.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Nenhum produto em estoque</p>
          )}
        </div>
      )}
    </div>
  );
}
