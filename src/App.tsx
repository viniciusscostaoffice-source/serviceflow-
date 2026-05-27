/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
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
