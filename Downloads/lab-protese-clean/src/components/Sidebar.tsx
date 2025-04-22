"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar({ activeItem }) {
  const [user, setUser] = useState(null);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

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
    
    // Atualizar notificações a cada minuto
    const interval = setInterval(carregarNotificacoes, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { name: 'serviços', label: 'Serviços', icon: 'fa-list-alt' },
    { name: 'clientes', label: 'Clientes', icon: 'fa-users' },
    { name: 'ordens de serviço', label: 'Ordens de Serviço', icon: 'fa-clipboard-list' },
    { name: 'materiais', label: 'Materiais', icon: 'fa-boxes' },
    { name: 'financeiro', label: 'Financeiro', icon: 'fa-money-bill-wave' },
    { name: 'relatórios', label: 'Relatórios', icon: 'fa-chart-bar' },
    { name: 'notificações', label: 'Notificações', icon: 'fa-bell', badge: notificacoesNaoLidas }
  ];

  return (
    <div className="sidebar w-64 fixed inset-y-0 left-0 z-30 overflow-y-auto">
      <div className="logo-container">
        <div className="logo-text">ProTech Lab</div>
      </div>
      
      {user && (
        <div className="px-4 py-4 border-t border-blue-700 border-b border-blue-700 mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.nome}</p>
              <p className="text-xs text-blue-200">{user.tipo === 'admin' ? 'Administrador' : user.tipo === 'tecnico' ? 'Técnico' : 'Auxiliar'}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="mt-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeItem.toLowerCase() === item.name.toLowerCase();
          const href = item.name === 'dashboard' ? '/dashboard' : `/${item.name.replace(/ /g, '')}`;
          
          return (
            <Link 
              key={item.name}
              href={href}
              className={`sidebar-item flex items-center ${isActive ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon} mr-3 w-5 text-center`}></i>
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="notification-badge ml-auto">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 mt-auto">
        <button 
          className="w-full py-2 px-4 rounded bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('session');
            window.location.href = '/login';
          }}
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Sair
        </button>
      </div>
    </div>
  );
}
