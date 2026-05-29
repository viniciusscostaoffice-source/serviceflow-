import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { OrdensServico } from './pages/OrdensServico';
import { OsNova } from './pages/OsNova';
import { OsDetalhe } from './pages/OsDetalhe';
import { Mecanicos } from './pages/Mecanicos';
import { RegrasComissao } from './pages/RegrasComissao';
import { Pendencias } from './pages/Pendencias';
import { Fechamento } from './pages/Fechamento';
import { Configuracoes } from './pages/Configuracoes';
import { MecanicoDetalhe } from './pages/MecanicoDetalhe';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { AppProvider } from './lib/AppContext';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Onboarding } from './pages/auth/Onboarding';
import { supabase } from './lib/supabase';

function syncUserData(user: { id: string; email?: string; user_metadata?: Record<string, string> }) {
  const meta = user.user_metadata ?? {};
  const nome = meta.nome ?? meta.full_name ?? meta.name ?? '';
  const oficina = meta.oficina ?? '';
  const avatar = meta.avatar_url ?? meta.picture ?? '';
  // Apenas dados de exibição no localStorage — nunca user_id (risco XSS)
  if (nome) localStorage.setItem('sf_usuario', nome);
  if (oficina) localStorage.setItem('sf_oficina', oficina);
  if (avatar) localStorage.setItem('sf_avatar', avatar);
  if (user.email) localStorage.setItem('sf_email', user.email);
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setChecking(false);
      if (data.session?.user) syncUserData(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      if (session?.user) syncUserData(session.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-[#FF6B1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return authed ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/os" element={<OrdensServico />} />
              <Route path="/os/nova" element={<OsNova />} />
              <Route path="/os/:id" element={<OsDetalhe />} />
              <Route path="/mecanicos" element={<Mecanicos />} />
              <Route path="/mecanicos/:id" element={<MecanicoDetalhe />} />
              <Route path="/regras-comissao" element={<RegrasComissao />} />
              <Route path="/pendencias" element={<Pendencias />} />
              <Route path="/fechamento" element={<Fechamento />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  );
}
