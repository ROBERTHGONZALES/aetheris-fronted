import { AppLayout } from "@/components/layout";
import {
  useGetUsuarios,
  useGetRoles,
  useCreateUsuario,
  useAsignarRol,
  useActivarUsuario,
  useDesactivarUsuario,
} from "@/hooks/use-usuarios";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus, Loader2, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

const createUsuarioSchema = z.object({
  nombreCompleto: z.string().min(3, "Nombre requerido"),
  correoElectronico: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export default function Usuarios() {
  const { data: usuarios, isLoading, isError, error } = useGetUsuarios();
  const { data: roles } = useGetRoles();
  const createU = useCreateUsuario();
  const asignarRol = useAsignarRol();
  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [pendingRolChange, setPendingRolChange] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createUsuarioSchema>>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: { nombreCompleto: "", correoElectronico: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof createUsuarioSchema>) => {
    createU.mutate(values, {
      onSuccess: () => {
        toast({ title: "Usuario creado" });
        setOpen(false);
        form.reset();
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "No se pudo crear el usuario", description: err?.message });
      },
    });
  };

  const handleAsignarRol = (usuarioId: string, rolId: string) => {
    setPendingRolChange(usuarioId);
    asignarRol.mutate({ id: usuarioId, rolId }, {
      onSuccess: () => {
        toast({ title: "Rol asignado" });
        setPendingRolChange(null);
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "No se pudo asignar el rol", description: err?.message });
        setPendingRolChange(null);
      },
    });
  };

  const handleToggleEstado = (usuarioId: string, activo: boolean) => {
    const mutation = activo ? desactivar : activar;
    mutation.mutate(usuarioId, {
      onSuccess: () => toast({ title: activo ? "Usuario desactivado" : "Usuario activado" }),
      onError: (err: any) => {
        toast({ variant: "destructive", title: "No se pudo actualizar el usuario", description: err?.message });
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            <p className="text-muted-foreground mt-1">Administración de cuentas y roles del sistema. Exclusivo de administradores.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Nuevo Usuario</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Usuario</DialogTitle>
                <DialogDescription>El usuario se crea sin rol asignado; asígnalo desde la tabla.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="nombreCompleto" render={({ field }) => (
                    <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="correoElectronico" render={({ field }) => (
                    <FormItem><FormLabel>Correo Corporativo</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Contraseña Temporal</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full mt-2" disabled={createU.isPending}>
                    {createU.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Registrar
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nombre / Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Cargando...</TableCell></TableRow>
              ) : isError ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-destructive">Error al cargar usuarios: {(error as any)?.message ?? "intenta de nuevo."}</TableCell></TableRow>
              ) : !usuarios || usuarios.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No hay usuarios registrados.</TableCell></TableRow>
              ) : (
                usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.nombreCompleto}</div>
                      <div className="text-xs text-muted-foreground">{u.correoElectronico}</div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.rol?.id ?? ""}
                        onValueChange={(rolId) => handleAsignarRol(u.id, rolId)}
                        disabled={pendingRolChange === u.id}
                      >
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue placeholder="Sin rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map((r) => (
                            <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {u.estado ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">ACTIVO</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">INACTIVO</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.ultimoLogin ? formatDate(u.ultimoLogin, true) : "Nunca"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEstado(u.id, u.estado)}
                        disabled={activar.isPending || desactivar.isPending}
                      >
                        {u.estado ? (
                          <><UserX className="h-4 w-4 mr-1 text-red-600" /> Desactivar</>
                        ) : (
                          <><UserCheck className="h-4 w-4 mr-1 text-emerald-600" /> Activar</>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
