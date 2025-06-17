import React from 'react';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", shimmer = true }) => {
  return (
    <div 
      className={`
        ${shimmer ? 'bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer' : 'animate-pulse bg-muted'} 
        rounded ${className}
      `}
      aria-label="Loading..."
    />
  );
};

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="bg-dark-card backdrop-blur-sm rounded-lg border border-border p-4 md:p-6 transition-all duration-300 hover:border-accent/20">
      {/* Project Image */}
      <div className="relative mb-4 overflow-hidden rounded-md">
        <Skeleton className="h-32 md:h-40 lg:h-48 w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
      </div>
      
      {/* Title and Featured Badge */}
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      
      {/* Description Lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      
      {/* Technology Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
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
    <div className="text-center space-y-6 py-8">
      {/* Profile Image */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-full" />
        </div>
      </div>
      
      {/* Name and Title */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
      </div>
      
      {/* Bio/Description Lines */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <Skeleton className="h-4 w-4/5 mx-auto" />
      </div>
      
      {/* Social Links */}
      <div className="flex justify-center space-x-4 pt-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      {/* CTA Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Skeleton className="h-11 w-32 rounded-md" />
        <Skeleton className="h-11 w-28 rounded-md" />
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