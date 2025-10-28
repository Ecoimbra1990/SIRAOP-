'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { 
  Home, 
  FileText, 
  Users, 
  MapPin, 
  Car, 
  Shield, 
  Building2,
  Database,
  Map,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

// Navegação para usuários comuns (policiais)
const commonNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Nova Ocorrência', href: '/ocorrencias/nova', icon: FileText },
  { name: 'Ocorrências', href: '/ocorrencias', icon: FileText },
];

// Navegação completa para administradores
const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Admin', href: '/admin', icon: Database },
  { name: 'Ocorrências', href: '/ocorrencias', icon: FileText },
  { name: 'Pessoas', href: '/pessoas', icon: Users },
  { name: 'Facções', href: '/faccoes', icon: Building2 },
  { name: 'Veículos', href: '/veiculos', icon: Car },
  { name: 'Armas', href: '/armas', icon: Shield },
  { name: 'Dimensionamento', href: '/dimensionamento', icon: Map },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  // Escolher navegação baseada no role do usuário
  const navigation = user?.role === 'admin' ? adminNavigation : commonNavigation;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-pm-accent rounded-lg flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-pm-white" />
                  </div>
                  <h1 className="text-xl font-bold text-pm-dark">SIRAOP</h1>
                </div>
              </div>
              
              <div className="hidden lg:block ml-10">
                <div className="flex items-baseline space-x-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => router.push(item.href)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-pm-accent text-pm-white shadow-sm'
                            : 'text-secondary-600 hover:text-pm-dark hover:bg-pm-light'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.nome_completo}</p>
                    <p className="text-gray-500">{user?.matricula}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center px-3 py-2">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.nome_completo}</p>
                  <p className="text-gray-500">{user?.matricula}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
