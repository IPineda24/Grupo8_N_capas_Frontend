"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button"; // o "button", dependiendo de cómo nombraste el archivo
import { Input } from "@/components/ui/Input";   // o "input"
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { getDashboardRoute } from "@/lib/utils";
import type { ApiError } from "@/types";

// ── Icono de ojo ──────────────────────────────────────────────────────────
function EyeIcon( { open }: { open: boolean } ) {
    return open ? (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.003 10.003 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.003 10.003 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
    ) : (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" /><path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" /></svg>
    );
}

// ── Logo ──────────────────────────────────────────────────────────────────
function Logo() {
    return (
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-500 shadow-lg shadow-brand-200">
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        </div>
    );
}

// ── Página ────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const router = useRouter();
    const setSession = useAuthStore( ( s ) => s.setSession );

    const [form, setForm] = useState( { email: "", password: "" } );
    const [showPassword, setShowPassword] = useState( false );
    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        setForm( ( prev ) => ( { ...prev, [e.target.name]: e.target.value } ) );
        if ( error ) setError( null );
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        setLoading( true );
        setError( null );

        try {
            const data = await authService.login( form );
            setSession( data );
            router.push( getDashboardRoute( data.role ) );
        } catch ( err ) {
            const apiError = err as ApiError;
            if ( apiError.status === 401 ) {
                setError( "Correo o contraseña incorrectos." );
            } else if ( apiError.status === 0 ) {
                setError( "No se pudo conectar al servidor. Intenta más tarde." );
            } else {
                setError( apiError.message || "Ocurrió un error inesperado." );
            }
        } finally {
            setLoading( false );
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
                <Logo />
                <h1 className="mt-4 text-2xl font-bold text-neutral-900">MediConnect</h1>
                <p className="mt-1 text-sm text-neutral-500">Plataforma de telemedicina</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-8">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">Iniciar sesión</h2>
                <p className="text-sm text-neutral-500 mb-6">Ingresa tus credenciales para continuar</p>

                {/* Error */}
                {error && (
                    <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl bg-danger-light px-4 py-3 text-sm text-danger-dark border border-red-200">
                        <svg className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="doctor@mediconnect.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() => setShowPassword( ( v ) => !v )}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        }
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500" />
                            <span className="text-sm text-neutral-600">Recordarme</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth size="lg" loading={loading} disabled={!form.email || !form.password}>
                        Iniciar sesión
                    </Button>
                </form>
            </div>

            <p className="text-center mt-6 text-sm text-neutral-500">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-brand-600 hover:text-brand-700 font-medium">Regístrate gratis</Link>
            </p>
        </div>
    );
}