"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          <Skeleton className="h-6 w-32" />
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg border p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="rounded-lg border p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="w-full h-80 rounded-lg border p-4">
          <Skeleton className="h-full" />
        </div>
      </div>
    </div>
  );
}
