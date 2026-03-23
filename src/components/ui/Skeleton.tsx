import React from 'react';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`animate-pulse bg-surface-low rounded-lg ${className}`} {...props} />
);
