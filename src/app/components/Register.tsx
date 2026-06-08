import { useState } from 'react';
import { User, Briefcase, Camera, UserPlus } from 'lucide-react';
import { Alert } from './Alert';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';

interface RegisterProps {
  onRegister: (user: any) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    photo: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    return password.length >= 6;
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    validateEmail(formData.email) &&
    isPasswordValid(formData.password) &&
    formData.role.trim() !== '';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowPasswordError(false);

    // Validar formato do email antes de continuar
    if (!validateEmail(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Validar senha mínima com feedback visual
    if (!isPasswordValid(formData.password)) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setShowPasswordError(true);
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('nessfit_users') || '[]');
    const userExists = storedUsers.some((u: any) => u.email === formData.email);

    if (userExists) {
      setError('Este e-mail já está cadastrado');
      return;
    }

    const newUser = {
      ...formData,
      id: Date.now().toString()
    };

    storedUsers.push(newUser);
    localStorage.setItem('nessfit_users', JSON.stringify(storedUsers));

    onRegister(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#FFE4CC]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-[#4CAF50]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-[#4CAF50] mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao Néssfit gratuitamente</p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              action={error.includes('já está cadastrado') ? {
                label: 'Ir para Login',
                onClick: onSwitchToLogin
              } : undefined}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-gray-400" size={32} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#4CAF50] text-white p-2.5 rounded-full cursor-pointer hover:bg-[#45a049] transition-all shadow-md hover:shadow-lg">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Completo <span className="text-[#FF8C42]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          <EmailInput
            value={formData.email}
            onChange={(email) => setFormData({ ...formData, email })}
          />

          <PasswordInput
            value={formData.password}
            onChange={(password) => {
              setFormData({ ...formData, password });
              setShowPasswordError(false);
              setError(null);
            }}
            showStrength={true}
            showError={showPasswordError}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cargo na Empresa <span className="text-[#FF8C42]">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors"
                placeholder="Ex: Gerente, Estoquista, Nutricionista"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <UserPlus size={20} />
            {isFormValid ? 'Criar Conta Gratuita' : 'Preencha todos os campos'}
          </button>

          {!isFormValid && formData.password.length > 0 && formData.password.length < 6 && (
            <p className="text-sm text-gray-500 text-center -mt-2">
              Complete os requisitos de senha para continuar
            </p>
          )}
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <p className="text-center text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#FF8C42] font-bold hover:underline transition-all"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
