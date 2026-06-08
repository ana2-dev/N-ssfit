import { useState } from 'react';
import { Camera, User, Mail, Briefcase, Trash2, LogOut } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface ProfileProps {
  user: any;
  onLogout: () => void;
  onUpdateUser: (user: any) => void;
}

export function Profile({ user, onLogout, onUpdateUser }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo
  });

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

  const handleSave = () => {
    const storedUsers = JSON.parse(localStorage.getItem('nessfit_users') || '[]');
    const updatedUsers = storedUsers.map((u: any) =>
      u.id === user.id ? { ...u, ...formData } : u
    );
    localStorage.setItem('nessfit_users', JSON.stringify(updatedUsers));

    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    const storedUsers = JSON.parse(localStorage.getItem('nessfit_users') || '[]');
    const updatedUsers = storedUsers.filter((u: any) => u.id !== user.id);
    localStorage.setItem('nessfit_users', JSON.stringify(updatedUsers));

    // Limpar todos os dados relacionados
    localStorage.removeItem('nessfit_products');
    localStorage.removeItem('nessfit_deliveries');
    localStorage.removeItem('nessfit_history');

    onLogout();
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        message="Tem certeza de que deseja excluir sua conta? Esta ação é permanente e todos os seus dados serão apagados."
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        variant="danger"
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-[#4CAF50]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h2>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-400" size={48} />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#4CAF50] text-white p-3 rounded-full cursor-pointer hover:bg-[#45a049] transition-colors">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#4CAF50] focus:outline-none transition-colors disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#4CAF50] text-white py-3 rounded-lg font-semibold hover:bg-[#45a049] transition-colors"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email, role: user.role, photo: user.photo });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-[#FF8C42] text-white py-3 rounded-lg font-semibold hover:bg-[#e67935] transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Trash2 size={20} />
            Excluir Conta Permanentemente
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
