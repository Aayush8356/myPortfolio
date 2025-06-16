import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div 
      className={`animate-pulse bg-muted rounded ${className}`}
      aria-label="Loading..."
    />
  );
};

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-card backdrop-blur-sm rounded-lg border border-border p-4 md:p-6">
      <Skeleton className="h-32 md:h-40 lg:h-48 w-full mb-4" />
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-card backdrop-blur-sm rounded-lg border border-border p-4 md:p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
};