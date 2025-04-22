'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clienteEditando, setClienteEditando] = useState(null);

  useEffect(() => {
    // Carregar clientes do backend
    const carregarClientes = async () => {
      try {
        // Simulando dados para demonstração
        const dadosSimulados = [
          { id: 1, nome: 'Clínica Odontológica Sorriso Perfeito', email: 'contato@sorrisoperfeito.com.br', telefone: '(11) 3456-7890', endereco: 'Av. Paulista, 1000, São Paulo, SP' },
          { id: 2, nome: 'Consultório Dr. Silva', email: 'drsilva@consultorio.com.br', telefone: '(11) 2345-6789', endereco: 'Rua Augusta, 500, São Paulo, SP' },
          { id: 3, nome: 'Odontologia Especializada', email: 'contato@odontoespecializada.com.br', telefone: '(11) 3456-7891', endereco: 'Av. Brigadeiro Faria Lima, 2000, São Paulo, SP' },
          { id: 4, nome: 'Centro Odontológico Bem Estar', email: 'atendimento@bemestar.com.br', telefone: '(11) 4567-8901', endereco: 'Rua Oscar Freire, 300, São Paulo, SP' },
          { id: 5, nome: 'Clínica Dental Care', email: 'contato@dentalcare.com.br', telefone: '(11) 5678-9012', endereco: 'Av. Rebouças, 1500, São Paulo, SP' }
        ];
        setClientes(dadosSimulados);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };

    carregarClientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (clienteEditando) {
      setClienteEditando({
        ...clienteEditando,
        [name]: value
      });
    } else {
      setNovoCliente({
        ...novoCliente,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clienteEditando) {
        // Atualizar cliente existente
        const clientesAtualizados = clientes.map(c => 
          c.id === clienteEditando.id ? clienteEditando : c
        );
        setClientes(clientesAtualizados);
        setClienteEditando(null);
      } else {
        // Adicionar novo cliente
        const novoClienteComId = {
          ...novoCliente,
          id: clientes.length + 1
        };
        setClientes([...clientes, novoClienteComId]);
        setNovoCliente({
          nome: '',
          email: '',
          telefone: '',
          endereco: ''
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setIsDialogOpen(true);
  };

  const handleExcluir = async (id) => {
    try {
      // Remover cliente
      const clientesFiltrados = clientes.filter(c => c.id !== id);
      setClientes(clientesFiltrados);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Gerenciamento de Clientes/Clínicas</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setClienteEditando(null);
                  setNovoCliente({
                    nome: '',
                    email: '',
                    telefone: '',
                    endereco: ''
                  });
                }}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="nome">Nome da Clínica/Profissional</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={clienteEditando ? clienteEditando.nome : novoCliente.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={clienteEditando ? clienteEditando.email : novoCliente.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={clienteEditando ? clienteEditando.telefone : novoCliente.telefone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={clienteEditando ? clienteEditando.endereco : novoCliente.endereco}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                    {clienteEditando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Buscar clientes..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>{cliente.endereco}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditar(cliente)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleExcluir(cliente.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum cliente encontrado
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
