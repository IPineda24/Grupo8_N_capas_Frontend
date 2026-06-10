"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ( { label, error, hint, leftIcon, rightIcon, fullWidth = true, id, className, disabled, ...rest }, ref ) => {
        const inputId = id ?? label?.toLowerCase().replace( /\s+/g, "-" );

        return (
            <div className={cn( "flex flex-col gap-1.5", fullWidth && "w-full" )}>
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
                        {label}
                        {rest.required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        disabled={disabled}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        className={cn(
                            "block rounded-xl border bg-white text-neutral-900 text-sm",
                            "placeholder:text-neutral-400",
                            "transition-shadow duration-150",
                            "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
                            leftIcon ? "pl-10" : "pl-3.5",
                            rightIcon ? "pr-10" : "pr-3.5",
                            "py-2.5 h-10",
                            fullWidth && "w-full",
                            !error && "border-neutral-300 hover:border-neutral-400",
                            error && "border-danger focus:ring-danger focus:border-danger",
                            disabled && "opacity-50 cursor-not-allowed bg-neutral-50",
                            className
                        )}
                        {...rest}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-3 flex items-center text-neutral-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p id={`${inputId}-error`} role="alert" className="text-xs text-danger flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        {error}
                    </p>
                )}

                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-xs text-neutral-500">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";