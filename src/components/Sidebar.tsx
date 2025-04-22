'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { 
  Home, 
  FileText, 
  Users, 
  Package, 
  DollarSign, 
  BarChart, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Verificar se é mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Carregar usuário do localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkIfMobile();
    loadUser();

    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Ordens de Serviço', href: '/ordens', icon: <FileText className="h-5 w-5" /> },
    { name: 'Clientes', href: '/clientes', icon: <Users className="h-5 w-5" /> },
    { name: 'Serviços', href: '/servicos', icon: <Package className="h-5 w-5" /> },
    { name: 'Materiais', href: '/materiais', icon: <Package className="h-5 w-5" /> },
    { name: 'Financeiro', href: '/financeiro', icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Relatórios', href: '/relatorios', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Notificações', href: '/notificacoes', icon: <Bell className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'}
          lg:relative lg:block
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`
            flex items-center justify-center h-16 border-b border-gray-200
            ${isOpen ? 'px-4' : 'px-0'}
          `}>
            {isOpen ? (
              <h1 className="text-xl font-bold text-blue-800">ProTech Lab</h1>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-bold text-lg">P</span>
              </div>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className={`
              flex items-center p-4 border-b border-gray-200
              ${isOpen ? '' : 'justify-center'}
            `}>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-bold">
                  {user.name ? user.name.charAt(0) : 'U'}
                </span>
              </div>
              {isOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{user.role || 'Usuário'}</p>
                </div>
              )}
            </div>
          )}

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`
                        flex items-center px-3 py-2 rounded-md text-sm font-medium
                        ${pathname === item.href 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isOpen ? '' : 'justify-center'}
                      `}
                    >
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.name}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className={`
                w-full flex items-center text-gray-700 hover:bg-gray-100 hover:text-gray-900
                ${isOpen ? '' : 'justify-center'}
              `}
            >
              <LogOut className="h-5 w-5" />
              {isOpen && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
