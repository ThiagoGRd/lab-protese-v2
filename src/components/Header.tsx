'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const [user, setUser] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  
  useEffect(() => {
    // Carregar usuário do localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    
    // Simular carregamento de notificações
    const loadNotificacoes = () => {
      // Dados simulados para demonstração
      setNotificacoes([
        { id: 1, titulo: 'Ordem de serviço urgente' },
        { id: 2, titulo: 'Estoque baixo de Zircônia' }
      ]);
    };
    
    loadUser();
    loadNotificacoes();
  }, []);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
      <div className="flex-1"></div>
      <div className="flex items-center space-x-4">
        <Link href="/notificacoes">
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Bell className="h-5 w-5" />
              {notificacoes.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificacoes.length}
                </span>
              )}
            </Button>
          </div>
        </Link>
        
        {user && (
          <div className="flex items-center space-x-2">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{user.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role || 'Usuário'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-4 w-4 text-blue-800" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
