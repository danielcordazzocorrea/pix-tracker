import { ArrowDownLeft, ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: "received" | "sent" | "total" | "balance";
  subtitle?: string;
}

const iconMap = {
  received: ArrowDownLeft,
  sent: ArrowUpRight,
  total: DollarSign,
  balance: TrendingUp,
};

const StatsCard = ({ title, value, icon, subtitle }: StatsCardProps) => {
  const Icon = iconMap[icon];
  const isReceived = icon === "received" || icon === "balance";

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div
          className={`rounded-lg p-2 ${
            isReceived ? "bg-pix-received-bg" : icon === "sent" ? "bg-pix-sent-bg" : "bg-secondary"
          }`}
        >
          <Icon
            size={18}
            className={
              isReceived
                ? "text-pix-received"
                : icon === "sent"
                ? "text-pix-sent"
                : "text-muted-foreground"
            }
          />
        </div>
      </div>
      <p className="text-2xl font-display font-semibold tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
