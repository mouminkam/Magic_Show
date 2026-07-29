export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "h-8 w-8 border-2",
  md: "h-32 w-32 border-b-2",
  lg: "h-48 w-48 border-b-4",
};

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-ink-900 ${SIZE_CLASSES[size]}`}
        role="status"
      >
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
