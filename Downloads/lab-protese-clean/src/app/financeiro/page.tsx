"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function FinanceiroPage() {
  const router = useRouter();
  const [contasReceber, setContasReceber] = useState([]);
  const [contasPagar, setContasPagar] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [activeTab, setActiveTab] = useState('receber');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [busca, setBusca] = useState('');
  const [resumo, setResumo] = useState({
    totalReceber: 0,
    totalPagar: 0,
    receberVencidas: 0,
    pagarVencidas: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      // Carregar contas a receber
      const receberResponse = await fetch('/api/financeiro/contas-receber?atualizar_vencidas=true');
      if (!receberResponse.ok) {
        throw new Error('Erro ao carregar contas a receber');
      }
      const receberData = await receberResponse.json();
      
      // Carregar contas a pagar
      const pagarResponse = await fetch('/api/financeiro/contas-pagar?atualizar_vencidas=true');
      if (!pagarResponse.ok) {
        throw new Error('Erro ao carregar contas a pagar');
      }
      const pagarData = await pagarResponse.json();
      
      setContasReceber(receberData.contas);
      setContasPagar(pagarData.contas);
      
      // Calcular resumo
      const totalReceber = receberData.contas
        .filter(conta => conta.status !== 'pago')
        .reduce((sum, conta) => sum + conta.valor, 0);
        
      const totalPagar = pagarData.contas
        .filter(conta => conta.status !== 'pago')
        .reduce((sum, conta) => sum + conta.valor, 0);
        
      const receberVencidas = receberData.contas
        .filter(conta => conta.status === 'atrasado')
        .reduce((sum, conta) => sum + conta.valor, 0);
        
      const pagarVencidas = pagarData.contas
        .filter(conta => conta.status === 'atrasado')
        .reduce((sum, conta) => sum + conta.valor, 0);
      
      setResumo({
        totalReceber,
        totalPagar,
        receberVencidas,
        pagarVencidas
      });
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar os dados financeiros. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const registrarPagamento = async (id, tipo) => {
    try {
      const endpoint = tipo === 'receber' 
        ? `/api/financeiro/contas-receber/${id}`
        : `/api/financeiro/contas-pagar/${id}`;
        
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          registrar_pagamento: true,
          data_pagamento: new Date().toISOString().split('T')[0]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar pagamento');
      }
      
      // Recarregar dados
      await carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao registrar pagamento. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id, tipo) => {
    if (!confirm(`Tem certeza que deseja excluir esta conta a ${tipo === 'receber' ? 'receber' : 'pagar'}?`)) {
      return;
    }
    
    try {
      const endpoint = tipo === 'receber' 
        ? `/api/financeiro/contas-receber/${id}`
        : `/api/financeiro/contas-pagar/${id}`;
        
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir conta');
      }
      
      // Recarregar dados
      await carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao excluir conta. Por favor, tente novamente.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendente':
        return <span className="badge badge-info">Pendente</span>;
      case 'atrasado':
        return <span className="badge badge-danger">Atrasado</span>;
      case 'pago':
        return <span className="badge badge-success">Pago</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const filtrarContas = (contas) => {
    return contas.filter(conta => {
      // Filtro de busca
      const matchBusca = 
        (conta.descricao && conta.descricao.toLowerCase().includes(busca.toLowerCase())) ||
        (conta.cliente_nome && conta.cliente_nome.toLowerCase().includes(busca.toLowerCase())) ||
        (conta.fornecedor && conta.fornecedor.toLowerCase().includes(busca.toLowerCase()));
      
      // Filtro de status
      const matchStatus = filtroStatus ? conta.status === filtroStatus : true;
      
      // Filtro de período
      let matchPeriodo = true;
      const hoje = new Date();
      const dataVencimento = new Date(conta.data_vencimento);
      
      if (filtroPeriodo === 'hoje') {
        matchPeriodo = 
          dataVencimento.getDate() === hoje.getDate() && 
          dataVencimento.getMonth() === hoje.getMonth() && 
          dataVencimento.getFullYear() === hoje.getFullYear();
      } else if (filtroPeriodo === 'semana') {
        const umaSemanaDepois = new Date(hoje);
        umaSemanaDepois.setDate(hoje.getDate() + 7);
        matchPeriodo = dataVencimento >= hoje && dataVencimento <= umaSemanaDepois;
      } else if (filtroPeriodo === 'mes') {
        matchPeriodo = 
          dataVencimento.getMonth() === hoje.getMonth() && 
          dataVencimento.getFullYear() === hoje.getFullYear();
      }
      
      return matchBusca && matchStatus && matchPeriodo;
    });
  };

  const contasReceberFiltradas = filtrarContas(contasReceber);
  const contasPagarFiltradas = filtrarContas(contasPagar);

  return (
    <DashboardLayout title="Financeiro" activeItem="financeiro">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Controle Financeiro</h1>
        <div className="flex space-x-2">
          <button 
            className="btn btn-secondary"
            onClick={() => router.push('/financeiro/relatorios')}
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Relatórios
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/financeiro/nova-conta')}
          >
            <i className="fas fa-plus mr-2"></i>
            Nova Conta
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

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border-blue-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-blue-700">A Receber</h3>
            <p className="text-2xl font-bold text-blue-800">R$ {resumo.totalReceber.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="card bg-red-50 border-red-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-red-700">A Pagar</h3>
            <p className="text-2xl font-bold text-red-800">R$ {resumo.totalPagar.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-yellow-700">Receber Atrasado</h3>
            <p className="text-2xl font-bold text-yellow-800">R$ {resumo.receberVencidas.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="card bg-orange-50 border-orange-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-orange-700">Pagar Atrasado</h3>
            <p className="text-2xl font-bold text-orange-800">R$ {resumo.pagarVencidas.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'receber'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('receber')}
            >
              Contas a Receber
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'pagar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pagar')}
            >
              Contas a Pagar
            </button>
          </li>
        </ul>
      </div>

      <div className="card">
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar conta..."
              className="form-input pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div>
            <select 
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
              <option value="pago">Pago</option>
            </select>
          </div>
          <div>
            <select 
              className="form-select"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              <option value="">Todos os períodos</option>
              <option value="hoje">Vence hoje</option>
              <option value="semana">Vence esta semana</option>
              <option value="mes">Vence este mês</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando dados financeiros...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'receber' ? (
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">ID</th>
                    <th className="table-header-cell">Cliente</th>
                    <th className="table-header-cell">Descrição</th>
                    <th className="table-header-cell">Valor (R$)</th>
                    <th className="table-header-cell">Vencimento</th>
                    <th className="table-header-cell">Pagamento</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {contasReceberFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="table-cell text-center">
                        Nenhuma conta a receber encontrada.
                      </td>
                    </tr>
                  ) : (
                    contasReceberFiltradas.map((conta) => (
                      <tr key={conta.id} className="table-row">
                        <td className="table-cell">{conta.id}</td>
                        <td className="table-cell font-medium">{conta.cliente_nome || '-'}</td>
                        <td className="table-cell">{conta.descricao}</td>
                        <td className="table-cell font-medium">R$ {conta.valor.toFixed(2)}</td>
                        <td className="table-cell">{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                        <td className="table-cell">
                          {conta.data_pagamento ? new Date(conta.data_pagamento).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="table-cell">{getStatusBadge(conta.status)}</td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800" 
                              title="Editar"
                              onClick={() => router.push(`/financeiro/contas-receber/${conta.id}/editar`)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {conta.status !== 'pago' && (
                              <button 
                                className="text-green-600 hover:text-green-800" 
                                title="Registrar pagamento"
                                onClick={() => registrarPagamento(conta.id, 'receber')}
                              >
                                <i className="fas fa-check-circle"></i>
                              </button>
                            )}
                            <button 
                              className="text-red-600 hover:text-red-800" 
                              title="Excluir"
                              onClick={() => handleDelete(conta.id, 'receber')}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">ID</th>
                    <th className="table-header-cell">Fornecedor</th>
                    <th className="table-header-cell">Descrição</th>
                    <th className="table-header-cell">Valor (R$)</th>
                    <th className="table-header-cell">Vencimento</th>
                    <th className="table-header-cell">Pagamento</th>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {contasPagarFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="table-cell text-center">
                        Nenhuma conta a pagar encontrada.
                      </td>
                    </tr>
                  ) : (
                    contasPagarFiltradas.map((conta) => (
                      <tr key={conta.id} className="table-row">
                        <td className="table-cell">{conta.id}</td>
                        <td className="table-cell font-medium">{conta.fornecedor}</td>
                        <td className="table-cell">{conta.descricao}</td>
                        <td className="table-cell font-medium">R$ {conta.valor.toFixed(2)}</td>
                        <td className="table-cell">{new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}</td>
                        <td className="table-cell">
                          {conta.data_pagamento ? new Date(conta.data_pagamento).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="table-cell">{getStatusBadge(conta.status)}</td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-800" 
                              title="Editar"
                              onClick={() => router.push(`/financeiro/contas-pagar/${conta.id}/editar`)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {conta.status !== 'pago' && (
                              <button 
                                className="text-green-600 hover:text-green-800" 
                                title="Registrar pagamento"
                                onClick={() => registrarPagamento(conta.id, 'pagar')}
                              >
                                <i className="fas fa-check-circle"></i>
                              </button>
                            )}
                            <button 
                              className="text-red-600 hover:text-red-800" 
                              title="Excluir"
                              onClick={() => handleDelete(conta.id, 'pagar')}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
