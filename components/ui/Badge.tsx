"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "brand";

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-neutral-100 text-neutral-600",
    success: "bg-success-light text-success-dark",
    warning: "bg-warning-light text-warning-dark",
    danger: "bg-danger-light text-danger-dark",
    info: "bg-info-light text-info-dark",
    brand: "bg-brand-100 text-brand-700",
};

export function Badge( {
    children,
    variant = "default",
    className,
}: {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
} ) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}