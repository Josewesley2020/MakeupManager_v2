import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div className={`w-full max-w-2xl min-w-0 mx-auto px-3 sm:px-4 ${className}`}>
      {children}
    </div>
  );
};
