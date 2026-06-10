"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-400 shadow-sm",
    secondary:
        "bg-brand-100 text-brand-700 hover:bg-brand-200 active:bg-brand-300 focus-visible:ring-brand-300",
    outline:
        "border border-brand-300 text-brand-600 bg-white hover:bg-brand-50 active:bg-brand-100 focus-visible:ring-brand-300",
    ghost:
        "text-brand-600 hover:bg-brand-50 active:bg-brand-100 focus-visible:ring-brand-300",
    danger:
        "bg-danger text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400 shadow-sm",
};

const sizeStyles: Record<Size, string> = {
    sm: "h-8  px-3 text-xs  gap-1.5",
    md: "h-10 px-4 text-sm  gap-2",
    lg: "h-12 px-6 text-base gap-2.5",
};

function Spinner( { className }: { className?: string } ) {
    return (
        <svg className={cn( "animate-spin", className )} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ( { variant = "primary", size = "md", loading = false, fullWidth = false, disabled, children, className, ...rest }, ref ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                aria-busy={loading}
                className={cn(
                    "inline-flex items-center justify-center font-medium rounded-xl",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    variantStyles[variant],
                    sizeStyles[size],
                    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    fullWidth && "w-full",
                    className
                )}
                {...rest}
            >
                {loading && <Spinner className={size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4"} />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";