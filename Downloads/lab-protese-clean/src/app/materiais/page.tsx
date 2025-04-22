"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function MateriaisPage() {
  const router = useRouter();
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [ajusteEstoqueModalAberto, setAjusteEstoqueModalAberto] = useState(false);
  const [materialAtual, setMaterialAtual] = useState(null);
  const [filtroEstoque, setFiltroEstoque] = useState('');
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    quantidade: '',
    unidade: '',
    preco_unitario: '',
    estoque_minimo: ''
  });
  const [ajusteEstoqueData, setAjusteEstoqueData] = useState({
    quantidade: '',
    tipo: 'entrada'
  });

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/materiais');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar materiais');
      }
      
      const data = await response.json();
      setMateriais(data.materiais);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível carregar os materiais. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModal = (material = null) => {
    if (material) {
      setMaterialAtual(material);
      setFormData({
        nome: material.nome,
        descricao: material.descricao || '',
        quantidade: material.quantidade.toString(),
        unidade: material.unidade,
        preco_unitario: material.preco_unitario ? material.preco_unitario.toString() : '',
        estoque_minimo: material.estoque_minimo ? material.estoque_minimo.toString() : ''
      });
    } else {
      setMaterialAtual(null);
      setFormData({
        nome: '',
        descricao: '',
        quantidade: '',
        unidade: '',
        preco_unitario: '',
        estoque_minimo: ''
      });
    }
    setModalAberto(true);
  };

  const abrirAjusteEstoqueModal = (material) => {
    setMaterialAtual(material);
    setAjusteEstoqueData({
      quantidade: '',
      tipo: 'entrada'
    });
    setAjusteEstoqueModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setMaterialAtual(null);
  };

  const fecharAjusteEstoqueModal = () => {
    setAjusteEstoqueModalAberto(false);
    setMaterialAtual(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAjusteEstoqueChange = (e) => {
    const { name, value } = e.target;
    setAjusteEstoqueData({
      ...ajusteEstoqueData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        quantidade: parseFloat(formData.quantidade),
        preco_unitario: formData.preco_unitario ? parseFloat(formData.preco_unitario) : null,
        estoque_minimo: formData.estoque_minimo ? parseFloat(formData.estoque_minimo) : null
      };
      
      let response;
      
      if (materialAtual) {
        // Atualizar material existente
        response = await fetch(`/api/materiais/${materialAtual.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Criar novo material
        response = await fetch('/api/materiais', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar material');
      }
      
      // Recarregar a lista de materiais
      await carregarMateriais();
      
      // Fechar o modal
      fecharModal();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao salvar material. Por favor, tente novamente.');
    }
  };

  const handleAjusteEstoqueSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!ajusteEstoqueData.quantidade || parseFloat(ajusteEstoqueData.quantidade) <= 0) {
        throw new Error('A quantidade deve ser maior que zero');
      }
      
      // Calcular a quantidade a ser ajustada
      let quantidadeAjuste = parseFloat(ajusteEstoqueData.quantidade);
      if (ajusteEstoqueData.tipo === 'saida') {
        quantidadeAjuste = -quantidadeAjuste;
      }
      
      // Verificar se há estoque suficiente para saída
      if (ajusteEstoqueData.tipo === 'saida' && materialAtual.quantidade < Math.abs(quantidadeAjuste)) {
        throw new Error('Estoque insuficiente para esta saída');
      }
      
      // Calcular nova quantidade
      const novaQuantidade = materialAtual.quantidade + quantidadeAjuste;
      
      // Atualizar material
      const response = await fetch(`/api/materiais/${materialAtual.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantidade: novaQuantidade
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao ajustar estoque');
      }
      
      // Recarregar a lista de materiais
      await carregarMateriais();
      
      // Fechar o modal
      fecharAjusteEstoqueModal();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao ajustar estoque. Por favor, tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este material?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/materiais/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir material');
      }
      
      // Recarregar a lista de materiais
      await carregarMateriais();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao excluir material. Por favor, tente novamente.');
    }
  };

  const getEstoqueStatus = (quantidade, estoque_minimo) => {
    if (quantidade <= 0) {
      return <span className="badge badge-danger">Esgotado</span>;
    } else if (estoque_minimo && quantidade <= estoque_minimo) {
      return <span className="badge badge-warning">Baixo</span>;
    } else {
      return <span className="badge badge-success">Normal</span>;
    }
  };

  const materiaisFiltrados = materiais.filter(material => {
    const matchBusca = 
      material.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (material.descricao && material.descricao.toLowerCase().includes(busca.toLowerCase()));
    
    let matchEstoque = true;
    if (filtroEstoque === 'baixo') {
      matchEstoque = material.estoque_minimo && material.quantidade <= material.estoque_minimo;
    } else if (filtroEstoque === 'normal') {
      matchEstoque = !material.estoque_minimo || material.quantidade > material.estoque_minimo;
    } else if (filtroEstoque === 'esgotado') {
      matchEstoque = material.quantidade <= 0;
    }
    
    return matchBusca && matchEstoque;
  });

  return (
    <DashboardLayout title="Controle de Materiais" activeItem="materiais">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Controle de Estoque</h1>
        <div className="flex space-x-2">
          <button className="btn btn-secondary">
            <i className="fas fa-download mr-2"></i>
            Relatório
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => abrirModal()}
          >
            <i className="fas fa-plus mr-2"></i>
            Novo Material
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
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar material..."
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
              value={filtroEstoque}
              onChange={(e) => setFiltroEstoque(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="baixo">Estoque Baixo</option>
              <option value="normal">Estoque Normal</option>
              <option value="esgotado">Esgotado</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="p-4 text-center">
            <p>Carregando materiais...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Nome</th>
                  <th className="table-header-cell">Descrição</th>
                  <th className="table-header-cell">Quantidade</th>
                  <th className="table-header-cell">Unidade</th>
                  <th className="table-header-cell">Preço Unit.</th>
                  <th className="table-header-cell">Estoque Mín.</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {materiaisFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="table-cell text-center">
                      Nenhum material encontrado.
                    </td>
                  </tr>
                ) : (
                  materiaisFiltrados.map((material) => (
                    <tr key={material.id} className="table-row">
                      <td className="table-cell">{material.id}</td>
                      <td className="table-cell font-medium">{material.nome}</td>
                      <td className="table-cell">{material.descricao || '-'}</td>
                      <td className="table-cell">{material.quantidade}</td>
                      <td className="table-cell">{material.unidade}</td>
                      <td className="table-cell">
                        {material.preco_unitario ? `R$ ${material.preco_unitario.toFixed(2)}` : '-'}
                      </td>
                      <td className="table-cell">{material.estoque_minimo || '-'}</td>
                      <td className="table-cell">
                        {getEstoqueStatus(material.quantidade, material.estoque_minimo)}
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800" 
                            title="Editar"
                            onClick={() => abrirModal(material)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-800" 
                            title="Ajustar estoque"
                            onClick={() => abrirAjusteEstoqueModal(material)}
                          >
                            <i className="fas fa-plus-minus"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800" 
                            title="Excluir"
                            onClick={() => handleDelete(material.id)}
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

      {/* Modal para adicionar/editar material */}
      {modalAberto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {materialAtual ? 'Editar Material' : 'Adicionar Material'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    name="nome"
                    className="form-input" 
                    placeholder="Nome do material"
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
                    placeholder="Descrição do material"
                    value={formData.descricao}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Quantidade</label>
                    <input 
                      type="number" 
                      name="quantidade"
                      step="0.01" 
                      className="form-input" 
                      placeholder="0"
                      value={formData.quantidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Unidade</label>
                    <input 
                      type="text" 
                      name="unidade"
                      className="form-input" 
                      placeholder="unidade, kg, litro, etc."
                      value={formData.unidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Preço Unitário (R$)</label>
                    <input 
                      type="number" 
                      name="preco_unitario"
                      step="0.01" 
                      className="form-input" 
                      placeholder="0.00"
                      value={formData.preco_unitario}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Estoque Mínimo</label>
                    <input 
                      type="number" 
                      name="estoque_minimo"
                      step="0.01" 
                      className="form-input" 
                      placeholder="0"
                      value={formData.estoque_minimo}
                      onChange={handleChange}
                    />
                  </div>
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

      {/* Modal para ajuste de estoque */}
      {ajusteEstoqueModalAberto && materialAtual && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Ajustar Estoque - {materialAtual.nome}
              </h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Estoque atual: {materialAtual.quantidade} {materialAtual.unidade}</p>
              </div>
              
              <form onSubmit={handleAjusteEstoqueSubmit}>
                <div className="form-group">
                  <label className="form-label">Tipo de Ajuste</label>
                  <select 
                    name="tipo"
                    className="form-select"
                    value={ajusteEstoqueData.tipo}
                    onChange={handleAjusteEstoqueChange}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Quantidade</label>
                  <input 
                    type="number" 
                    name="quantidade"
                    step="0.01" 
                    className="form-input" 
                    placeholder="0"
                    value={ajusteEstoqueData.quantidade}
                    onChange={handleAjusteEstoqueChange}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={fecharAjusteEstoqueModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Confirmar Ajuste
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
