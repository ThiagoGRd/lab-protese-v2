'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulando autenticação para demonstração
      if (
        (email === 'admin@protechlab.com' && password === 'senha123') ||
        (email === 'tecnico@protechlab.com' && password === 'senha123')
      ) {
        // Login bem-sucedido
        localStorage.setItem('user', JSON.stringify({ 
          email, 
          role: email.includes('admin') ? 'administrador' : 'tecnico',
          name: email.includes('admin') ? 'Administrador' : 'Técnico'
        }));
        
        // Redirecionar para o dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // Login falhou
        setError('Email ou senha incorretos. Tente novamente.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">ProTech Lab</h1>
          <p className="text-gray-600">Sistema de Gestão para Laboratório de Prótese</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500">
              <p>Credenciais de demonstração:</p>
              <p>Admin: admin@protechlab.com / senha123</p>
              <p>Técnico: tecnico@protechlab.com / senha123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
