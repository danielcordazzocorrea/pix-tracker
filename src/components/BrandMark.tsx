import { cn } from "@/lib/utils";

const BrandMark = ({ compact = false, className }: { compact?: boolean; className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
    {!compact && <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">Pix Dashboard</span>}
  </div>
);

export default BrandMark;
