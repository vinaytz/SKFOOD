import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-250 ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';

  const variantClasses = {
    primary: 'bg-primary-900 hover:bg-primary-800 text-white focus:ring-primary-900/20 shadow-sm hover:shadow-md',
    secondary: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500/20 shadow-sm hover:shadow-md',
    outline: 'border border-primary-300 text-primary-900 hover:bg-primary-100 hover:border-primary-400 focus:ring-primary-900/10 bg-white',
    ghost: 'text-primary-700 hover:text-primary-900 hover:bg-primary-100 focus:ring-primary-900/10',
  };

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};