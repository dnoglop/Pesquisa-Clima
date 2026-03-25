import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="p-4 mt-5 space-y-8 max-full mx-[30px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>

      {/* Charts/Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>

      {/* Bottom Content */}
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}
