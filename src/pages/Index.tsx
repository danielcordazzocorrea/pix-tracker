import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/StatsCard";
import TransactionTable from "@/components/TransactionTable";
import TransactionChart from "@/components/TransactionChart";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  sender_name: string | null;
  receiver_name: string | null;
  transaction_date: string;
  email_subject: string | null;
  email_from: string | null;
  email_snippet: string | null;
  email_id: string | null;
  created_at: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("pix_transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();

    const channel = supabase
      .channel("pix-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pix_transactions" },
        () => fetchTransactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.transaction_date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totalReceived = filteredTransactions
    .filter((t) => t.type === "received")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalSent = filteredTransactions
    .filter((t) => t.type === "sent")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalReceived - totalSent;

  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const isCurrentMonth =
    selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight">Pix Dashboard</h1>
              <p className="text-xs text-muted-foreground">Automação de transações via e-mail</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Realtime</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Month Picker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevMonth}
              className="rounded-lg border border-border bg-card p-2 hover:bg-accent transition-colors"
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>
            <div className="text-center min-w-[180px]">
              <p className="text-lg font-display font-semibold">
                {MONTH_NAMES[selectedMonth]} {selectedYear}
              </p>
            </div>
            <button
              onClick={goToNextMonth}
              className="rounded-lg border border-border bg-card p-2 hover:bg-accent transition-colors"
            >
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setSelectedMonth(new Date().getMonth());
                setSelectedYear(new Date().getFullYear());
              }}
              className="text-xs text-primary hover:underline"
            >
              Voltar ao mês atual
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Recebido"
            value={formatCurrency(totalReceived)}
            icon="received"
            subtitle={`${filteredTransactions.filter((t) => t.type === "received").length} transações`}
          />
          <StatsCard
            title="Total Enviado"
            value={formatCurrency(totalSent)}
            icon="sent"
            subtitle={`${filteredTransactions.filter((t) => t.type === "sent").length} transações`}
          />
          <StatsCard
            title="Saldo"
            value={formatCurrency(balance)}
            icon="balance"
          />
          <StatsCard
            title="Total de Transações"
            value={String(filteredTransactions.length)}
            icon="total"
          />
        </div>

        {/* Chart */}
        <TransactionChart transactions={filteredTransactions} month={selectedMonth} year={selectedYear} />

        {/* Table */}
        <div>
          <h2 className="text-lg font-display font-semibold mb-3">
            Transações — {MONTH_NAMES[selectedMonth]} {selectedYear}
          </h2>
          <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
