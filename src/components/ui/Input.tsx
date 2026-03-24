import React, { InputHTMLAttributes, forwardRef } from 'react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1 text-[#121212] dark:text-white">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-md border font-inter
            bg-white dark:bg-[#0C0E12]
            text-[#121212] dark:text-white
            border-[#e5e5e5] dark:border-[#2a2d35]
            focus:outline-none focus:ring-2 focus:ring-[#936BDA] focus:border-transparent
            placeholder:text-[#999] dark:placeholder:text-[#666]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
