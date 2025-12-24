import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User, UserStatus } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      if (user.status === UserStatus.INACTIVE) {
        setError('Usuário inativo. Contate o administrador.');
        return;
      }
      onLogin(user);
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
            <div className="h-52 w-52 flex items-center justify-center">
                <img src="/logomarcaesperanca.png" alt="Esperança Nordeste Logo" className="h-52 w-52 object-contain" />
            </div>
        </div>
        <p className="text-center text-gray-500 mb-8">Sistema de Gestão Comercial</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
            <p>Admin Padrão: admin@esperanca.com / admin</p>
            <p>Func. Padrão: joao@esperanca.com / 123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
