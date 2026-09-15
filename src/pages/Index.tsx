import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import StatsCard from "@/components/StatsCard";
import TransactionChart from "@/components/TransactionChart";
import TransactionTable from "@/components/TransactionTable";
import { createDemoTransactions, createDemoTransactionsForMonth, PixTransaction } from "@/lib/demo";

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const Index = () => {
  const [transactions] = useState<PixTransaction[]>(() => createDemoTransactions());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filtered = useMemo(() => {
    const matches = transactions.filter((tx) => { const date = new Date(tx.transaction_date); return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear; });
    return matches.length ? matches : createDemoTransactionsForMonth(selectedYear, selectedMonth);
  }, [transactions, selectedMonth, selectedYear]);
  const receivedRows = filtered.filter((tx) => tx.type === "received");
  const sentRows = filtered.filter((tx) => tx.type === "sent");
  const received = receivedRows.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const sent = sentRows.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const current = selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear();

  const moveMonth = (amount: number) => { const date = new Date(selectedYear, selectedMonth + amount, 1); setSelectedMonth(date.getMonth()); setSelectedYear(date.getFullYear()); };
  const goToday = () => { const now = new Date(); setSelectedMonth(now.getMonth()); setSelectedYear(now.getFullYear()); };

  return <div className="min-h-screen bg-background">
    <header className="border-b border-border px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div><BrandMark /><p className="text-xs text-muted-foreground mt-1 ml-10 hidden sm:block">Automação de transações via e-mail</p></div>
        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-xs text-muted-foreground">Dados demonstrativos</span></div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3"><button onClick={() => moveMonth(-1)} aria-label="Mês anterior" className="rounded-lg border border-border bg-card p-2 hover:bg-accent"><ChevronLeft size={18} /></button><p className="text-base sm:text-lg text-center min-w-[150px] sm:min-w-[180px] font-display font-semibold">{months[selectedMonth]} {selectedYear}</p><button onClick={() => moveMonth(1)} aria-label="Próximo mês" className="rounded-lg border border-border bg-card p-2 hover:bg-accent"><ChevronRight size={18} /></button></div>
        {!current && <button onClick={goToday} className="text-xs text-primary hover:underline">Voltar ao mês atual</button>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Recebido" value={money(received)} icon="received" subtitle={`${receivedRows.length} transações`} />
        <StatsCard title="Total Enviado" value={money(sent)} icon="sent" subtitle={`${sentRows.length} transações`} />
        <StatsCard title="Saldo" value={money(received - sent)} icon="balance" />
        <StatsCard title="Total de Transações" value={String(filtered.length)} icon="total" />
      </div>
      <TransactionChart transactions={filtered} month={selectedMonth} year={selectedYear} />
      <div><h2 className="text-lg font-display font-semibold mb-3">Transações — {months[selectedMonth]} {selectedYear}</h2><TransactionTable transactions={filtered} isLoading={false} /></div>
    </main>
  </div>;
};

export default Index;
