import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface LogAuditoria {
  id?: string;
  usuario: string;
  accion: string;
  entidad: string;
  fecha: string;
}

export function useGetAuditoria() {
  return useQuery({
    queryKey: ['auditoria'],
    queryFn: () => apiFetch<LogAuditoria[]>('/api/auditoria'),
  });
}
