import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { useGetTransaccionesPeriodo } from "@/hooks/use-transacciones";
import { useGetAprobacionesPendientes } from "@/hooks/use-aprobaciones";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, Wallet } from "lucide-react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [dateRange] = useState({
    inicio: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    fin: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  const { data: transacciones, isLoading: txLoading, isError: txError } = useGetTransaccionesPeriodo(dateRange.inicio, dateRange.fin);
  const { data: pendientes, isLoading: penLoading, isError: penError } = useGetAprobacionesPendientes();
  const hasError = txError || penError;

  const ingresos = transacciones?.filter(t => t.tipo === "INGRESO" && t.estadoAprobacion === "APROBADA").reduce((sum, t) => sum + t.monto, 0) || 0;
  const egresos = transacciones?.filter(t => t.tipo === "EGRESO" && t.estadoAprobacion === "APROBADA").reduce((sum, t) => sum + t.monto, 0) || 0;
  const balance = ingresos - egresos;
  
  const chartData = [
    { name: 'Ingresos', valor: ingresos, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Egresos', valor: egresos, fill: 'hsl(0, 84%, 60%)' },
  ];

  const statCards = [
    {
      title: "Balance Total Aprobado",
      value: formatCurrency(balance),
      icon: Wallet,
      description: "Ingresos - Egresos (Mes actual)",
      color: balance >= 0 ? "text-emerald-500" : "text-destructive",
    },
    {
      title: "Total Ingresos",
      value: formatCurrency(ingresos),
      icon: ArrowUpRight,
      description: "Volumen de entrada",
      color: "text-emerald-500",
    },
    {
      title: "Total Egresos",
      value: formatCurrency(egresos),
      icon: ArrowDownRight,
      description: "Volumen de salida",
      color: "text-destructive",
    },
    {
      title: "Aprobaciones Pendientes",
      value: pendientes?.length || 0,
      icon: Clock,
      description: "Requieren atención",
      color: "text-amber-500",
    }
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen financiero consolidado del periodo actual.</p>
        </div>

        {hasError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
            No se pudo cargar parte de la información del dashboard. Intenta recargar la página.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => (
            <Card key={idx} className="shadow-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {txLoading || penLoading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Flujo de Caja (Aprobado)</CardTitle>
              <CardDescription>Comparativa de ingresos y egresos del mes</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {txLoading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">Cargando datos...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
              <CardDescription>Últimos movimientos aprobados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {txLoading ? (
                   <div className="text-sm text-muted-foreground text-center py-4">Cargando...</div>
                ) : !transacciones || transacciones.filter(t => t.estadoAprobacion === "APROBADA").length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">Sin transacciones recientes.</div>
                ) : (
                  transacciones
                    .filter(t => t.estadoAprobacion === "APROBADA")
                    .slice(0, 5)
                    .map(t => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${t.tipo === 'INGRESO' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {t.tipo === 'INGRESO' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none max-w-[150px] truncate">{t.descripcion}</p>
                          <p className="text-xs text-muted-foreground">{t.sede.nombre}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${t.tipo === 'INGRESO' ? 'text-emerald-500' : 'text-foreground'}`}>
                        {t.tipo === 'INGRESO' ? '+' : '-'}{formatCurrency(t.monto, t.moneda)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
