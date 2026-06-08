import { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showStrength?: boolean;
  showError?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  label = 'Senha',
  placeholder = '••••••••',
  required = true,
  showStrength = false,
  showError = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const getPasswordStrength = (password: string): {
    level: number;
    text: string;
    color: string;
    bgColor: string;
    textColor: string;
    isValid: boolean;
  } => {
    if (password.length === 0) {
      return {
        level: 0,
        text: '',
        color: '',
        bgColor: '',
        textColor: '',
        isValid: false
      };
    }

    const hasNumbers = /\d/.test(password);
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    // Fraca: Menos de 6 caracteres OU apenas números
    if (password.length < 6 || (hasNumbers && !hasLetters && !hasSymbols)) {
      return {
        level: 1,
        text: 'Fraca',
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        isValid: false
      };
    }

    // Forte: 8+ caracteres com letras, números E símbolos
    if (password.length >= 8 && hasLetters && hasNumbers && hasSymbols) {
      return {
        level: 3,
        text: 'Forte',
        color: 'bg-[#4CAF50]',
        bgColor: 'bg-green-50',
        textColor: 'text-[#4CAF50]',
        isValid: true
      };
    }

    // Média: 6+ caracteres com letras E números
    if (password.length >= 6 && hasLetters && hasNumbers) {
      return {
        level: 2,
        text: 'Média',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-600',
        isValid: true
      };
    }

    // Caso padrão (6+ caracteres mas só letras ou só números)
    return {
      level: 2,
      text: 'Média',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      isValid: true
    };
  };

  const strength = getPasswordStrength(value);
  const showValidationError = showError && touched && !strength.isValid && value.length > 0;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-[#FF8C42]">*</span>}
      </label>
      <div className="relative">
        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
          showValidationError ? 'text-red-500' : 'text-gray-400'
        }`} size={20} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all ${
            showValidationError
              ? 'border-red-500 bg-red-50 focus:border-red-600'
              : 'border-gray-200 focus:border-[#FF8C42] bg-white'
          }`}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Mensagem de instrução fixa */}
      {showStrength && value.length === 0 && (
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <Shield size={14} />
          A senha deve conter no mínimo 6 caracteres
        </p>
      )}

      {/* Indicador de força da senha */}
      {showStrength && value.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-1.5 mb-2">
            <div className={`h-2 flex-1 rounded-full transition-all ${
              strength.level >= 1 ? strength.color : 'bg-gray-200'
            }`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${
              strength.level >= 2 ? strength.color : 'bg-gray-200'
            }`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${
              strength.level >= 3 ? strength.color : 'bg-gray-200'
            }`} />
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg ${strength.bgColor}`}>
            <div className="flex items-center gap-2">
              {strength.isValid ? (
                <CheckCircle size={16} className={strength.textColor} />
              ) : (
                <AlertCircle size={16} className={strength.textColor} />
              )}
              <p className={`text-sm font-semibold ${strength.textColor}`}>
                Senha {strength.text}
              </p>
            </div>
            <p className="text-xs text-gray-600">
              {value.length} caracteres
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de erro específica */}
      {showValidationError && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-slideDown font-medium">
          <AlertCircle size={14} />
          Senha muito curta. Por favor, utilize pelo menos 6 caracteres para sua segurança
        </p>
      )}
    </div>
  );
}
