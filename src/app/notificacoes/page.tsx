'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Bell } from 'lucide-react';

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [activeTab, setActiveTab] = useState('todas');

  useEffect(() => {
    // Carregar notificações do backend
    const carregarNotificacoes = async () => {
      try {
        // Simulando dados para demonstração
        const dadosSimulados = [
          { 
            id: 1, 
            titulo: 'Ordem de serviço urgente', 
            mensagem: 'Nova ordem de serviço urgente da Clínica Odontológica Sorriso Perfeito.', 
            data: '2025-04-22T08:30:00', 
            tipo: 'urgente',
            lida: false
          },
          { 
            id: 2, 
            titulo: 'Estoque baixo de Zircônia', 
            mensagem: 'O estoque de Zircônia está abaixo do mínimo. Considere fazer um novo pedido.', 
            data: '2025-04-21T14:15:00', 
            tipo: 'estoque',
            lida: false
          },
          { 
            id: 3, 
            titulo: 'Conta a receber atrasada', 
            mensagem: 'A conta a receber da Clínica Dental Care está atrasada há 5 dias.', 
            data: '2025-04-20T10:45:00', 
            tipo: 'financeiro',
            lida: true
          },
          { 
            id: 4, 
            titulo: 'Ordem de serviço concluída', 
            mensagem: 'A ordem de serviço #3 foi marcada como concluída e está pronta para entrega.', 
            data: '2025-04-19T16:20:00', 
            tipo: 'ordem',
            lida: true
          },
          { 
            id: 5, 
            titulo: 'Novo cliente cadastrado', 
            mensagem: 'Um novo cliente foi cadastrado: Centro Odontológico Bem Estar.', 
            data: '2025-04-18T09:10:00', 
            tipo: 'cliente',
            lida: true
          }
        ];
        setNotificacoes(dadosSimulados);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    carregarNotificacoes();
  }, []);

  const handleMarcarComoLida = (id) => {
    const notificacoesAtualizadas = notificacoes.map(notificacao => 
      notificacao.id === id ? { ...notificacao, lida: true } : notificacao
    );
    setNotificacoes(notificacoesAtualizadas);
  };

  const handleMarcarTodasComoLidas = () => {
    const notificacoesAtualizadas = notificacoes.map(notificacao => 
      ({ ...notificacao, lida: true })
    );
    setNotificacoes(notificacoesAtualizadas);
  };

  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'nao_lidas') return !notificacao.lida;
    if (activeTab === 'urgentes') return notificacao.tipo === 'urgente';
    if (activeTab === 'estoque') return notificacao.tipo === 'estoque';
    if (activeTab === 'financeiro') return notificacao.tipo === 'financeiro';
    return true;
  });

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Notificações</h1>
          <Button 
            onClick={handleMarcarTodasComoLidas}
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            disabled={notificacoesNaoLidas === 0}
          >
            Marcar todas como lidas
          </Button>
        </div>

        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-blue-800">Centro de Notificações</h3>
                  <p className="text-blue-600">
                    Você tem {notificacoesNaoLidas} notificação{notificacoesNaoLidas !== 1 ? 'ões' : ''} não lida{notificacoesNaoLidas !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todas" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="nao_lidas">Não Lidas ({notificacoesNaoLidas})</TabsTrigger>
            <TabsTrigger value="urgentes">Urgentes</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {notificacoesFiltradas.length > 0 ? (
                notificacoesFiltradas.map((notificacao) => (
                  <Alert key={notificacao.id} className={`
                    ${!notificacao.lida ? 'bg-blue-50 border-blue-200' : ''}
                    ${notificacao.tipo === 'urgente' ? 'border-l-4 border-l-red-500' : ''}
                    ${notificacao.tipo === 'estoque' ? 'border-l-4 border-l-yellow-500' : ''}
                    ${notificacao.tipo === 'financeiro' ? 'border-l-4 border-l-purple-500' : ''}
                    ${notificacao.tipo === 'ordem' ? 'border-l-4 border-l-green-500' : ''}
                    ${notificacao.tipo === 'cliente' ? 'border-l-4 border-l-blue-500' : ''}
                  `}>
                    <div className="flex justify-between items-start">
                      <div>
                        <AlertTitle className="text-lg font-semibold">
                          {notificacao.titulo}
                          {!notificacao.lida && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                              Nova
                            </span>
                          )}
                        </AlertTitle>
                        <AlertDescription className="mt-2">
                          <p className="text-gray-700">{notificacao.mensagem}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatarData(notificacao.data)}</p>
                        </AlertDescription>
                      </div>
                      {!notificacao.lida && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarcarComoLida(notificacao.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma notificação encontrada nesta categoria.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
