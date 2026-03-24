import React from 'react';

interface ICardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<ICardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white dark:bg-[#0C0E12]
        border border-[#e5e5e5] dark:border-[#2a2d35]
        rounded-lg shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<ICardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-[#e5e5e5] dark:border-[#2a2d35] ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<ICardProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<ICardProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-[#e5e5e5] dark:border-[#2a2d35] ${className}`}>
      {children}
    </div>
  );
};
