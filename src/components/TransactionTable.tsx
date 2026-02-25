import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  sender_name: string | null;
  receiver_name: string | null;
  transaction_date: string;
  email_subject: string | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

const formatDayHeader = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

const getDayKey = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
};

const TransactionTable = ({ transactions, isLoading }: TransactionTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex items-center justify-center text-muted-foreground">
          Carregando transações...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
          <p className="text-lg font-display">Nenhuma transação</p>
          <p className="text-sm">As transações Pix aparecerão aqui quando forem recebidas via automação.</p>
        </div>
      </div>
    );
  }

  // Group transactions by day (Brasília timezone)
  const grouped: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    const key = getDayKey(tx.transaction_date);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(tx);
  }

  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {sortedDays.map((dayKey) => {
        const dayTxs = grouped[dayKey];
        const dayLabel = formatDayHeader(dayTxs[0].transaction_date);
        const dayTotal = dayTxs.reduce((sum, tx) => {
          return sum + (tx.type === "received" ? tx.amount : -tx.amount);
        }, 0);

        return (
          <div key={dayKey} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-sm font-medium capitalize">{dayLabel}</span>
              <span className={`text-sm font-semibold ${dayTotal >= 0 ? "text-pix-received" : "text-pix-sent"}`}>
                {dayTotal >= 0 ? "+" : "−"} {formatCurrency(Math.abs(dayTotal))}
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Tipo</TableHead>
                  <TableHead className="text-muted-foreground">Pessoa</TableHead>
                  <TableHead className="text-muted-foreground">Valor</TableHead>
                  <TableHead className="text-muted-foreground">Horário</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Assunto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayTxs.map((tx, i) => (
                  <TableRow
                    key={tx.id}
                    className="border-border hover:bg-accent/50 animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <TableCell>
                      <div className={`flex items-center gap-2 ${tx.type === "received" ? "text-pix-received" : "text-pix-sent"}`}>
                        {tx.type === "received" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        <span className="text-sm font-medium">
                          {tx.type === "received" ? "Recebido" : "Enviado"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {tx.type === "received" ? tx.sender_name : tx.receiver_name || "—"}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${tx.type === "received" ? "text-pix-received" : "text-pix-sent"}`}>
                        {tx.type === "received" ? "+" : "−"} {formatCurrency(tx.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTime(tx.transaction_date)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                      {tx.email_subject || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionTable;
