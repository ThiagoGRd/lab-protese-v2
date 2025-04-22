'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function DashboardPage() {
  const [estatisticas, setEstatisticas] = useState({
    ordensAtivas: 0,
    ordensUrgentes: 0,
    ordensFinalizadas: 0,
    clientesAtivos: 0,
    contasReceber: 0,
    contasPagar: 0,
    materiaisEstoqueBaixo: 0
  });
  
  const [ordensRecentes, setOrdensRecentes] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  
  useEffect(() => {
    // Carregar dados do dashboard
    const carregarDados = async () => {
      try {
        // Simulando dados para demonstração
        setEstatisticas({
          ordensAtivas: 4,
          ordensUrgentes: 2,
          ordensFinalizadas: 8,
          clientesAtivos: 5,
          contasReceber: 2320.00,
          contasPagar: 1850.00,
          materiaisEstoqueBaixo: 2
        });
        
        setOrdensRecentes([
          { 
            id: 9, 
            clinica: 'Odontologia Especializada', 
            tipoServico: 'Prótese total', 
            dataCadastro: '2025-03-20', 
            dataEntrega: '2025-03-27', 
            status: 'pendente',
            urgencia: true
          },
          { 
            id: 10, 
            clinica: 'Centro Odontológico Bem Estar', 
            tipoServico: 'Provisório em resina impressa', 
            dataCadastro: '2025-03-25', 
            dataEntrega: '2025-03-28', 
            status: 'pendente',
            urgencia: false
          },
          { 
            id: 11, 
            clinica: 'Clínica Dental Care', 
            tipoServico: 'Prótese total', 
            dataCadastro: '2025-04-01', 
            dataEntrega: '2025-04-08', 
            status: 'em_producao',
            urgencia: true
          },
          { 
            id: 12, 
            clinica: 'Consultório Dr. Silva', 
            tipoServico: 'Prótese parcial removível', 
            dataCadastro: '2025-04-05', 
            dataEntrega: '2025-04-12', 
            status: 'em_producao',
            urgencia: false
          }
        ]);
        
        setNotificacoes([
          { 
            id: 1, 
            titulo: 'Ordem de serviço urgente', 
            mensagem: 'Nova ordem de serviço urgente da Clínica Odontológica Sorriso Perfeito.', 
            data: '2025-04-22T08:30:00', 
            tipo: 'urgente'
          },
          { 
            id: 2, 
            titulo: 'Estoque baixo de Zircônia', 
            mensagem: 'O estoque de Zircônia está abaixo do mínimo. Considere fazer um novo pedido.', 
            data: '2025-04-21T14:15:00', 
            tipo: 'estoque'
          },
          { 
            id: 3, 
            titulo: 'Conta a receber atrasada', 
            mensagem: 'A conta a receber da Clínica Dental Care está atrasada há 5 dias.', 
            data: '2025-04-20T10:45:00', 
            tipo: 'financeiro'
          }
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    carregarDados();
  }, []);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao ProTech Lab - Sistema de Gestão para Laboratório de Prótese</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ordens Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.ordensAtivas}</div>
              <p className="text-xs text-gray-500">
                {estatisticas.ordensUrgentes} urgentes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ordens Finalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.ordensFinalizadas}</div>
              <p className="text-xs text-gray-500">
                nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.clientesAtivos}</div>
              <p className="text-xs text-gray-500">
                com ordens em andamento
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Materiais com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estatisticas.materiaisEstoqueBaixo}</div>
              <p className="text-xs text-gray-500">
                abaixo do mínimo
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">A Receber:</span>
                  <span className="font-semibold text-green-600">R$ {estatisticas.contasReceber.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">A Pagar:</span>
                  <span className="font-semibold text-red-600">R$ {estatisticas.contasPagar.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600 font-medium">Saldo:</span>
                  <span className={`font-bold ${estatisticas.contasReceber - estatisticas.contasPagar >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {(estatisticas.contasReceber - estatisticas.contasPagar).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/financeiro'}
                >
                  Ver Detalhes Financeiros
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificacoes.length > 0 ? (
                  notificacoes.map((notificacao) => (
                    <div key={notificacao.id} className={`
                      p-3 rounded-md text-sm
                      ${notificacao.tipo === 'urgente' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}
                      ${notificacao.tipo === 'estoque' ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''}
                      ${notificacao.tipo === 'financeiro' ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''}
                    `}>
                      <div className="font-medium">{notificacao.titulo}</div>
                      <div className="text-gray-600 mt-1">{notificacao.mensagem}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notificacao.data).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Nenhuma notificação recente.
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/notificacoes'}
                >
                  Ver Todas as Notificações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">ID</th>
                    <th className="text-left py-2 px-3 font-medium">Clínica</th>
                    <th className="text-left py-2 px-3 font-medium">Serviço</th>
                    <th className="text-left py-2 px-3 font-medium">Data Cadastro</th>
                    <th className="text-left py-2 px-3 font-medium">Entrega</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-left py-2 px-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ordensRecentes.map((ordem) => (
                    <tr key={ordem.id} className={`border-b ${ordem.urgencia ? 'bg-red-50' : ''}`}>
                      <td className="py-2 px-3">{ordem.id}</td>
                      <td className="py-2 px-3 font-medium">{ordem.clinica}</td>
                      <td className="py-2 px-3">{ordem.tipoServico}</td>
                      <td className="py-2 px-3">{formatarData(ordem.dataCadastro)}</td>
                      <td className="py-2 px-3">{formatarData(ordem.dataEntrega)}</td>
                      <td className="py-2 px-3">
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium w-fit
                          ${ordem.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${ordem.status === 'em_producao' ? 'bg-blue-100 text-blue-800' : ''}
                          ${ordem.status === 'concluido' ? 'bg-green-100 text-green-800' : ''}
                          ${ordem.status === 'entregue' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {ordem.status === 'pendente' ? 'Pendente' : ''}
                          {ordem.status === 'em_producao' ? 'Em Produção' : ''}
                          {ordem.status === 'concluido' ? 'Concluído' : ''}
                          {ordem.status === 'entregue' ? 'Entregue' : ''}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/ordens?id=${ordem.id}`}
                        >
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/ordens'}
              >
                Ver Todas as Ordens
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
