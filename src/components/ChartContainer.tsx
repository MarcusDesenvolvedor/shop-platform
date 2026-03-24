type LinePoint = {
  label: string;
  value: number;
};

type CategoryPoint = {
  label: string;
  value: number;
};

type ChartContainerProps = {
  title: string;
  subtitle: string;
  points: LinePoint[];
  categories: CategoryPoint[];
};

function buildPath(points: LinePoint[]) {
  if (points.length === 0) {
    return "";
  }

  const maxValue = Math.max(...points.map((point) => point.value));
  const minValue = Math.min(...points.map((point) => point.value));
  const spread = maxValue - minValue || 1;

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const normalized = (point.value - minValue) / spread;
      const y = 90 - normalized * 70;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function ChartContainer({ title, subtitle, points, categories }: ChartContainerProps) {
  const linePath = buildPath(points);

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="h-56 rounded-lg bg-slate-50 p-3">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={linePath} fill="none" stroke="rgb(79 70 229)" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2 text-xs text-slate-500">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Order Volume</h3>
        <p className="text-sm text-slate-500">Distribution by category</p>

        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>{category.label}</span>
                <span>{category.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${category.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export type { CategoryPoint, ChartContainerProps, LinePoint };
