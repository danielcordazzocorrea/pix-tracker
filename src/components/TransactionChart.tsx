import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Transaction {
  type: string;
  amount: number;
  transaction_date: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

interface TransactionChartFullProps extends TransactionChartProps {
  month: number; // 0-indexed
  year: number;
}

const TransactionChart = ({ transactions, month, year }: TransactionChartFullProps) => {
  // Build all days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grouped: Record<string, { received: number; sent: number }> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${String(d).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}`;
    grouped[key] = { received: 0, sent: 0 };
  }

  for (const tx of transactions) {
    const date = new Date(tx.transaction_date);
    const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }).format(date);
    if (grouped[day]) {
      if (tx.type === "received") grouped[day].received += tx.amount;
      else grouped[day].sent += tx.amount;
    }
  }

  const data = Object.entries(grouped).map(([day, values]) => ({ day, ...values }));

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Dados do gráfico aparecerão com as transações.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Movimentação por dia</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
          <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 14% 16%)",
              borderRadius: "8px",
              color: "hsl(210 20% 92%)",
              fontSize: "13px",
            }}
            formatter={(value: number) =>
              new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
            }
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "hsl(215 15% 55%)" }}
          />
          <Bar dataKey="received" name="Recebido" fill="hsl(152 60% 48%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sent" name="Enviado" fill="hsl(0 72% 55%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
