import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  autoFocus?: boolean;
}

export function EmailInput({ value, onChange, label = 'E-mail', required = true, autoFocus = false }: EmailInputProps) {
  const [touched, setTouched] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValid = validateEmail(value);
  const showError = touched && value.length > 0 && !isValid;
  const showSuccess = touched && value.length > 0 && isValid;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-[#FF8C42]">*</span>}
      </label>
      <div className="relative">
        <Mail
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
            showError ? 'text-red-500' : showSuccess ? 'text-[#4CAF50]' : 'text-gray-400'
          }`}
          size={20}
        />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-all ${
            showError
              ? 'border-red-500 bg-red-50 focus:border-red-600'
              : showSuccess
              ? 'border-[#4CAF50] bg-green-50 focus:border-[#4CAF50]'
              : 'border-gray-200 focus:border-[#FF8C42] bg-white'
          }`}
          placeholder="exemplo@email.com"
          required={required}
        />
        {showError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
        )}
        {showSuccess && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4CAF50]" size={20} />
        )}
      </div>
      {showError && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-slideDown">
          <AlertCircle size={14} />
          Por favor, insira um e-mail válido
        </p>
      )}
      {showSuccess && (
        <p className="mt-2 text-sm text-[#4CAF50] flex items-center gap-1 animate-slideDown">
          <CheckCircle size={14} />
          E-mail válido
        </p>
      )}
    </div>
  );
}
