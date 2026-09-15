import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction { id: string; type: string; amount: number; description: string | null; sender_name: string | null; receiver_name: string | null; transaction_date: string; email_subject: string | null }
const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const time = (value: string) => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(value));
const label = (value: string) => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: "America/Sao_Paulo" }).format(new Date(value));
const keyFor = (value: string) => new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(value));

const TransactionTable = ({ transactions, isLoading }: { transactions: Transaction[]; isLoading: boolean }) => {
  if (isLoading) return <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">Carregando transações...</div>;
  if (!transactions.length) return <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground"><p className="text-lg font-display">Nenhuma transação</p><p className="text-sm mt-2">As transações Pix aparecerão aqui quando forem recebidas via automação.</p></div>;
  const grouped = transactions.reduce<Record<string, Transaction[]>>((result, tx) => { (result[keyFor(tx.transaction_date)] ??= []).push(tx); return result; }, {});

  return <div className="space-y-4">{Object.keys(grouped).sort((a, b) => b.localeCompare(a)).map((day) => {
    const rows = grouped[day];
    const total = rows.reduce((sum, tx) => sum + (tx.type === "received" ? tx.amount : -tx.amount), 0);
    return <div key={day} className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30"><span className="text-sm font-medium capitalize">{label(rows[0].transaction_date)}</span><span className={`text-sm font-semibold ${total >= 0 ? "text-pix-received" : "text-pix-sent"}`}>{total >= 0 ? "+" : "−"} {money(Math.abs(total))}</span></div>
      <Table><TableHeader><TableRow className="border-border hover:bg-transparent"><TableHead>Tipo</TableHead><TableHead>Pessoa</TableHead><TableHead>Valor</TableHead><TableHead>Horário</TableHead><TableHead className="hidden md:table-cell">Assunto</TableHead></TableRow></TableHeader>
      <TableBody>{rows.map((tx) => { const incoming = tx.type === "received"; return <TableRow key={tx.id} className="border-border hover:bg-accent/50"><TableCell><div className={`flex items-center gap-2 ${incoming ? "text-pix-received" : "text-pix-sent"}`}>{incoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}<span className="text-sm font-medium">{incoming ? "Recebido" : "Enviado"}</span></div></TableCell><TableCell className="text-sm">{(incoming ? tx.sender_name : tx.receiver_name) || "—"}</TableCell><TableCell><span className={`text-sm font-semibold ${incoming ? "text-pix-received" : "text-pix-sent"}`}>{incoming ? "+" : "−"} {money(tx.amount)}</span></TableCell><TableCell className="text-sm text-muted-foreground">{time(tx.transaction_date)}</TableCell><TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{tx.email_subject || "—"}</TableCell></TableRow>; })}</TableBody></Table>
    </div>;
  })}</div>;
};

export default TransactionTable;
