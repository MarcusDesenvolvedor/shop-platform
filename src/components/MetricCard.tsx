type Trend = "up" | "down" | "neutral";

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  trend: Trend;
};

const trendStyles: Record<Trend, string> = {
  up: "bg-emerald-50 text-emerald-700",
  down: "bg-rose-50 text-rose-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function MetricCard({ label, value, change, trend }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${trendStyles[trend]}`}>
          {change}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}

export type { MetricCardProps, Trend };
