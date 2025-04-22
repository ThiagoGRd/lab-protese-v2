'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState('financeiro');
  const [periodoInicio, setPeriodoInicio] = useState('2025-01-01');
  const [periodoFim, setPeriodoFim] = useState(new Date().toISOString().split('T')[0]);
  const [relatorioGerado, setRelatorioGerado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGerarRelatorio = () => {
    setIsLoading(true);
    
    // Simulando tempo de processamento
    setTimeout(() => {
      if (activeTab === 'financeiro') {
        setRelatorioGerado({
          tipo: 'financeiro',
          dados: {
            totalRecebido: 5320.00,
            totalPago: 4850.00,
            saldo: 470.00,
            contasReceber: [
              { id: 1, descricao: 'Prótese total', valor: 450.00, dataVencimento: '2025-03-10', status: 'pago', cliente: 'Clínica Odontológica Sorriso Perfeito' },
              { id: 2, descricao: 'Prótese parcial removível', valor: 520.00, dataVencimento: '2025-03-15', status: 'pago', cliente: 'Consultório Dr. Silva' },
              { id: 3, descricao: 'Protocolo de implantes', valor: 1350.00, dataVencimento: '2025-03-20', status: 'pendente', cliente: 'Odontologia Especializada' },
              { id: 4, descricao: 'Provisório em resina', valor: 50.00, dataVencimento: '2025-02-28', status: 'pago', cliente: 'Centro Odontológico Bem Estar' },
              { id: 5, descricao: 'Prótese total', valor: 450.00, dataVencimento: '2025-02-15', status: 'pago', cliente: 'Clínica Dental Care' },
              { id: 6, descricao: 'Protocolo de implantes', valor: 1350.00, dataVencimento: '2025-02-10', status: 'pago', cliente: 'Consultório Dra. Ana' },
              { id: 7, descricao: 'Prótese parcial removível', valor: 520.00, dataVencimento: '2025-04-05', status: 'pendente', cliente: 'Clínica Odontológica Sorriso Perfeito' },
              { id: 8, descricao: 'Provisório em resina', valor: 50.00, dataVencimento: '2025-04-10', status: 'pendente', cliente: 'Consultório Dr. Silva' }
            ],
            contasPagar: [
              { id: 1, descricao: 'Fornecedor de materiais', valor: 1200.00, dataVencimento: '2025-03-05', status: 'pago', fornecedor: 'Dental Supply' },
              { id: 2, descricao: 'Aluguel do laboratório', valor: 2500.00, dataVencimento: '2025-03-10', status: 'pago', fornecedor: 'Imobiliária Central' },
              { id: 3, descricao: 'Conta de energia', valor: 350.00, dataVencimento: '2025-02-25', status: 'pago', fornecedor: 'Companhia Elétrica' },
              { id: 4, descricao: 'Manutenção de equipamentos', valor: 800.00, dataVencimento: '2025-04-15', status: 'pendente', fornecedor: 'TechDental Serviços' }
            ]
          }
        });
      } else if (activeTab === 'producao') {
        setRelatorioGerado({
          tipo: 'producao',
          dados: {
            totalOrdens: 12,
            ordensFinalizadas: 8,
            ordensPendentes: 4,
            tempoMedioProducao: 5.2, // em dias
            servicosMaisRealizados: [
              { servico: 'Prótese total', quantidade: 5, percentual: 41.7 },
              { servico: 'Prótese parcial removível', quantidade: 3, percentual: 25.0 },
              { servico: 'Protocolo de implantes total', quantidade: 2, percentual: 16.7 },
              { servico: 'Provisório em resina impressa', quantidade: 2, percentual: 16.7 }
            ],
            ordens: [
              { id: 1, clinica: 'Clínica Odontológica Sorriso Perfeito', tipoServico: 'Prótese total', dataCadastro: '2025-02-15', dataEntrega: '2025-02-20', status: 'entregue' },
              { id: 2, clinica: 'Consultório Dr. Silva', tipoServico: 'Prótese parcial removível', dataCadastro: '2025-02-18', dataEntrega: '2025-02-25', status: 'entregue' },
              { id: 3, clinica: 'Odontologia Especializada', tipoServico: 'Protocolo de implantes total', dataCadastro: '2025-02-20', dataEntrega: '2025-02-27', status: 'entregue' },
              { id: 4, clinica: 'Centro Odontológico Bem Estar', tipoServico: 'Provisório em resina impressa', dataCadastro: '2025-02-22', dataEntrega: '2025-02-25', status: 'entregue' },
              { id: 5, clinica: 'Clínica Dental Care', tipoServico: 'Prótese total', dataCadastro: '2025-03-01', dataEntrega: '2025-03-08', status: 'entregue' },
              { id: 6, clinica: 'Consultório Dra. Ana', tipoServico: 'Protocolo de implantes total', dataCadastro: '2025-03-05', dataEntrega: '2025-03-12', status: 'entregue' },
              { id: 7, clinica: 'Clínica Odontológica Sorriso Perfeito', tipoServico: 'Prótese total', dataCadastro: '2025-03-10', dataEntrega: '2025-03-17', status: 'entregue' },
              { id: 8, clinica: 'Consultório Dr. Silva', tipoServico: 'Prótese parcial removível', dataCadastro: '2025-03-15', dataEntrega: '2025-03-22', status: 'entregue' },
              { id: 9, clinica: 'Odontologia Especializada', tipoServico: 'Prótese total', dataCadastro: '2025-03-20', dataEntrega: '2025-03-27', status: 'pendente' },
              { id: 10, clinica: 'Centro Odontológico Bem Estar', tipoServico: 'Provisório em resina impressa', dataCadastro: '2025-03-25', dataEntrega: '2025-03-28', status: 'pendente' },
              { id: 11, clinica: 'Clínica Dental Care', tipoServico: 'Prótese total', dataCadastro: '2025-04-01', dataEntrega: '2025-04-08', status: 'pendente' },
              { id: 12, clinica: 'Consultório Dr. Silva', tipoServico: 'Prótese parcial removível', dataCadastro: '2025-04-05', dataEntrega: '2025-04-12', status: 'pendente' }
            ]
          }
        });
      } else if (activeTab === 'estoque') {
        setRelatorioGerado({
          tipo: 'estoque',
          dados: {
            totalItens: 6,
            itensEstoqueBaixo: 2,
            valorTotalEstoque: 12500.00,
            movimentacoes: [
              { data: '2025-02-10', material: 'Zircônia', tipo: 'entrada', quantidade: 20, valor: 2000.00 },
              { data: '2025-02-15', material: 'Dissilicato', tipo: 'entrada', quantidade: 15, valor: 1500.00 },
              { data: '2025-02-20', material: 'Resina para impressão 3D', tipo: 'entrada', quantidade: 5, valor: 1000.00 },
              { data: '2025-02-25', material: 'Dentes Delara', tipo: 'entrada', quantidade: 100, valor: 500.00 },
              { data: '2025-03-01', material: 'Dentes Trilux', tipo: 'entrada', quantidade: 100, valor: 600.00 },
              { data: '2025-03-05', material: 'Dentes Premium', tipo: 'entrada', quantidade: 50, valor: 400.00 },
              { data: '2025-03-10', material: 'Zircônia', tipo: 'saída', quantidade: 5, valor: 500.00 },
              { data: '2025-03-15', material: 'Dissilicato', tipo: 'saída', quantidade: 3, valor: 300.00 },
              { data: '2025-03-20', material: 'Resina para impressão 3D', tipo: 'saída', quantidade: 2, valor: 400.00 },
              { data: '2025-03-25', material: 'Dentes Delara', tipo: 'saída', quantidade: 20, valor: 100.00 },
              { data: '2025-04-01', material: 'Dentes Trilux', tipo: 'saída', quantidade: 15, valor: 90.00 },
              { data: '2025-04-05', material: 'Dentes Premium', tipo: 'saída', quantidade: 10, valor: 80.00 }
            ],
            materiais: [
              { nome: 'Zircônia', quantidade: 15, unidade: 'blocos', estoqueMinimo: 10, valorUnitario: 100.00 },
              { nome: 'Dissilicato', quantidade: 12, unidade: 'pastilhas', estoqueMinimo: 5, valorUnitario: 100.00 },
              { nome: 'Resina para impressão 3D', quantidade: 3, unidade: 'litros', estoqueMinimo: 1, valorUnitario: 200.00 },
              { nome: 'Dentes Delara', quantidade: 80, unidade: 'unidades', estoqueMinimo: 50, valorUnitario: 5.00 },
              { nome: 'Dentes Trilux', quantidade: 85, unidade: 'unidades', estoqueMinimo: 40, valorUnitario: 6.00 },
              { nome: 'Dentes Premium', quantidade: 40, unidade: 'unidades', estoqueMinimo: 30, valorUnitario: 8.00 }
            ]
          }
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleExportarPDF = () => {
    alert('Funcionalidade de exportação para PDF seria implementada aqui.');
  };

  const handleExportarExcel = () => {
    alert('Funcionalidade de exportação para Excel seria implementada aqui.');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Relatórios</h1>
        </div>

        <Tabs defaultValue="financeiro" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="producao">Produção</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
          </TabsList>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 items-end">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="periodoInicio">Data Inicial</Label>
                  <Input
                    type="date"
                    id="periodoInicio"
                    value={periodoInicio}
                    onChange={(e) => setPeriodoInicio(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="periodoFim">Data Final</Label>
                  <Input
                    type="date"
                    id="periodoFim"
                    value={periodoFim}
                    onChange={(e) => setPeriodoFim(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleGerarRelatorio}
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {relatorioGerado && relatorioGerado.tipo === activeTab && (
            <TabsContent value="financeiro">
              {relatorioGerado.tipo === 'financeiro' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-700">Relatório Financeiro</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleExportarPDF}
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Exportar PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleExportarExcel}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Exportar Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          R$ {relatorioGerado.dados.totalRecebido.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          R$ {relatorioGerado.dados.totalPago.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${relatorioGerado.dados.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {relatorioGerado.dados.saldo.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Tabs defaultValue="recebidas">
                    <TabsList>
                      <TabsTrigger value="recebidas">Contas Recebidas</TabsTrigger>
                      <TabsTrigger value="pagas">Contas Pagas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recebidas">
                      <Card>
                        <CardHeader>
                          <CardTitle>Contas a Receber</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Valor (R$)</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {relatorioGerado.dados.contasReceber.map((conta) => (
                                <TableRow key={conta.id}>
                                  <TableCell className="font-medium">{conta.descricao}</TableCell>
                                  <TableCell>{conta.cliente}</TableCell>
                                  <TableCell>R$ {conta.valor.toFixed(2)}</TableCell>
                                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>
                                    <div className={`
                                      px-2 py-1 rounded-full text-xs font-medium w-fit
                                      ${conta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                                      ${conta.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                                      ${conta.status === 'atrasado' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                      {conta.status === 'pendente' ? 'Pendente' : ''}
                                      {conta.status === 'pago' ? 'Pago' : ''}
                                      {conta.status === 'atrasado' ? 'Atrasado' : ''}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="pagas">
                      <Card>
                        <CardHeader>
                          <CardTitle>Contas a Pagar</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Fornecedor</TableHead>
                                <TableHead>Valor (R$)</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {relatorioGerado.dados.contasPagar.map((conta) => (
                                <TableRow key={conta.id}>
                                  <TableCell className="font-medium">{conta.descricao}</TableCell>
                                  <TableCell>{conta.fornecedor}</TableCell>
                                  <TableCell>R$ {conta.valor.toFixed(2)}</TableCell>
                                  <TableCell>{new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                                  <TableCell>
                                    <div className={`
                                      px-2 py-1 rounded-full text-xs font-medium w-fit
                                      ${conta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                                      ${conta.status === 'pago' ? 'bg-green-100 text-green-800' : ''}
                                      ${conta.status === 'atrasado' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                      {conta.status === 'pendente' ? 'Pendente' : ''}
                                      {conta.status === 'pago' ? 'Pago' : ''}
                                      {conta.status === 'atrasado' ? 'Atrasado' : ''}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </TabsContent>
          )}
          
          {relatorioGerado && relatorioGerado.tipo === activeTab && (
            <TabsContent value="producao">
              {relatorioGerado.tipo === 'producao' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-700">Relatório de Produção</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleExportarPDF}
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Exportar PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleExportarExcel}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Exportar Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ordens</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {relatorioGerado.dados.totalOrdens}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Ordens Finalizadas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {relatorioGerado.dados.ordensFinalizadas}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Ordens Pendentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                          {relatorioGerado.dados.ordensPendentes}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Tempo Médio de Produção</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                          {relatorioGerado.dados.tempoMedioProducao.toFixed(1)} dias
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Serviços Mais Realizados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Serviço</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Percentual</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {relatorioGerado.dados.servicosMaisRealizados.map((servico, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{servico.servico}</TableCell>
                                <TableCell>{servico.quantidade}</TableCell>
                                <TableCell>{servico.percentual.toFixed(1)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle>Gráfico de Produção</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                          <p className="text-gray-500">Gráfico de produção seria exibido aqui</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Ordens de Serviço</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Clínica</TableHead>
                            <TableHead>Tipo de Serviço</TableHead>
                            <TableHead>Data Cadastro</TableHead>
                            <TableHead>Data Entrega</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorioGerado.dados.ordens.map((ordem) => (
                            <TableRow key={ordem.id}>
                              <TableCell>{ordem.id}</TableCell>
                              <TableCell className="font-medium">{ordem.clinica}</TableCell>
                              <TableCell>{ordem.tipoServico}</TableCell>
                              <TableCell>{new Date(ordem.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>{new Date(ordem.dataEntrega).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
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
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          )}
          
          {relatorioGerado && relatorioGerado.tipo === activeTab && (
            <TabsContent value="estoque">
              {relatorioGerado.tipo === 'estoque' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-700">Relatório de Estoque</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleExportarPDF}
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Exportar PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleExportarExcel}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Exportar Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                          {relatorioGerado.dados.totalItens}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Itens com Estoque Baixo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {relatorioGerado.dados.itensEstoqueBaixo}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          R$ {relatorioGerado.dados.valorTotalEstoque.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Materiais em Estoque</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Estoque Mínimo</TableHead>
                            <TableHead>Valor Unitário</TableHead>
                            <TableHead>Valor Total</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorioGerado.dados.materiais.map((material, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{material.nome}</TableCell>
                              <TableCell>{material.quantidade}</TableCell>
                              <TableCell>{material.unidade}</TableCell>
                              <TableCell>{material.estoqueMinimo}</TableCell>
                              <TableCell>R$ {material.valorUnitario.toFixed(2)}</TableCell>
                              <TableCell>R$ {(material.quantidade * material.valorUnitario).toFixed(2)}</TableCell>
                              <TableCell>
                                <div className={`
                                  px-2 py-1 rounded-full text-xs font-medium w-fit
                                  ${material.quantidade <= material.estoqueMinimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                                `}>
                                  {material.quantidade <= material.estoqueMinimo ? 'Estoque Baixo' : 'OK'}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Movimentações de Estoque</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorioGerado.dados.movimentacoes.map((mov, index) => (
                            <TableRow key={index}>
                              <TableCell>{new Date(mov.data).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell className="font-medium">{mov.material}</TableCell>
                              <TableCell>
                                <div className={`
                                  px-2 py-1 rounded-full text-xs font-medium w-fit
                                  ${mov.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                `}>
                                  {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                                </div>
                              </TableCell>
                              <TableCell>{mov.quantidade}</TableCell>
                              <TableCell>R$ {mov.valor.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          )}
          
          {!relatorioGerado && (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
              <p className="text-gray-500">Selecione um período e clique em "Gerar Relatório" para visualizar os dados.</p>
            </div>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
