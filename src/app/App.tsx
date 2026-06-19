import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Certifique-se que este caminho está correto
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { DeliveryManager } from './components/DeliveryManager';
import { ProductManager } from './components/ProductManager';
import { History } from './components/History';
import { RecipeManager } from './components/RecipeManager';

type View =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'profile'
  | 'deliveries'
  | 'products'
  | 'recipes'
  | 'history';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [marmitas, setMarmitas] = useState([]);

  // Função para buscar marmitas do Supabase
  useEffect(() => {
    async function fetchMarmitas() {
      try {
        const { data, error } = await supabase.from('marmitas').select('*');
        if (error) throw error;
        if (data) setMarmitas(data as any);
      } catch (error) {
        console.error('Erro ao buscar marmitas:', error);
      }
    }

    if (isAuthenticated) {
      fetchMarmitas();
    }
  }, [isAuthenticated]);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleRegister = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (!isAuthenticated) {
    return (
      <>
        {currentView === 'login' && <Login onLogin={handleLogin} onNavigate={setCurrentView} />}
        {currentView === 'register' && <Register onRegister={handleRegister} onNavigate={setCurrentView} />}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F5E6D3] via-[#FFE4CC] to-[#E8F5E9]">
      <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b-4 border-[#FF8C42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 md:gap-8">
              <h1 className="text-lg sm:text-2xl font-bold text-[#FF8C42]">Néssfit Stock</h1>
              <div className="flex gap-1 sm:gap-4 overflow-x-auto">
                {['dashboard', 'deliveries', 'products', 'recipes', 'history'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view as View)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentView === view
                        ? 'bg-[#FF8C42] text-white'
                        : 'text-gray-600 hover:bg-[#FFE4CC]'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {currentUser?.name}</span>
              <button
                onClick={() => setCurrentView('profile')}
                className="w-10 h-10 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-bold hover:bg-[#45a049] transition-colors"
              >
                {currentUser?.name?.[0]?.toUpperCase() || 'U'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard user={currentUser} onLogout={handleLogout} marmitas={marmitas} />
        )}
        {currentView === 'profile' && (
          <Profile user={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} />
        )}
        {currentView === 'deliveries' && <DeliveryManager />}
        {currentView === 'products' && <ProductManager />}
        {currentView === 'recipes' && <RecipeManager />}
        {currentView === 'history' && <History />}
      </main>
    </div>
  );
}