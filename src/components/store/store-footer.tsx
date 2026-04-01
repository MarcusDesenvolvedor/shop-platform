type StoreFooterProps = {
  storeName: string;
};

export function StoreFooter({ storeName }: StoreFooterProps) {
  return (
    <footer className="border-t border-[#c7c4d7]/30 bg-[#f2f4f6]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
        <div>
          <p className="text-lg font-black uppercase tracking-widest text-[#191c1e]">{storeName}</p>
          <p className="mt-2 max-w-xs text-sm text-[#464554]">
            Setting the standard for modern e-commerce experiences with an editorial focus.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-7 text-sm font-medium uppercase tracking-widest text-[#464554]">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
          <a href="#">Shipping</a>
        </div>
      </div>
    </footer>
  );
}
