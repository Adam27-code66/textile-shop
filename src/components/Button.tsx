import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#8B3DFF]/50 focus:ring-offset-2 focus:ring-offset-[#08090C] disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white hover:from-[#7a2ef0] hover:to-[#a83ef0] hover:shadow-[0_0_30px_rgba(139,61,255,0.3)]',
    secondary:
      'bg-white text-[#08090C] hover:bg-gray-100',
    outline:
      'border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
    ghost:
      'text-white/70 hover:text-white hover:bg-white/5',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-sm',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
