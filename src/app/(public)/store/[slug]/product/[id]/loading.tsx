export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-12 h-4 w-64 animate-pulse rounded bg-[#eceef0]" />
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="aspect-square animate-pulse rounded-lg bg-[#eceef0]" />
            <div className="mt-6 grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-[#eceef0]" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="h-6 w-40 animate-pulse rounded bg-[#eceef0]" />
            <div className="h-10 w-full animate-pulse rounded bg-[#eceef0]" />
            <div className="h-8 w-32 animate-pulse rounded bg-[#eceef0]" />
            <div className="h-24 w-full animate-pulse rounded bg-[#eceef0]" />
            <div className="h-14 w-full animate-pulse rounded-lg bg-[#eceef0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
