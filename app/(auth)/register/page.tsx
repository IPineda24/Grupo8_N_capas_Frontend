"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { getDashboardRoute } from "@/lib/utils";
import type { ApiError, RegisterRequest } from "@/types";

export default function RegisterPage() {
    const router = useRouter();
    const setSession = useAuthStore( ( s ) => s.setSession );

    const [form, setForm] = useState<RegisterRequest>( {
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
    } );
    const [confirmPassword, setConfirmPassword] = useState( "" );
    const [loading, setLoading] = useState( false );
    const [error, setError] = useState<string | null>( null );
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>( {} );

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const { name, value } = e.target;
        if ( name === "confirmPassword" ) {
            setConfirmPassword( value );
        } else {
            setForm( ( prev ) => ( { ...prev, [name]: value } ) );
        }
        if ( error ) setError( null );
        if ( fieldErrors[name] ) setFieldErrors( ( prev ) => ( { ...prev, [name]: "" } ) );
    };

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        if ( !form.nombre.trim() ) errors.nombre = "El nombre es requerido";
        if ( !form.apellido.trim() ) errors.apellido = "El apellido es requerido";
        if ( !form.email.trim() ) errors.email = "El correo es requerido";
        else if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( form.email ) ) errors.email = "Correo inválido";
        if ( !form.password ) errors.password = "La contraseña es requerida";
        else if ( form.password.length < 8 ) errors.password = "Mínimo 8 caracteres";
        if ( form.password !== confirmPassword ) errors.confirmPassword = "Las contraseñas no coinciden";

        setFieldErrors( errors );
        return Object.keys( errors ).length === 0;
    };

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();
        if ( !validate() ) return;

        setLoading( true );
        setError( null );

        try {
            const data = await authService.register( form );
            setSession( data );
            router.push( getDashboardRoute( data.role ) );
        } catch ( err ) {
            const apiError = err as ApiError;
            if ( apiError.status === 409 ) {
                setError( "Ya existe una cuenta con ese correo electrónico." );
            } else if ( apiError.errors ) {
                setFieldErrors( apiError.errors );
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
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-500 shadow-lg shadow-brand-200">
                    <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <h1 className="mt-4 text-2xl font-bold text-neutral-900">Crear cuenta</h1>
                <p className="mt-1 text-sm text-neutral-500">Regístrate como paciente en MediConnect</p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-8">
                {error && (
                    <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl bg-danger-light px-4 py-3 text-sm text-danger-dark border border-red-200">
                        <svg className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Nombre"
                            name="nombre"
                            placeholder="María"
                            value={form.nombre}
                            onChange={handleChange}
                            error={fieldErrors.nombre}
                            required
                            disabled={loading}
                        />
                        <Input
                            label="Apellido"
                            name="apellido"
                            placeholder="López"
                            value={form.apellido}
                            onChange={handleChange}
                            error={fieldErrors.apellido}
                            required
                            disabled={loading}
                        />
                    </div>

                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="maria@correo.com"
                        value={form.email}
                        onChange={handleChange}
                        error={fieldErrors.email}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Teléfono (opcional)"
                        name="telefono"
                        type="tel"
                        placeholder="+503 7000-0000"
                        value={form.telefono}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Mínimo 8 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        error={fieldErrors.password}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Confirmar contraseña"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={handleChange}
                        error={fieldErrors.confirmPassword}
                        required
                        disabled={loading}
                    />

                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        Crear cuenta
                    </Button>
                </form>
            </div>

            <p className="text-center mt-6 text-sm text-neutral-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">Inicia sesión</Link>
            </p>
        </div>
    );
}