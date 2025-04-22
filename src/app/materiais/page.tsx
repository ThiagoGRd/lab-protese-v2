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

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState([]);
  const [novoMaterial, setNovoMaterial] = useState({
    nome: '',
    quantidade: '',
    unidade: '',
    estoqueMinimo: '',
    fornecedor: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialEditando, setMaterialEditando] = useState(null);

  useEffect(() => {
    // Carregar materiais do backend
    const carregarMateriais = async () => {
      try {
        // Simulando dados para demonstração
        const dadosSimulados = [
          { id: 1, nome: 'Zircônia', quantidade: 50, unidade: 'blocos', estoqueMinimo: 10, fornecedor: 'Dental Supply' },
          { id: 2, nome: 'Dissilicato', quantidade: 30, unidade: 'pastilhas', estoqueMinimo: 5, fornecedor: 'Dental Materials Inc.' },
          { id: 3, nome: 'Resina para impressão 3D', quantidade: 2, unidade: 'litros', estoqueMinimo: 1, fornecedor: '3D Dental Solutions' },
          { id: 4, nome: 'Dentes Delara', quantidade: 200, unidade: 'unidades', estoqueMinimo: 50, fornecedor: 'Delara Dental' },
          { id: 5, nome: 'Dentes Trilux', quantidade: 150, unidade: 'unidades', estoqueMinimo: 40, fornecedor: 'Trilux Dental' },
          { id: 6, nome: 'Dentes Premium', quantidade: 100, unidade: 'unidades', estoqueMinimo: 30, fornecedor: 'Premium Dental' }
        ];
        setMateriais(dadosSimulados);
      } catch (error) {
        console.error('Erro ao carregar materiais:', error);
      }
    };

    carregarMateriais();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (materialEditando) {
      setMaterialEditando({
        ...materialEditando,
        [name]: value
      });
    } else {
      setNovoMaterial({
        ...novoMaterial,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (materialEditando) {
        // Atualizar material existente
        const materiaisAtualizados = materiais.map(m => 
          m.id === materialEditando.id ? materialEditando : m
        );
        setMateriais(materiaisAtualizados);
        setMaterialEditando(null);
      } else {
        // Adicionar novo material
        const novoMaterialComId = {
          ...novoMaterial,
          id: materiais.length + 1,
          quantidade: parseInt(novoMaterial.quantidade),
          estoqueMinimo: parseInt(novoMaterial.estoqueMinimo)
        };
        setMateriais([...materiais, novoMaterialComId]);
        setNovoMaterial({
          nome: '',
          quantidade: '',
          unidade: '',
          estoqueMinimo: '',
          fornecedor: ''
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar material:', error);
    }
  };

  const handleEditar = (material) => {
    setMaterialEditando(material);
    setIsDialogOpen(true);
  };

  const handleExcluir = async (id) => {
    try {
      // Remover material
      const materiaisFiltrados = materiais.filter(m => m.id !== id);
      setMateriais(materiaisFiltrados);
    } catch (error) {
      console.error('Erro ao excluir material:', error);
    }
  };

  const handleAjustarEstoque = (id, quantidade) => {
    const materiaisAtualizados = materiais.map(m => 
      m.id === id ? { ...m, quantidade: m.quantidade + quantidade } : m
    );
    setMateriais(materiaisAtualizados);
  };

  const materiaisFiltrados = materiais.filter(material =>
    material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const materiaisComEstoqueBaixo = materiais.filter(material =>
    material.quantidade <= material.estoqueMinimo
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Controle de Materiais</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setMaterialEditando(null);
                  setNovoMaterial({
                    nome: '',
                    quantidade: '',
                    unidade: '',
                    estoqueMinimo: '',
                    fornecedor: ''
                  });
                }}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Adicionar Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{materialEditando ? 'Editar Material' : 'Novo Material'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="nome">Nome do Material</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={materialEditando ? materialEditando.nome : novoMaterial.nome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    value={materialEditando ? materialEditando.quantidade : novoMaterial.quantidade}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input
                    id="unidade"
                    name="unidade"
                    value={materialEditando ? materialEditando.unidade : novoMaterial.unidade}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                  <Input
                    id="estoqueMinimo"
                    name="estoqueMinimo"
                    type="number"
                    value={materialEditando ? materialEditando.estoqueMinimo : novoMaterial.estoqueMinimo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Input
                    id="fornecedor"
                    name="fornecedor"
                    value={materialEditando ? materialEditando.fornecedor : novoMaterial.fornecedor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                    {materialEditando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {materiaisComEstoqueBaixo.length > 0 && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Alerta de Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {materiaisComEstoqueBaixo.map((material) => (
                  <li key={material.id} className="text-red-600">
                    <span className="font-medium">{material.nome}</span>: {material.quantidade} {material.unidade} (mínimo: {material.estoqueMinimo})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Inventário de Materiais</CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Buscar materiais..."
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
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materiaisFiltrados.length > 0 ? (
                  materiaisFiltrados.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.nome}</TableCell>
                      <TableCell>{material.quantidade}</TableCell>
                      <TableCell>{material.unidade}</TableCell>
                      <TableCell>{material.estoqueMinimo}</TableCell>
                      <TableCell>{material.fornecedor}</TableCell>
                      <TableCell>
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium w-fit
                          ${material.quantidade <= material.estoqueMinimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                        `}>
                          {material.quantidade <= material.estoqueMinimo ? 'Estoque Baixo' : 'OK'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditar(material)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleExcluir(material.id)}
                          >
                            Excluir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleAjustarEstoque(material.id, 1)}
                          >
                            +
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => handleAjustarEstoque(material.id, -1)}
                            disabled={material.quantidade <= 0}
                          >
                            -
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhum material encontrado
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
