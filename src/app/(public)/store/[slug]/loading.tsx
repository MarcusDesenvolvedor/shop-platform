import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoadingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`store-loading-${index}`} className="rounded-xl border bg-card p-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-5/6" />
            <Skeleton className="mt-4 h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
