import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  Settings,
  Users,
  AlertTriangle,
  Receipt,
  LogOut,
  Menu,
  X,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '../components/ui/input';
import { useAppContext } from '../lib/AppContext';
import { toast } from 'sonner';
import { BillingGate } from '../components/BillingGate';
import { TrialBanner } from '../components/TrialBanner';
import { useBilling } from '../lib/useBilling';
import { supabase } from '../lib/supabase';

const navItems = [
  { href: '/dashboard',       label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/os',              label: 'Ordens de Serviço',  icon: Wrench },
  { href: '/mecanicos',       label: 'Mecânicos',          icon: Users },
  { href: '/regras-comissao', label: 'Regras de Comissão', icon: SlidersHorizontal },
  { href: '/pendencias',      label: 'Pendências',         icon: AlertTriangle, badge: true },
  { href: '/fechamento',      label: 'Fechamento Mensal',  icon: Receipt },
  { href: '/configuracoes',   label: 'Configurações',      icon: Settings },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { pendenciasAtivas, loading } = useAppContext();
  const { billing } = useBilling();
  const nomeOficina = localStorage.getItem('sf_oficina') || 'Minha Oficina';
  const nomeUsuario = localStorage.getItem('sf_usuario') || 'Usuário';
  const avatarUrl = localStorage.getItem('sf_avatar') || '';
  const iniciaisUsuario = nomeUsuario.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem('sf_oficina');
    localStorage.removeItem('sf_usuario');
    localStorage.removeItem('sf_avatar');
    localStorage.removeItem('sf_email');
    toast.success('Sessão encerrada. Até logo!');
    navigate('/login');
  }

  return (
    <BillingGate>
    <div className="min-h-screen bg-[#F5F5F0] text-[#0A0A0A] font-sans flex overflow-hidden">
      {/* Overlay mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] text-white z-50 transform transition-transform duration-300 flex flex-col shrink-0 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
          <Link to="/dashboard" className="font-display tracking-wider text-xl uppercase">
            Service<span className="text-[#FF6B1A]">Flow</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname.startsWith(item.href) &&
                (item.href !== '/dashboard' || location.pathname === '/dashboard');
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FF6B1A] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                  {item.badge && pendenciasAtivas > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {pendenciasAtivas}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full px-3 py-2 rounded-md text-sm font-medium"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 shrink-0 z-10 shadow-sm gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-black md:hidden shrink-0"
          >
            <Menu size={24} />
          </button>

          <div className="font-medium text-sm md:text-base truncate hidden lg:block shrink-0">
            {nomeOficina}
          </div>

          <div className="flex-1 max-w-md ml-auto lg:ml-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar O.S, Cliente ou Placa..."
              className="pl-9 bg-[#F5F5F0] border-transparent focus-visible:ring-primary focus-visible:bg-white transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                Ctrl+K
              </kbd>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium leading-tight">{nomeUsuario}</div>
              <div className="text-xs text-gray-500">Gerente</div>
            </div>
            {avatarUrl ? (
              <img src={avatarUrl} alt={nomeUsuario} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
            ) : (
              <div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                {iniciaisUsuario}
              </div>
            )}
          </div>
        </header>

        <TrialBanner billing={billing} />
        <main className="flex-1 overflow-auto p-4 md:p-8 relative">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Carregando dados…</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
    </BillingGate>
  );
}
