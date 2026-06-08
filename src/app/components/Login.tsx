import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Alert } from './Alert';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';

interface LoginProps {
  onLogin: (user: any) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar formato do email antes de continuar
    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('nessfit_users') || '[]');
    const user = storedUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('E-mail ou senha incorretos. Verifique seus dados e tente novamente.');
      setPassword(''); // Limpa o campo de senha por segurança
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5E6D3] via-[#FFE4CC] to-[#E8F5E9]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-[#FF8C42]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-[#FF8C42] mb-2">Bem-vindo</h1>
          <p className="text-gray-600">Acesse sua conta Néssfit</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailInput
            value={email}
            onChange={setEmail}
            autoFocus={true}
          />

          <PasswordInput
            value={password}
            onChange={setPassword}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <p className="text-center text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#4CAF50] font-bold hover:underline transition-all"
            >
              Criar conta gratuita
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
