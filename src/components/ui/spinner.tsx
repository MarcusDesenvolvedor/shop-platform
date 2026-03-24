import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]",
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

type PageSpinnerProps = {
  message?: string;
};

export function PageSpinner({ message = "Loading..." }: PageSpinnerProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" className="text-indigo-600" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
