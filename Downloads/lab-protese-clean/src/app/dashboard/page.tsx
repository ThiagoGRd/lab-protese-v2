import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  // Dados de exemplo para o dashboard
  const estatisticas = [
    { titulo: 'Ordens Pendentes', valor: 12, icone: 'clipboard-list', cor: 'bg-blue-500' },
    { titulo: 'Ordens Urgentes', valor: 3, icone: 'exclamation-circle', cor: 'bg-red-500' },
    { titulo: 'Entregas Hoje', valor: 5, icone: 'truck', cor: 'bg-green-500' },
    { titulo: 'Contas a Receber', valor: 'R$ 3.250,00', icone: 'money-bill', cor: 'bg-yellow-500' },
  ];

  const ordensRecentes = [
    { id: 1, cliente: 'Clínica Odonto Saúde', servico: 'Prótese Total', data: '21/04/2025', status: 'pendente' },
    { id: 2, cliente: 'Dr. Carlos Silva', servico: 'Prótese Parcial Removível', data: '20/04/2025', status: 'em_andamento' },
    { id: 3, cliente: 'Clínica Sorrisos', servico: 'Protocolo de Implantes Total', data: '19/04/2025', status: 'concluido' },
    { id: 4, cliente: 'Dra. Ana Beatriz', servico: 'Provisório em Resina Impressa', data: '18/04/2025', status: 'entregue' },
  ];

  const contasRecentes = [
    { id: 1, descricao: 'Clínica Odonto Saúde', valor: 'R$ 450,00', vencimento: '25/04/2025', status: 'pendente' },
    { id: 2, descricao: 'Dr. Carlos Silva', valor: 'R$ 520,00', vencimento: '23/04/2025', status: 'pendente' },
    { id: 3, descricao: 'Clínica Sorrisos', valor: 'R$ 1.350,00', vencimento: '15/04/2025', status: 'atrasado' },
    { id: 4, descricao: 'Dra. Ana Beatriz', valor: 'R$ 50,00', vencimento: '10/04/2025', status: 'pago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <span className="badge badge-warning">Pendente</span>;
      case 'em_andamento':
        return <span className="badge badge-info">Em Andamento</span>;
      case 'concluido':
        return <span className="badge badge-success">Concluído</span>;
      case 'entregue':
        return <span className="badge badge-success">Entregue</span>;
      case 'atrasado':
        return <span className="badge badge-danger">Atrasado</span>;
      case 'pago':
        return <span className="badge badge-success">Pago</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <DashboardLayout title="Dashboard" activeItem="dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {estatisticas.map((item, index) => (
          <div key={index} className="card flex items-center p-6">
            <div className={`${item.cor} p-3 rounded-full mr-4`}>
              <i className={`fas fa-${item.icone} text-white text-xl`}></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{item.valor}</h3>
              <p className="text-gray-500">{item.titulo}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ordens de Serviço Recentes</h2>
            <a href="/ordens" className="text-blue-600 hover:text-blue-800 text-sm">Ver todas</a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Cliente</th>
                  <th className="table-header-cell">Serviço</th>
                  <th className="table-header-cell">Data</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {ordensRecentes.map((ordem) => (
                  <tr key={ordem.id} className="table-row">
                    <td className="table-cell">{ordem.id}</td>
                    <td className="table-cell">{ordem.cliente}</td>
                    <td className="table-cell">{ordem.servico}</td>
                    <td className="table-cell">{ordem.data}</td>
                    <td className="table-cell">{getStatusBadge(ordem.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Contas a Receber</h2>
            <a href="/financeiro/receber" className="text-blue-600 hover:text-blue-800 text-sm">Ver todas</a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Descrição</th>
                  <th className="table-header-cell">Valor</th>
                  <th className="table-header-cell">Vencimento</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {contasRecentes.map((conta) => (
                  <tr key={conta.id} className="table-row">
                    <td className="table-cell">{conta.id}</td>
                    <td className="table-cell">{conta.descricao}</td>
                    <td className="table-cell">{conta.valor}</td>
                    <td className="table-cell">{conta.vencimento}</td>
                    <td className="table-cell">{getStatusBadge(conta.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notificações Recentes</h2>
          <a href="/notificacoes" className="text-blue-600 hover:text-blue-800 text-sm">Ver todas</a>
        </div>
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <i className="fas fa-exclamation-circle text-red-600"></i>
            </div>
            <div>
              <p className="font-medium">Ordem de Serviço #2 marcada como urgente</p>
              <p className="text-sm text-gray-500">Há 2 horas</p>
            </div>
          </li>
          <li className="py-3 flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <i className="fas fa-money-bill text-yellow-600"></i>
            </div>
            <div>
              <p className="font-medium">Conta a receber vencida: Clínica Sorrisos</p>
              <p className="text-sm text-gray-500">Há 1 dia</p>
            </div>
          </li>
          <li className="py-3 flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <i className="fas fa-box text-blue-600"></i>
            </div>
            <div>
              <p className="font-medium">Estoque baixo: Zircônia</p>
              <p className="text-sm text-gray-500">Há 2 dias</p>
            </div>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
