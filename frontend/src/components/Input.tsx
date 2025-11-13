import React, { forwardRef } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-primary-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-lg border-2 transition-all duration-250
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || hasError || hasSuccess ? 'pr-10' : ''}
              ${
                hasError
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : hasSuccess
                  ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                  : 'border-primary-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
              }
              ${props.disabled ? 'bg-primary-100 cursor-not-allowed opacity-60' : 'bg-white'}
              text-primary-900 placeholder-primary-400
              focus:outline-none
              ${className}
            `}
            {...props}
          />

          {(rightIcon || hasError || hasSuccess) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {hasError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : hasSuccess ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <span className="text-primary-400">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <p
            className={`mt-2 text-sm ${
              hasError
                ? 'text-red-600'
                : hasSuccess
                ? 'text-green-600'
                : 'text-primary-600'
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-primary-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-250 min-h-[120px]
            ${
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : hasSuccess
                ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                : 'border-primary-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
            }
            ${props.disabled ? 'bg-primary-100 cursor-not-allowed opacity-60' : 'bg-white'}
            text-primary-900 placeholder-primary-400
            focus:outline-none resize-y
            ${className}
          `}
          {...props}
        />

        {(error || success || helperText) && (
          <p
            className={`mt-2 text-sm ${
              hasError
                ? 'text-red-600'
                : hasSuccess
                ? 'text-green-600'
                : 'text-primary-600'
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-primary-900 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-250
            ${
              hasError
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-primary-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
            }
            ${props.disabled ? 'bg-primary-100 cursor-not-allowed opacity-60' : 'bg-white'}
            text-primary-900
            focus:outline-none
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {(error || helperText) && (
          <p className={`mt-2 text-sm ${hasError ? 'text-red-600' : 'text-primary-600'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
