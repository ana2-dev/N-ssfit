import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Caminho correto se App.tsx está em src/
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { DeliveryManager } from './components/DeliveryManager';
import { ProductManager } from './components/ProductManager';
import { History } from './components/History';
import { RecipeManager } from './components/RecipeManager';

type View = 'login' | 'register' | 'dashboard' | 'profile' | 'deliveries' | 'products' | 'recipes' | 'history';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [marmitas, setMarmitas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMarmitas() {
      const { data, error } = await supabase.from('marmitas').select('*');
      if (error) {
        console.error('Erro ao buscar marmitas:', error);
      } else {
        setMarmitas(data || []);
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
            <h1 className="text-xl font-bold text-[#FF8C42]">Néssfit Stock</h1>
            <div className="flex gap-2">
              {['dashboard', 'deliveries', 'products', 'recipes', 'history'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view as View)}
                  className={`px-3 py-1 rounded ${currentView === view ? 'bg-[#FF8C42] text-white' : 'text-gray-600'}`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500">Sair</button>
          </div>
        </div>
      </nav>

      <main className="p-4">
        {currentView === 'dashboard' && <Dashboard user={currentUser} onLogout={handleLogout} marmitas={marmitas} />}
        {currentView === 'profile' && <Profile user={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} />}
        {currentView === 'deliveries' && <DeliveryManager />}
        {currentView === 'products' && <ProductManager />}
        {currentView === 'recipes' && <RecipeManager />}
        {currentView === 'history' && <History />}
      </main>
    </div>
  );
}