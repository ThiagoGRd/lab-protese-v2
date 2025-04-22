"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroLidas, setFiltroLidas] = useState('');

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      setCarregando(true);
      
      // Obter usuário logado do localStorage (em produção, usar cookies HttpOnly)
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      
      const user = JSON.parse(userStr);
      
      const response = await fetch(`/api/notificacoes?usuario_id=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notificações');
      }
      
      const data = await response.json();
      setNotificacoes(data.notificacoes);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar as notificações. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marcar_como_lida: true }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao marcar notificação como lida');
      }
      
      // Atualizar a lista de notificações
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao marcar notificação como lida. Por favor, tente novamente.');
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      // Obter usuário logado do localStorage (em produção, usar cookies HttpOnly)
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuário não autenticado');
      }
      
      const user = JSON.parse(userStr);
      
      const response = await fetch('/api/notificacoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          marcar_todas_como_lidas: true,
          usuario_id: user.id
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao marcar todas notificações como lidas');
      }
      
      // Atualizar a lista de notificações
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao marcar todas notificações como lidas. Por favor, tente novamente.');
    }
  };

  const excluirNotificacao = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/notificacoes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir notificação');
      }
      
      // Atualizar a lista de notificações
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao excluir notificação. Por favor, tente novamente.');
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'info':
        return <span className="badge badge-info">Informação</span>;
      case 'alerta':
        return <span className="badge badge-warning">Alerta</span>;
      case 'urgente':
        return <span className="badge badge-danger">Urgente</span>;
      default:
        return <span className="badge">{tipo}</span>;
    }
  };

  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    const matchTipo = filtroTipo ? notificacao.tipo === filtroTipo : true;
    
    let matchLidas = true;
    if (filtroLidas === 'lidas') {
      matchLidas = notificacao.lida;
    } else if (filtroLidas === 'nao_lidas') {
      matchLidas = !notificacao.lida;
    }
    
    return matchTipo && matchLidas;
  });

  return (
    <DashboardLayout title="Notificações" activeItem="notificações">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <div className="flex space-x-2">
          <button 
            className="btn btn-secondary"
            onClick={marcarTodasComoLidas}
          >
            <i className="fas fa-check-double mr-2"></i>
            Marcar todas como lidas
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{erro}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErro('')}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="card">
        <div className="mb-4 flex">
          <div className="mr-2">
            <select 
              className="form-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="info">Informação</option>
              <option value="alerta">Alerta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div>
            <select 
              className="form-select"
              value={filtroLidas}
              onChange={(e) => setFiltroLidas(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="lidas">Lidas</option>
              <option value="nao_lidas">Não lidas</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando notificações...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificacoesFiltradas.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>Nenhuma notificação encontrada.</p>
              </div>
            ) : (
              notificacoesFiltradas.map((notificacao) => (
                <div 
                  key={notificacao.id} 
                  className={`p-4 border rounded-lg ${notificacao.lida ? 'bg-gray-50' : 'bg-white border-blue-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`mr-3 text-xl ${
                        notificacao.tipo === 'info' ? 'text-blue-500' : 
                        notificacao.tipo === 'alerta' ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        <i className={`fas ${
                          notificacao.tipo === 'info' ? 'fa-info-circle' : 
                          notificacao.tipo === 'alerta' ? 'fa-exclamation-triangle' : 
                          'fa-exclamation-circle'
                        }`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{notificacao.titulo}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(notificacao.data_criacao).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notificacao.lida && (
                        <button 
                          className="text-blue-600 hover:text-blue-800" 
                          title="Marcar como lida"
                          onClick={() => marcarComoLida(notificacao.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        title="Excluir"
                        onClick={() => excluirNotificacao(notificacao.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p>{notificacao.mensagem}</p>
                  </div>
                  <div className="mt-2">
                    {getTipoBadge(notificacao.tipo)}
                    {!notificacao.lida && (
                      <span className="badge badge-primary ml-2">Nova</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
