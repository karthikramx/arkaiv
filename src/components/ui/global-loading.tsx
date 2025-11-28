"use client";

import { Spinner } from "@/components/ui/spinner";

interface GlobalLoadingProps {
  message?: string;
  isLoading: boolean;
}

export function GlobalLoading({ isLoading }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="h-8 w-8" />
      </div>
    </div>
  );
}
