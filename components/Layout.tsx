import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  PhoneCall, 
  Users, 
  FileBarChart, 
  LogOut, 
  Menu, 
  X,
  Leaf
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        currentView === view 
          ? 'bg-green-700 text-white border-r-4 border-blue-300' 
          : 'text-green-100 hover:bg-green-700 hover:text-white'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-green-800 text-white fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 border-b border-green-700">
            <div className="bg-white p-1.5 rounded-full">
                <Leaf className="text-green-600 h-6 w-6" />
            </div>
          <h1 className="font-bold text-lg leading-tight">Esperança<br/><span className="text-blue-200 text-base font-normal">Nordeste</span></h1>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          {user.role === UserRole.ADMIN && (
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}
          <NavItem view="calls" icon={PhoneCall} label="Ligações / Pedidos" />
          {user.role === UserRole.ADMIN && (
            <>
              <NavItem view="employees" icon={Users} label="Funcionários" />
              <NavItem view="reports" icon={FileBarChart} label="Relatórios" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
                {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-green-300 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-200 hover:bg-red-900/30 rounded transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-green-800 text-white z-20 flex justify-between items-center p-4 shadow-md">
         <div className="flex items-center gap-2">
            <Leaf className="text-white h-6 w-6" />
            <span className="font-bold">Esperança Nordeste</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-green-900 z-10 pt-20 px-4 space-y-2 md:hidden">
             {user.role === UserRole.ADMIN && (
                <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            )}
            <NavItem view="calls" icon={PhoneCall} label="Ligações / Pedidos" />
            {user.role === UserRole.ADMIN && (
                <>
                <NavItem view="employees" icon={Users} label="Funcionários" />
                <NavItem view="reports" icon={FileBarChart} label="Relatórios" />
                </>
            )}
            <div className="border-t border-green-700 mt-4 pt-4">
                 <button onClick={onLogout} className="flex items-center gap-2 text-red-300">
                    <LogOut size={20} /> Sair
                 </button>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;
