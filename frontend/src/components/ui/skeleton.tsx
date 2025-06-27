import React from 'react';

// Premium Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        className="animate-spin h-full w-full text-primary" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-label="Loading..."
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Premium Page Loading Component
export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="relative">
          <LoadingSpinner size="lg" className="mx-auto" />
          <div className="absolute inset-0 animate-ping">
            <LoadingSpinner size="lg" className="mx-auto opacity-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
};

// Premium Content Loading Component
export const ContentLoader: React.FC<{ message?: string }> = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 space-y-4">
      <div className="relative">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm sm:text-base text-muted-foreground font-medium">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", shimmer = true }) => {
  return (
    <div 
      className={`
        ${shimmer ? 'skeleton-gradient' : 'animate-pulse bg-muted'} 
        rounded-lg ${className}
      `}
      aria-label="Loading..."
    />
  );
};

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="group bg-dark-card/80 backdrop-blur-sm rounded-2xl border border-border/20 p-0 transition-all duration-500 hover:border-primary/40 shadow-lg animate-fade-in-up">
      {/* Project Image */}
      <div className="relative mb-0 overflow-hidden rounded-t-2xl">
        <Skeleton className="h-32 sm:h-36 md:h-40 lg:h-48 w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
        <div className="loading-overlay" />
      </div>
      
      {/* Content Container */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Title and Featured Badge */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
          <Skeleton className="h-6 sm:h-7 w-32 sm:w-40" />
          <Skeleton className="h-5 w-16 sm:w-20 rounded-full" />
        </div>
        
        {/* Description Lines */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full sm:w-4/5" />
          <Skeleton className="h-4 w-3/5 sm:w-3/4" />
        </div>
        
        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-6 sm:h-7 w-16 sm:w-20 rounded-full" />
          <Skeleton className="h-6 sm:h-7 w-20 sm:w-24 rounded-full" />
          <Skeleton className="h-6 sm:h-7 w-14 sm:w-18 rounded-full" />
          <Skeleton className="h-6 sm:h-7 w-18 sm:w-22 rounded-full" />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Skeleton className="h-9 sm:h-10 w-full sm:w-24 md:w-28 rounded-md" />
          <Skeleton className="h-9 sm:h-10 w-full sm:w-24 md:w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-card backdrop-blur-sm rounded-lg border border-border p-4 md:p-6 transition-all duration-300">
      {/* Contact Info Title */}
      <div className="mb-6">
        <Skeleton className="h-7 w-36 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      {/* Contact Items */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        {/* Phone */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      
      {/* Social Links or Additional Info */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12 md:py-16 animate-fade-in-up">
      {/* Name and Title */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 mx-auto" />
        </div>
        <Skeleton className="h-10 sm:h-12 md:h-16 lg:h-20 w-64 sm:w-80 md:w-96 lg:w-[28rem] mx-auto" />
        <Skeleton className="h-6 sm:h-8 md:h-10 lg:h-12 w-48 sm:w-64 md:w-80 lg:w-96 mx-auto" />
      </div>
      
      {/* Bio/Description Lines */}
      <div className="space-y-3 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4">
        <Skeleton className="h-4 sm:h-5 md:h-6 w-full" />
        <Skeleton className="h-4 sm:h-5 md:h-6 w-5/6 mx-auto" />
        <Skeleton className="h-4 sm:h-5 md:h-6 w-4/5 mx-auto" />
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 px-4">
        <Skeleton className="h-11 sm:h-12 w-full sm:w-36 md:w-40 rounded-lg" />
        <Skeleton className="h-11 sm:h-12 w-full sm:w-32 md:w-36 rounded-lg" />
        <Skeleton className="h-11 sm:h-12 w-full sm:w-28 md:w-32 rounded-lg" />
      </div>
      
      {/* Social Links */}
      <div className="flex justify-center space-x-6 sm:space-x-8 md:space-x-10 pt-4">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full" />
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full" />
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full" />
      </div>
    </div>
  );
};

export const AboutSkeleton: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column - Bio */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        {/* Stats or Highlights */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-4 bg-dark-card rounded-lg">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
          <div className="text-center p-4 bg-dark-card rounded-lg">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
      </div>
      
      {/* Right Column - Skills/Experience */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-36" />
          
          {/* Skill Categories */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-18 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-22 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-18 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-22 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Form Title */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          <Skeleton className="h-11 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};