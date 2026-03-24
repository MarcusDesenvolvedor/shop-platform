import Link from "next/link";

type StorefrontHeaderProps = {
  storeName: string;
  storeSlug: string;
};

export function StorefrontHeader({ storeName, storeSlug }: StorefrontHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/store/${storeSlug}`} className="text-lg font-semibold tracking-tight">
          {storeName}
        </Link>
      </div>
    </header>
  );
}
