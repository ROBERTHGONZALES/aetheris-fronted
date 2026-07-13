import { useEffect } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient, getAuthToken } from '@/lib/api';
import { useUser, type Rol } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import NotFound from '@/pages/not-found';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Transacciones from '@/pages/transacciones';
import Aprobaciones from '@/pages/aprobaciones';
import Presupuesto from '@/pages/presupuesto';
import Conciliacion from '@/pages/conciliacion';
import Sedes from '@/pages/sedes';
import Auditoria from '@/pages/auditoria';
import Usuarios from '@/pages/usuarios';
import AriaPage from '@/pages/aria';

// Debe reflejar los mismos @PreAuthorize del backend (ver SecurityConfig /
// cada controller). Si cambian los permisos allá, actualizar aquí también.
function ProtectedRoute({ component: Component, roles }: { component: any, roles?: Rol[] }) {
  const [location, setLocation] = useLocation();
  const token = getAuthToken();
  const user = useUser();
  const { toast } = useToast();

  const forbidden = !!token && !!roles && !!user && !roles.includes(user.rol);

  useEffect(() => {
    if (!token && location !== '/login') {
      setLocation('/login');
      return;
    }
    if (forbidden) {
      toast({
        variant: 'destructive',
        title: 'Acceso restringido',
        description: 'Tu rol no tiene permisos para ver esta sección.',
      });
      setLocation('/dashboard');
    }
  }, [token, location, setLocation, forbidden]);

  if (!token || forbidden) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => {
        const [, setLocation] = useLocation();
        useEffect(() => { setLocation('/dashboard') }, []);
        return null;
      }} />
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/transacciones"><ProtectedRoute component={Transacciones} roles={["ADMIN", "CONTADOR", "AUDITOR"]} /></Route>
      <Route path="/aprobaciones"><ProtectedRoute component={Aprobaciones} roles={["ADMIN", "APROBADOR"]} /></Route>
      <Route path="/presupuesto"><ProtectedRoute component={Presupuesto} roles={["ADMIN", "CONTADOR", "AUDITOR"]} /></Route>
      <Route path="/conciliacion"><ProtectedRoute component={Conciliacion} roles={["ADMIN", "CONTADOR", "AUDITOR"]} /></Route>
      <Route path="/sedes"><ProtectedRoute component={Sedes} roles={["ADMIN"]} /></Route>
      <Route path="/auditoria"><ProtectedRoute component={Auditoria} roles={["ADMIN", "AUDITOR"]} /></Route>
      <Route path="/usuarios"><ProtectedRoute component={Usuarios} roles={["ADMIN"]} /></Route>
      <Route path="/aria"><ProtectedRoute component={AriaPage} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalAuthGuard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleUnauthorized = () => {
      setLocation('/login');
    };
    const handleForbidden = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      toast({
        variant: 'destructive',
        title: 'Acción no permitida',
        description: detail?.message || 'No tienes permisos para realizar esta acción.',
      });
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    window.addEventListener('auth-forbidden', handleForbidden);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
      window.removeEventListener('auth-forbidden', handleForbidden);
    };
  }, [setLocation, toast]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <GlobalAuthGuard />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
