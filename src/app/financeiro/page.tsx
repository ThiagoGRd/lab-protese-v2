'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState('receber');
  const [contasReceber, setContasReceber] = useState([]);
  const [contasPagar, setContasPagar] = useState([]);
  const [novaConta, setNovaConta] = useState({
    descricao: '',
    valor: '',
    dataVencimento: '',
    status: 'pendente',
    cliente: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contaEditando, setContaEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carregar dados financeiros do backend
    const carregarDados = async () => {
      try {
        // Simulando dados para demonstração
        const contasReceberSimuladas = [
          { id: 1, descricao: 'Prótese total', valor: 450.00, dataVencimento: '2025-05-10', status: 'pendente', cliente: 'Clínica Odontológica Sorriso Perfeito' },
          { id: 2, descricao: 'Prótese parcial removível', valor: 520.00, dataVencimento: '2025-05-15', status: 'pago', cliente: 'Consultório Dr. Silva' },
          { id: 3, descricao: 'Protocolo de implantes', valor: 1350.00, dataVencimento: '2025-05-20', status: 'pendente', cliente: 'Odontologia Especializada' },
          { id: 4, descricao: 'Provisório em resina', valor: 50.00, dataVencimento: '2025-04-30', status: 'atrasado', cliente: 'Centro Odontológico Bem Estar' }
        ];
        
        const contasPagarSimuladas = [
          { id: 1, descricao: 'Fornecedor de materiais', valor: 1200.00, dataVencimento: '2025-05-05', status: 'pendente', fornecedor: 'Dental Supply' },
          { id: 2, descricao: 'Aluguel do laboratório', valor: 2500.00, dataVencimento: '2025-05-10', status: 'pendente', fornecedor: 'Imobiliária Central' },
          { id: 3, descricao: 'Conta de energia', valor: 350.00, dataVencimento: '2025-04-25', status: 'pago', fornecedor: 'Companhia Elétrica' },
          { id: 4, descricao: 'Manutenção de equipamentos', valor: 800.00, dataVencimento: '2025-05-15', status: 'pendente', fornecedor: 'TechDental Serviços' }
        ];
        
        setContasReceber(contasReceberSimuladas);
        setContasPagar(contasPagarSimuladas);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      }
    };

    carregarDados();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (contaEditando) {
      setContaEditando({
        ...contaEditando,
        [name]: value
      });
    } else {
      setNovaConta({
        ...novaConta,
        [name]: value
      });
    }
  };

  const handleSelectChange = (name, value) => {
    if (contaEditando) {
      setContaEditando({
        ...contaEditando,
        [name]: value
      });
    } else {
      setNovaConta({
        ...novaConta,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contaEditando) {
        // Atualizar conta existente
        if (activeTab === 'receber') {
          const contasAtualizadas = contasReceber.map(c => 
            c.id === contaEditando.id ? contaEditando : c
          );
          setContasReceber(contasAtualizadas);
        } else {
          const contasAtualizadas = contasPagar.map(c => 
            c.id === contaEditando.id ? contaEditando : c
          );
          setContasPagar(contasAtualizadas);
        }
        setContaEditando(null);
      } else {
        // Adicionar nova conta
        const novaContaComId = {
          ...novaConta,
          id: activeTab === 'receber' ? contasReceber.length + 1 : contasPagar.length + 1
        };
        
        if (activeTab === 'receber') {
          setContasReceber([...contasReceber, novaContaComId]);
        } else {
          setContasPagar([...contasPagar, novaContaComId]);
        }
        
        setNovaConta({
          descricao: '',
          valor: '',
          dataVencimento: '',
          status: 'pendente',
          cliente: ''
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
    }
  };

  const handleEditar = (conta) => {
    setContaEditando(conta);
    setIsDialogOpen(true);
  };

  const handleExcluir = async (id) => {
    try {
      if (activeTab === 'receber') {
        const contasFiltradas = contasReceber.filter(c => c.id !== id);
        setContasReceber(contasFiltradas);
      } else {
        const contasFiltradas = contasPagar.filter(c => c.id !== id);
        setContasPagar(contasFiltradas);
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  const handleMudarStatus = (id, novoStatus) => {
    if (activeTab === 'receber') {
      const contasAtualizadas = contasReceber.map(c => 
        c.id === id ? { ...c, status: novoStatus } : c
      );
      setContasReceber(contasAtualizadas);
    } else {
      const contasAtualizadas = contasPagar.map(c => 
        c.id === id ? { ...c, status: novoStatus } : c
      );
      setContasPagar(contasAtualizadas);
    }
  };

  const contasFiltradas = activeTab === 'receber' 
    ? contasReceber.filter(conta =>
        conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conta.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contasPagar.filter(conta =>
        conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conta.fornecedor && conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  const totalPendente = activeTab === 'receber'
    ? contasReceber.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0)
    : contasPagar.filter(c => c.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0);

  const totalPago = activeTab === 'receber'
    ? contasReceber.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0)
    : contasPagar.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.valor, 0);

  const totalAtrasado = activeTab === 'receber'
    ? contasReceber.filter(c => c.status === 'atrasado').reduce((acc, curr) => acc + curr.valor, 0)
    : contasPagar.filter(c => c.status === 'atrasado').reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Controle Financeiro</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setContaEditando(null);
                  setNovaConta({
                    descricao: '',
                    valor: '',
                    dataVencimento: '',
                    status: 'pendente',
                    cliente: ''
                  });
                }}
                className="bg-blue-700 hover:bg-blue-800"
              >
                {activeTab === 'receber' ? 'Nova Conta a Receber' : 'Nova Conta a Pagar'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {contaEditando 
                    ? `Editar ${activeTab === 'receber' ? 'Conta a Receber' : 'Conta a Pagar'}`
                    : `Nova ${activeTab === 'receber' ? 'Conta a Receber' : 'Conta a Pagar'}`
                  }
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    name="descricao"
                    value={contaEditando ? contaEditando.descricao : novaConta.descricao}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    value={contaEditando ? contaEditando.valor : novaConta.valor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                  <Input
                    id="dataVencimento"
                    name="dataVencimento"
                    type="date"
                    value={contaEditando ? contaEditando.dataVencimento : novaConta.dataVencimento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={contaEditando ? contaEditando.status : novaConta.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeTab === 'receber' ? (
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="cliente">Cliente</Label>
                    <Input
                      id="cliente"
                      name="cliente"
                      value={contaEditando ? contaEditando.cliente : novaConta.cliente}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      name="fornecedor"
                      value={contaEditando ? contaEditando.fornecedor : novaConta.fornecedor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                    {contaEditando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                R$ {totalPendente.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {totalPago.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Atrasado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalAtrasado.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="receber" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
            <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receber">
            <Card>
              <CardHeader>
                <CardTitle>Contas a Receber</CardTitle>
                <div className="mt-2">
                  <Input
                    placeholder="Buscar contas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
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
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasFiltradas.length > 0 ? (
                      contasFiltradas.map((conta) => (
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
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditar(conta)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleExcluir(conta.id)}
                              >
                                Excluir
                              </Button>
                              {conta.status !== 'pago' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-green-50 text-green-700 hover:bg-green-100"
                                  onClick={() => handleMudarStatus(conta.id, 'pago')}
                                >
                                  Marcar como Pago
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Nenhuma conta a receber encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pagar">
            <Card>
              <CardHeader>
                <CardTitle>Contas a Pagar</CardTitle>
                <div className="mt-2">
                  <Input
                    placeholder="Buscar contas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
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
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contasFiltradas.length > 0 ? (
                      contasFiltradas.map((conta) => (
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
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditar(conta)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleExcluir(conta.id)}
                              >
                                Excluir
                              </Button>
                              {conta.status !== 'pago' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-green-50 text-green-700 hover:bg-green-100"
                                  onClick={() => handleMudarStatus(conta.id, 'pago')}
                                >
                                  Marcar como Pago
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Nenhuma conta a pagar encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
