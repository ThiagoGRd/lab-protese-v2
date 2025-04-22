"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function OrdensPage() {
  const router = useRouter();
  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      
      // Carregar ordens de serviço com detalhes
      const ordensResponse = await fetch('/api/ordens?detalhada=true');
      if (!ordensResponse.ok) {
        throw new Error('Erro ao carregar ordens de serviço');
      }
      const ordensData = await ordensResponse.json();
      
      // Carregar clientes para o filtro
      const clientesResponse = await fetch('/api/clientes');
      if (!clientesResponse.ok) {
        throw new Error('Erro ao carregar clientes');
      }
      const clientesData = await clientesResponse.json();
      
      setOrdens(ordensData.ordens);
      setClientes(clientesData.clientes);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar os dados. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja cancelar esta ordem de serviço?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/ordens/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao cancelar ordem de serviço');
      }
      
      // Recarregar a lista de ordens
      await carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao cancelar ordem de serviço. Por favor, tente novamente.');
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      const response = await fetch(`/api/ordens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar status');
      }
      
      // Recarregar a lista de ordens
      await carregarDados();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao atualizar status. Por favor, tente novamente.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendente':
        return <span className="badge badge-warning">Pendente</span>;
      case 'em_andamento':
        return <span className="badge badge-info">Em Andamento</span>;
      case 'concluido':
        return <span className="badge badge-success">Concluído</span>;
      case 'entregue':
        return <span className="badge badge-success">Entregue</span>;
      case 'cancelado':
        return <span className="badge badge-danger">Cancelado</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const ordensFiltradas = ordens.filter(ordem => {
    const matchBusca = 
      (ordem.cliente_nome && ordem.cliente_nome.toLowerCase().includes(busca.toLowerCase())) ||
      (ordem.profissional_nome && ordem.profissional_nome.toLowerCase().includes(busca.toLowerCase())) ||
      (ordem.id.toString().includes(busca));
    
    const matchStatus = filtroStatus ? ordem.status === filtroStatus : true;
    const matchCliente = filtroCliente ? ordem.cliente_id.toString() === filtroCliente : true;
    
    return matchBusca && matchStatus && matchCliente;
  });

  return (
    <DashboardLayout title="Ordens de Serviço" activeItem="ordens de serviço">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/ordens/nova')}
        >
          <i className="fas fa-plus mr-2"></i>
          Nova Ordem
        </button>
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
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Buscar ordem..."
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
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <select 
              className="form-select"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            >
              <option value="">Todos os clientes</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando ordens de serviço...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Cliente</th>
                  <th className="table-header-cell">Profissional</th>
                  <th className="table-header-cell">Data Cadastro</th>
                  <th className="table-header-cell">Data Entrega</th>
                  <th className="table-header-cell">Urgência</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Valor</th>
                  <th className="table-header-cell">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {ordensFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="table-cell text-center">
                      Nenhuma ordem de serviço encontrada.
                    </td>
                  </tr>
                ) : (
                  ordensFiltradas.map((ordem) => (
                    <tr key={ordem.id} className="table-row">
                      <td className="table-cell">{ordem.id}</td>
                      <td className="table-cell font-medium">{ordem.cliente_nome}</td>
                      <td className="table-cell">{ordem.profissional_nome || '-'}</td>
                      <td className="table-cell">{new Date(ordem.data_cadastro).toLocaleDateString('pt-BR')}</td>
                      <td className="table-cell">{ordem.data_entrega ? new Date(ordem.data_entrega).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="table-cell">
                        {ordem.urgencia ? (
                          <span className="badge badge-danger">Urgente</span>
                        ) : (
                          <span className="badge badge-info">Normal</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="relative">
                          {getStatusBadge(ordem.status)}
                          {ordem.status !== 'cancelado' && ordem.status !== 'entregue' && (
                            <div className="group relative">
                              <button className="ml-1 text-gray-500 hover:text-gray-700">
                                <i className="fas fa-caret-down"></i>
                              </button>
                              <div className="absolute hidden group-hover:block right-0 mt-1 bg-white border rounded shadow-lg z-10">
                                <ul className="py-1">
                                  {ordem.status !== 'pendente' && (
                                    <li>
                                      <button 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={() => handleStatusChange(ordem.id, 'pendente')}
                                      >
                                        Pendente
                                      </button>
                                    </li>
                                  )}
                                  {ordem.status !== 'em_andamento' && (
                                    <li>
                                      <button 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={() => handleStatusChange(ordem.id, 'em_andamento')}
                                      >
                                        Em Andamento
                                      </button>
                                    </li>
                                  )}
                                  {ordem.status !== 'concluido' && (
                                    <li>
                                      <button 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={() => handleStatusChange(ordem.id, 'concluido')}
                                      >
                                        Concluído
                                      </button>
                                    </li>
                                  )}
                                  {ordem.status !== 'entregue' && (
                                    <li>
                                      <button 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        onClick={() => handleStatusChange(ordem.id, 'entregue')}
                                      >
                                        Entregue
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">R$ {ordem.valor_total ? ordem.valor_total.toFixed(2) : '0.00'}</td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            title="Editar"
                            onClick={() => router.push(`/ordens/${ordem.id}/editar`)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800" 
                            title="Ver detalhes"
                            onClick={() => router.push(`/ordens/${ordem.id}`)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {ordem.status !== 'cancelado' && (
                            <button 
                              className="text-red-600 hover:text-red-800" 
                              title="Cancelar"
                              onClick={() => handleStatusChange(ordem.id, 'cancelado')}
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
