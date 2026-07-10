import { AppLayout } from "@/components/layout";
import { useGetAuditoria } from "@/hooks/use-auditoria";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function Auditoria() {
  const { data: logs, isLoading, isError, error } = useGetAuditoria();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Auditoría</h1>
          <p className="text-muted-foreground mt-1">Trazabilidad inmutable de acciones críticas en el sistema.</p>
        </div>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Eventos del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Entidad Afectada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Cargando logs...</TableCell></TableRow>
                ) : isError ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-destructive">Error al cargar auditoría: {(error as any)?.message ?? "intenta de nuevo."}</TableCell></TableRow>
                ) : !logs || logs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">No hay registros de auditoría.</TableCell></TableRow>
                ) : (
                  logs.map((l, idx) => (
                    <TableRow key={l.id || idx}>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{formatDate(l.fecha, true)}</TableCell>
                      <TableCell className="font-medium">{l.usuario}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                          {l.accion}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{l.entidad}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
