import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { DeliveryManager } from './components/DeliveryManager';
import { ProductManager } from './components/ProductManager';
import { History } from './components/History';

type View = 'login' | 'register' | 'dashboard' | 'profile' | 'deliveries' | 'products' | 'history';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFE4CC] to-[#E8F5E9]">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />
        ) : (
          <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] via-[#FFE4CC] to-[#E8F5E9]">
      <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b-4 border-[#FF8C42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 md:gap-8">
              <h1 className="text-2xl font-bold text-[#FF8C42]">Néssfit Stock</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-[#FF8C42] text-white'
                      : 'text-gray-600 hover:bg-[#FFE4CC]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('deliveries')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'deliveries'
                      ? 'bg-[#FF8C42] text-white'
                      : 'text-gray-600 hover:bg-[#FFE4CC]'
                  }`}
                >
                  Entregas
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'products'
                      ? 'bg-[#FF8C42] text-white'
                      : 'text-gray-600 hover:bg-[#FFE4CC]'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentView === 'history'
                      ? 'bg-[#FF8C42] text-white'
                      : 'text-gray-600 hover:bg-[#FFE4CC]'
                  }`}
                >
                  Histórico
                </button>
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
          <Dashboard onNavigate={(view) => setCurrentView(view as View)} />
        )}
        {currentView === 'profile' && (
          <Profile user={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} />
        )}
        {currentView === 'deliveries' && <DeliveryManager />}
        {currentView === 'products' && <ProductManager />}
        {currentView === 'history' && <History />}
      </main>
    </div>
  );
}