import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Transaction { type: string; amount: number; transaction_date: string }

const TransactionChart = ({ transactions, month, year }: { transactions: Transaction[]; month: number; year: number }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grouped: Record<string, { received: number; sent: number }> = {};
  for (let day = 1; day <= daysInMonth; day += 1) grouped[`${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}`] = { received: 0, sent: 0 };
  transactions.forEach((tx) => {
    const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(tx.transaction_date));
    if (grouped[day]) grouped[day][tx.type === "received" ? "received" : "sent"] += Number(tx.amount);
  });
  const data = Object.entries(grouped).map(([day, values]) => ({ day, ...values }));

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Movimentação por dia</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 13 }} formatter={(value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))} />
          <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
          <Bar dataKey="received" name="Recebido" fill="hsl(var(--pix-received))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sent" name="Enviado" fill="hsl(var(--pix-sent))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
