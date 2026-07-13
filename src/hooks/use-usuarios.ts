import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Rol } from './use-auth';

export interface RolCatalogo {
  id: string;
  nombre: Rol;
  descripcion?: string;
  estado: boolean;
}

export interface Usuario {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  rol: RolCatalogo;
  estado: boolean;
  ultimoLogin?: string | null;
  createdAt?: string;
}

/** GET /api/roles — catálogo de roles, exclusivo ADMIN (para poblar el selector). */
export function useGetRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => apiFetch<RolCatalogo[]>('/api/roles'),
  });
}

/** GET /api/usuarios — sin rolId lista todos los usuarios (pantalla de administración). */
export function useGetUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => apiFetch<Usuario[]>('/api/usuarios'),
  });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { nombreCompleto: string; correoElectronico: string; password: string }) =>
      apiFetch<Usuario>('/api/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useAsignarRol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rolId }: { id: string; rolId: string }) =>
      apiFetch(`/api/usuarios/${id}/rol?rolId=${encodeURIComponent(rolId)}`, { method: 'PUT' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useActivarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/usuarios/${id}/activar`, { method: 'PUT' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}

export function useDesactivarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/usuarios/${id}/desactivar`, { method: 'PUT' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  });
}
