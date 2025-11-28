"use client";

import { Spinner } from "@/components/ui/spinner";

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({
  message = "Loading...",
  className = "min-h-[400px]",
}: PageLoadingProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
