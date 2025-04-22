"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    // Obter usuário do localStorage (em produção, usar cookies HttpOnly)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Carregar contagem de notificações não lidas
    const carregarNotificacoes = async () => {
      try {
        const userObj = JSON.parse(userStr);
        if (!userObj || !userObj.id) return;

        const response = await fetch(`/api/notificacoes?usuario_id=${userObj.id}&nao_lidas=true`);
        if (response.ok) {
          const data = await response.json();
          setNotificacoesNaoLidas(data.notificacoes.length);
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    carregarNotificacoes();
  }, []);

  return (
    <header className="header h-16 flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 left-64 z-20">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-blue-600">ProTech Lab</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/notificacoes" className="relative text-gray-600 hover:text-gray-800">
          <i className="fas fa-bell text-xl"></i>
          {notificacoesNaoLidas > 0 && (
            <span className="notification-badge">
              {notificacoesNaoLidas > 99 ? '99+' : notificacoesNaoLidas}
            </span>
          )}
        </Link>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.nome || 'Usuário'}</span>
            <i className="fas fa-chevron-down text-xs"></i>
          </button>
          
          {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium">{user?.nome || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
              <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Meu Perfil
              </Link>
              <Link href="/configuracoes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Configurações
              </Link>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('session');
                  window.location.href = '/login';
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
