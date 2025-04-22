import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function RelatoriosPage() {
  // Dados de exemplo para os relatórios
  const relatorios = [
    { 
      id: 1, 
      nome: 'Relatório Financeiro Mensal', 
      descricao: 'Resumo de contas a pagar e receber do mês',
      tipo: 'financeiro',
      ultima_geracao: '15/04/2025'
    },
    { 
      id: 2, 
      nome: 'Relatório de Produção', 
      descricao: 'Trabalhos executados por período',
      tipo: 'producao',
      ultima_geracao: '10/04/2025'
    },
    { 
      id: 3, 
      nome: 'Relatório de Estoque', 
      descricao: 'Situação atual do estoque de materiais',
      tipo: 'estoque',
      ultima_geracao: '18/04/2025'
    },
    { 
      id: 4, 
      nome: 'Relatório de Clientes', 
      descricao: 'Lista de clientes e volume de trabalhos',
      tipo: 'clientes',
      ultima_geracao: '05/04/2025'
    },
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'financeiro':
        return <i className="fas fa-money-bill text-green-600"></i>;
      case 'producao':
        return <i className="fas fa-clipboard-list text-blue-600"></i>;
      case 'estoque':
        return <i className="fas fa-box text-yellow-600"></i>;
      case 'clientes':
        return <i className="fas fa-users text-purple-600"></i>;
      default:
        return <i className="fas fa-file-alt text-gray-600"></i>;
    }
  };

  return (
    <DashboardLayout title="Relatórios" activeItem="relatórios">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios para acompanhar o desempenho do seu laboratório</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-800">Financeiro</h2>
            <i className="fas fa-money-bill-wave text-blue-500 text-xl"></i>
          </div>
          <p className="text-sm text-gray-600 mb-4">Relatórios de contas a pagar, contas a receber e fluxo de caixa.</p>
          <button className="btn btn-primary w-full">Gerar Relatório</button>
        </div>

        <div className="card p-6 bg-green-50 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-green-800">Produção</h2>
            <i className="fas fa-clipboard-list text-green-500 text-xl"></i>
          </div>
          <p className="text-sm text-gray-600 mb-4">Relatórios de trabalhos executados, em andamento e pendentes.</p>
          <button className="btn btn-success w-full">Gerar Relatório</button>
        </div>

        <div className="card p-6 bg-yellow-50 border border-yellow-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-yellow-800">Estoque</h2>
            <i className="fas fa-box text-yellow-500 text-xl"></i>
          </div>
          <p className="text-sm text-gray-600 mb-4">Relatórios de materiais em estoque, consumo e necessidade de reposição.</p>
          <button className="btn btn-warning w-full">Gerar Relatório</button>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Relatórios Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Nome</th>
                <th className="table-header-cell">Descrição</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Última Geração</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {relatorios.map((relatorio) => (
                <tr key={relatorio.id} className="table-row">
                  <td className="table-cell">{relatorio.id}</td>
                  <td className="table-cell font-medium">{relatorio.nome}</td>
                  <td className="table-cell">{relatorio.descricao}</td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getTipoIcon(relatorio.tipo)}
                      <span className="ml-2 capitalize">{relatorio.tipo}</span>
                    </div>
                  </td>
                  <td className="table-cell">{relatorio.ultima_geracao}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Visualizar">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="Baixar">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="text-purple-600 hover:text-purple-800" title="Enviar por e-mail">
                        <i className="fas fa-envelope"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Relatório Personalizado</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label className="form-label">Tipo de Relatório</label>
              <select className="form-select">
                <option value="">Selecione um tipo</option>
                <option value="financeiro">Financeiro</option>
                <option value="producao">Produção</option>
                <option value="estoque">Estoque</option>
                <option value="clientes">Clientes</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Formato</label>
              <select className="form-select">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Data Inicial</label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Data Final</label>
              <input type="date" className="form-input" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary">
              <i className="fas fa-file-export mr-2"></i>
              Gerar Relatório Personalizado
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
