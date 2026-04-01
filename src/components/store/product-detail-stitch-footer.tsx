type ProductDetailStitchFooterProps = {
  storeName: string;
};

export function ProductDetailStitchFooter({ storeName }: ProductDetailStitchFooterProps) {
  return (
    <footer className="mt-20 w-full bg-[#f1f5f9] px-8 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-8">
        <div className="text-center lg:mb-0 lg:text-left">
          <div className="mb-4 text-lg font-black text-slate-900">{storeName}</div>
          <p className="mx-auto max-w-xs text-sm leading-relaxed tracking-wide text-slate-500 lg:mx-0">
            Editorial excellence in hardware. Crafted for the modern professional.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {["Privacy", "Terms", "Shipping", "Returns", "Sustainability"].map((label) => (
            <span
              key={label}
              className="cursor-default text-sm font-medium text-slate-500"
              role="presentation"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-6 text-slate-400 lg:mt-0">
          <span className="size-6 rounded-full border border-slate-300" aria-hidden />
          <span className="size-6 rounded-full border border-slate-300" aria-hidden />
          <span className="size-6 rounded-full border border-slate-300" aria-hidden />
        </div>
      </div>
    </footer>
  );
}
