"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'clinica',
    endereco: '',
    telefone: '',
    email: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/clientes');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }
      
      const data = await response.json();
      setClientes(data.clientes);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar os clientes. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (cliente = null) => {
    if (cliente) {
      setClienteAtual(cliente);
      setFormData({
        nome: cliente.nome,
        tipo: cliente.tipo || 'clinica',
        endereco: cliente.endereco || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        observacoes: cliente.observacoes || ''
      });
    } else {
      setClienteAtual(null);
      setFormData({
        nome: '',
        tipo: 'clinica',
        endereco: '',
        telefone: '',
        email: '',
        observacoes: ''
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setClienteAtual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (clienteAtual) {
        // Atualizar cliente existente
        response = await fetch(`/api/clientes/${clienteAtual.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Criar novo cliente
        response = await fetch('/api/clientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar cliente');
      }
      
      // Recarregar a lista de clientes
      await carregarClientes();
      
      // Fechar o modal
      fecharModal();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao salvar cliente. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir cliente');
      }
      
      // Recarregar a lista de clientes
      await carregarClientes();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao excluir cliente. Por favor, tente novamente.');
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
                      (cliente.telefone && cliente.telefone.includes(busca));
    
    const matchTipo = filtroTipo ? cliente.tipo === filtroTipo : true;
    
    return matchBusca && matchTipo;
  });

  return (
    <DashboardLayout title="Clientes" activeItem="clientes">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cadastro de Clientes</h1>
        <button 
          className="btn btn-primary"
          onClick={() => abrirModal()}
        >
          <i className="fas fa-plus mr-2"></i>
          Novo Cliente
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
        <div className="mb-4 flex">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="form-input pl-10"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="ml-2">
            <select 
              className="form-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="clinica">Clínica</option>
              <option value="profissional">Profissional</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando clientes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Nome</th>
                  <th className="table-header-cell">Tipo</th>
                  <th className="table-header-cell">Telefone</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-cell text-center">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="table-row">
                      <td className="table-cell">{cliente.id}</td>
                      <td className="table-cell font-medium">{cliente.nome}</td>
                      <td className="table-cell">
                        {cliente.tipo === 'clinica' ? (
                          <span className="badge badge-info">Clínica</span>
                        ) : (
                          <span className="badge badge-success">Profissional</span>
                        )}
                      </td>
                      <td className="table-cell">{cliente.telefone || '-'}</td>
                      <td className="table-cell">{cliente.email || '-'}</td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => abrirModal(cliente)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800"
                            onClick={() => router.push(`/clientes/${cliente.id}/profissionais`)}
                            title="Profissionais"
                          >
                            <i className="fas fa-user-md"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(cliente.id)}
                            title="Excluir"
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
          </div>
        )}
      </div>

      {/* Modal para adicionar/editar cliente */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {clienteAtual ? 'Editar Cliente' : 'Adicionar Cliente'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    name="nome"
                    className="form-input" 
                    placeholder="Nome do cliente ou clínica"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select 
                    name="tipo"
                    className="form-select"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="clinica">Clínica</option>
                    <option value="profissional">Profissional</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Endereço</label>
                  <input 
                    type="text" 
                    name="endereco"
                    className="form-input" 
                    placeholder="Endereço completo"
                    value={formData.endereco}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input 
                    type="text" 
                    name="telefone"
                    className="form-input" 
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea 
                    name="observacoes"
                    className="form-input" 
                    placeholder="Observações adicionais"
                    value={formData.observacoes}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={fecharModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
