"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: ModalSize;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Modal( { open, onClose, title, description, children, footer, size = "md" }: ModalProps ) {
    const dialogRef = useRef<HTMLDivElement>( null );

    useEffect( () => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open] );

    useEffect( () => {
        const handle = ( e: KeyboardEvent ) => { if ( e.key === "Escape" && open ) onClose(); };
        document.addEventListener( "keydown", handle );
        return () => document.removeEventListener( "keydown", handle );
    }, [open, onClose] );

    useEffect( () => {
        if ( open && dialogRef.current ) {
            const el = dialogRef.current.querySelector<HTMLElement>( "button, [href], input, select, textarea" );
            el?.focus();
        }
    }, [open] );

    if ( !open || typeof window === "undefined" ) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="absolute inset-0 bg-neutral-900/50 animate-fade-in" onClick={onClose} aria-hidden="true" />

            <div ref={dialogRef} className={cn( "relative z-10 w-full bg-white rounded-2xl shadow-modal animate-slide-up", sizeStyles[size] )}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-neutral-100">
                    <div>
                        <h2 id="modal-title" className="text-base font-semibold text-neutral-900">{title}</h2>
                        {description && <p className="mt-0.5 text-sm text-neutral-500">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="ml-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

// ── Footer de conveniencia ────────────────────────────────────────────────
export function ModalFooter( {
    onClose,
    onConfirm,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    loading = false,
    variant = "primary",
}: {
    onClose: () => void;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    variant?: "primary" | "danger";
} ) {
    return (
        <>
            <Button variant="outline" size="sm" onClick={onClose}>{cancelLabel}</Button>
            <Button variant={variant} size="sm" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
    );
}