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
import { Checkbox } from '../../components/ui/checkbox';

export default function OrdensPage() {
  const [ordens, setOrdens] = useState([]);
  const [novaOrdem, setNovaOrdem] = useState({
    clinica: '',
    profissional: '',
    dataCadastro: new Date().toISOString().split('T')[0],
    urgencia: false,
    tipoServico: '',
    corDente: '',
    escala: '',
    material: '',
    status: 'pendente',
    dataEntrega: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ordemEditando, setOrdemEditando] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    // Carregar ordens de serviço do backend
    const carregarOrdens = async () => {
      try {
        // Simulando dados para demonstração
        const dadosSimulados = [
          { 
            id: 1, 
            clinica: 'Clínica Odontológica Sorriso Perfeito', 
            profissional: 'Dr. João Silva', 
            dataCadastro: '2025-04-15', 
            urgencia: true, 
            tipoServico: 'Prótese total', 
            corDente: 'A2', 
            escala: 'Vita', 
            material: 'Zirconia', 
            status: 'pendente',
            dataEntrega: '2025-04-18'
          },
          { 
            id: 2, 
            clinica: 'Consultório Dr. Silva', 
            profissional: 'Dra. Maria Oliveira', 
            dataCadastro: '2025-04-10', 
            urgencia: false, 
            tipoServico: 'Prótese parcial removível', 
            corDente: 'B1', 
            escala: 'Vita', 
            material: 'Resina 3D', 
            status: 'em_producao',
            dataEntrega: '2025-04-25'
          },
          { 
            id: 3, 
            clinica: 'Odontologia Especializada', 
            profissional: 'Dr. Carlos Santos', 
            dataCadastro: '2025-04-05', 
            urgencia: true, 
            tipoServico: 'Protocolo de implantes total', 
            corDente: 'C2', 
            escala: 'Vita', 
            material: 'Dissilicato', 
            status: 'concluido',
            dataEntrega: '2025-04-08'
          },
          { 
            id: 4, 
            clinica: 'Centro Odontológico Bem Estar', 
            profissional: 'Dra. Ana Pereira', 
            dataCadastro: '2025-04-01', 
            urgencia: false, 
            tipoServico: 'Provisório em resina impressa', 
            corDente: 'A3', 
            escala: 'Vita', 
            material: 'Dentes Trilux', 
            status: 'entregue',
            dataEntrega: '2025-04-16'
          }
        ];
        setOrdens(dadosSimulados);
      } catch (error) {
        console.error('Erro ao carregar ordens de serviço:', error);
      }
    };

    carregarOrdens();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (ordemEditando) {
      setOrdemEditando({
        ...ordemEditando,
        [name]: value
      });
    } else {
      setNovaOrdem({
        ...novaOrdem,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (checked) => {
    if (ordemEditando) {
      setOrdemEditando({
        ...ordemEditando,
        urgencia: checked
      });
      
      // Atualizar data de entrega baseado na urgência
      if (checked) {
        const dataEntrega = calcularDataEntrega(ordemEditando.dataCadastro, true);
        setOrdemEditando({
          ...ordemEditando,
          urgencia: checked,
          dataEntrega
        });
      } else {
        const dataEntrega = calcularDataEntrega(ordemEditando.dataCadastro, false);
        setOrdemEditando({
          ...ordemEditando,
          urgencia: checked,
          dataEntrega
        });
      }
    } else {
      // Atualizar data de entrega baseado na urgência
      if (checked) {
        const dataEntrega = calcularDataEntrega(novaOrdem.dataCadastro, true);
        setNovaOrdem({
          ...novaOrdem,
          urgencia: checked,
          dataEntrega
        });
      } else {
        const dataEntrega = calcularDataEntrega(novaOrdem.dataCadastro, false);
        setNovaOrdem({
          ...novaOrdem,
          urgencia: checked,
          dataEntrega
        });
      }
    }
  };

  const handleSelectChange = (name, value) => {
    if (ordemEditando) {
      setOrdemEditando({
        ...ordemEditando,
        [name]: value
      });
    } else {
      setNovaOrdem({
        ...novaOrdem,
        [name]: value
      });
    }
  };

  const calcularDataEntrega = (dataCadastro, urgencia) => {
    const data = new Date(dataCadastro);
    let diasUteis = urgencia ? 3 : 7; // 3 dias úteis para urgência, 7 para normal
    
    while (diasUteis > 0) {
      data.setDate(data.getDate() + 1);
      // Pular finais de semana (0 = Domingo, 6 = Sábado)
      if (data.getDay() !== 0 && data.getDay() !== 6) {
        diasUteis--;
      }
    }
    
    return data.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ordemEditando) {
        // Atualizar ordem existente
        const ordensAtualizadas = ordens.map(o => 
          o.id === ordemEditando.id ? ordemEditando : o
        );
        setOrdens(ordensAtualizadas);
        setOrdemEditando(null);
      } else {
        // Adicionar nova ordem
        const novaOrdemComId = {
          ...novaOrdem,
          id: ordens.length + 1
        };
        setOrdens([...ordens, novaOrdemComId]);
        setNovaOrdem({
          clinica: '',
          profissional: '',
          dataCadastro: new Date().toISOString().split('T')[0],
          urgencia: false,
          tipoServico: '',
          corDente: '',
          escala: '',
          material: '',
          status: 'pendente',
          dataEntrega: ''
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar ordem de serviço:', error);
    }
  };

  const handleEditar = (ordem) => {
    setOrdemEditando(ordem);
    setIsDialogOpen(true);
  };

  const handleExcluir = async (id) => {
    try {
      // Remover ordem
      const ordensFiltradas = ordens.filter(o => o.id !== id);
      setOrdens(ordensFiltradas);
    } catch (error) {
      console.error('Erro ao excluir ordem de serviço:', error);
    }
  };

  const handleMudarStatus = (id, novoStatus) => {
    const ordensAtualizadas = ordens.map(o => 
      o.id === id ? { ...o, status: novoStatus } : o
    );
    setOrdens(ordensAtualizadas);
  };

  const ordensFiltradas = ordens.filter(ordem => {
    // Filtro de busca
    const matchesSearch = 
      ordem.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.profissional.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.tipoServico.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de status
    const matchesStatus = filtroStatus === 'todos' || ordem.status === filtroStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Ordenar por urgência e data
  ordensFiltradas.sort((a, b) => {
    if (a.urgencia && !b.urgencia) return -1;
    if (!a.urgencia && b.urgencia) return 1;
    return new Date(a.dataCadastro) - new Date(b.dataCadastro);
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Ordens de Serviço</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setOrdemEditando(null);
                  setNovaOrdem({
                    clinica: '',
                    profissional: '',
                    dataCadastro: new Date().toISOString().split('T')[0],
                    urgencia: false,
                    tipoServico: '',
                    corDente: '',
                    escala: '',
                    material: '',
                    status: 'pendente',
                    dataEntrega: ''
                  });
                }}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Nova Ordem de Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{ordemEditando ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="clinica">Clínica</Label>
                    <Input
                      id="clinica"
                      name="clinica"
                      value={ordemEditando ? ordemEditando.clinica : novaOrdem.clinica}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="profissional">Profissional</Label>
                    <Input
                      id="profissional"
                      name="profissional"
                      value={ordemEditando ? ordemEditando.profissional : novaOrdem.profissional}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="dataCadastro">Data de Cadastro</Label>
                    <Input
                      id="dataCadastro"
                      name="dataCadastro"
                      type="date"
                      value={ordemEditando ? ordemEditando.dataCadastro : novaOrdem.dataCadastro}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="urgencia" className="mb-2">Urgência</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="urgencia" 
                        checked={ordemEditando ? ordemEditando.urgencia : novaOrdem.urgencia}
                        onCheckedChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="urgencia"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Marcar como urgente (prazo de 3 dias úteis)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="tipoServico">Tipo de Serviço</Label>
                    <Select
                      value={ordemEditando ? ordemEditando.tipoServico : novaOrdem.tipoServico}
                      onValueChange={(value) => handleSelectChange('tipoServico', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prótese total">Prótese total</SelectItem>
                        <SelectItem value="Prótese parcial removível">Prótese parcial removível</SelectItem>
                        <SelectItem value="Protocolo de implantes total">Protocolo de implantes total</SelectItem>
                        <SelectItem value="Provisório em resina impressa">Provisório em resina impressa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="dataEntrega">Data de Entrega Prevista</Label>
                    <Input
                      id="dataEntrega"
                      name="dataEntrega"
                      type="date"
                      value={ordemEditando ? ordemEditando.dataEntrega : novaOrdem.dataEntrega}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="corDente">Cor do Dente</Label>
                    <Input
                      id="corDente"
                      name="corDente"
                      value={ordemEditando ? ordemEditando.corDente : novaOrdem.corDente}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="escala">Escala Utilizada</Label>
                    <Select
                      value={ordemEditando ? ordemEditando.escala : novaOrdem.escala}
                      onValueChange={(value) => handleSelectChange('escala', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a escala" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vita">Vita</SelectItem>
                        <SelectItem value="Vita 3D">Vita 3D</SelectItem>
                        <SelectItem value="Ivoclar">Ivoclar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="material">Material de Confecção</Label>
                    <Select
                      value={ordemEditando ? ordemEditando.material : novaOrdem.material}
                      onValueChange={(value) => handleSelectChange('material', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zirconia">Zircônia</SelectItem>
                        <SelectItem value="Dissilicato">Dissilicato</SelectItem>
                        <SelectItem value="Resina 3D">Resina 3D</SelectItem>
                        <SelectItem value="Dentes Delara">Dentes Delara</SelectItem>
                        <SelectItem value="Dentes Trilux">Dentes Trilux</SelectItem>
                        <SelectItem value="Dentes Premium">Dentes Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {ordemEditando && (
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={ordemEditando.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_producao">Em Produção</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                    {ordemEditando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="filtroStatus">Filtrar por Status:</Label>
            <Select
              value={filtroStatus}
              onValueChange={setFiltroStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_producao">Em Produção</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Buscar ordens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Ordens de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Clínica</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead>Urgência</TableHead>
                  <TableHead>Entrega Prevista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordensFiltradas.length > 0 ? (
                  ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id} className={ordem.urgencia ? 'bg-red-50' : ''}>
                      <TableCell>{ordem.id}</TableCell>
                      <TableCell className="font-medium">{ordem.clinica}</TableCell>
                      <TableCell>{ordem.profissional}</TableCell>
                      <TableCell>{ordem.tipoServico}</TableCell>
                      <TableCell>{new Date(ordem.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        {ordem.urgencia ? (
                          <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-red-100 text-red-800">
                            Urgente
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-green-100 text-green-800">
                            Normal
                          </div>
                        )}
                      </TableCell>
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
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditar(ordem)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleExcluir(ordem.id)}
                          >
                            Excluir
                          </Button>
                          {ordem.status === 'pendente' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                              onClick={() => handleMudarStatus(ordem.id, 'em_producao')}
                            >
                              Iniciar Produção
                            </Button>
                          )}
                          {ordem.status === 'em_producao' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-green-50 text-green-700 hover:bg-green-100"
                              onClick={() => handleMudarStatus(ordem.id, 'concluido')}
                            >
                              Concluir
                            </Button>
                          )}
                          {ordem.status === 'concluido' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                              onClick={() => handleMudarStatus(ordem.id, 'entregue')}
                            >
                              Marcar Entregue
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Nenhuma ordem de serviço encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
