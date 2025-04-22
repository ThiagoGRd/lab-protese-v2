"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function ServicosPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoAtual, setServicoAtual] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    ativo: true
  });

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/servicos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar serviços');
      }
      
      const data = await response.json();
      setServicos(data.servicos);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar os serviços. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (servico = null) => {
    if (servico) {
      setServicoAtual(servico);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao || '',
        preco: servico.preco.toString(),
        ativo: servico.ativo
      });
    } else {
      setServicoAtual(null);
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        ativo: true
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setServicoAtual(null);
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      ativo: true
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        preco: parseFloat(formData.preco)
      };
      
      let response;
      
      if (servicoAtual) {
        // Atualizar serviço existente
        response = await fetch(`/api/servicos/${servicoAtual.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Criar novo serviço
        response = await fetch('/api/servicos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar serviço');
      }
      
      // Recarregar a lista de serviços
      await carregarServicos();
      
      // Fechar o modal
      fecharModal();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao salvar serviço. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/servicos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir serviço');
      }
      
      // Recarregar a lista de serviços
      await carregarServicos();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao excluir serviço. Por favor, tente novamente.');
    }
  };

  return (
    <DashboardLayout title="Serviços" activeItem="serviços">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tabela de Serviços</h1>
        <button 
          className="btn btn-primary"
          onClick={() => abrirModal()}
        >
          <i className="fas fa-plus mr-2"></i>
          Novo Serviço
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
        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando serviços...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Nome</th>
                  <th className="table-header-cell">Descrição</th>
                  <th className="table-header-cell">Preço (R$)</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {servicos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-cell text-center">
                      Nenhum serviço cadastrado.
                    </td>
                  </tr>
                ) : (
                  servicos.map((servico) => (
                    <tr key={servico.id} className="table-row">
                      <td className="table-cell">{servico.id}</td>
                      <td className="table-cell font-medium">{servico.nome}</td>
                      <td className="table-cell">{servico.descricao || '-'}</td>
                      <td className="table-cell">{servico.preco.toFixed(2)}</td>
                      <td className="table-cell">
                        {servico.ativo ? (
                          <span className="badge badge-success">Ativo</span>
                        ) : (
                          <span className="badge badge-danger">Inativo</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => abrirModal(servico)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(servico.id)}
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

      {/* Modal para adicionar/editar serviço */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {servicoAtual ? 'Editar Serviço' : 'Adicionar Serviço'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    name="nome"
                    className="form-input" 
                    placeholder="Nome do serviço"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea 
                    name="descricao"
                    className="form-input" 
                    placeholder="Descrição do serviço"
                    value={formData.descricao}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Preço (R$)</label>
                  <input 
                    type="number" 
                    name="preco"
                    step="0.01" 
                    className="form-input" 
                    placeholder="0.00"
                    value={formData.preco}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <input 
                      type="checkbox" 
                      name="ativo"
                      className="mr-2"
                      checked={formData.ativo}
                      onChange={handleChange}
                    />
                    Ativo
                  </label>
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
