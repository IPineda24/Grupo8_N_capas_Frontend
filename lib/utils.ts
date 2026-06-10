import type { EstadoCita, UserRole } from "@/types";

// ── CSS classes helper ────────────────────────────────────────────────────
export function cn( ...classes: ( string | boolean | undefined | null )[] ): string {
    return classes.filter( Boolean ).join( " " );
}

// ── Fechas ────────────────────────────────────────────────────────────────
export function formatDate( isoString: string ): string {
    return new Date( isoString ).toLocaleDateString( "es-SV", {
        day: "numeric",
        month: "long",
        year: "numeric",
    } );
}

export function formatDateTime( isoString: string ): string {
    return new Date( isoString ).toLocaleString( "es-SV", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    } );
}

export function formatTime( isoString: string ): string {
    return new Date( isoString ).toLocaleTimeString( "es-SV", {
        hour: "2-digit",
        minute: "2-digit",
    } );
}

// ── Moneda ────────────────────────────────────────────────────────────────
export function formatCurrency( amount: number ): string {
    return new Intl.NumberFormat( "es-SV", {
        style: "currency",
        currency: "USD",
    } ).format( amount );
}

// ── Estados de cita ───────────────────────────────────────────────────────
const estadoConfig: Record<EstadoCita, { label: string; color: string }> = {
    PENDIENTE: { label: "Pendiente", color: "bg-warning-light text-warning-dark" },
    CONFIRMADA: { label: "Confirmada", color: "bg-info-light text-info-dark" },
    EN_CURSO: { label: "En curso", color: "bg-brand-100 text-brand-800" },
    COMPLETADA: { label: "Completada", color: "bg-success-light text-success-dark" },
    CANCELADA: { label: "Cancelada", color: "bg-danger-light text-danger-dark" },
    NO_ASISTIO: { label: "No asistió", color: "bg-neutral-100 text-neutral-600" },
};

export function getEstadoCitaConfig( estado: EstadoCita ) {
    return estadoConfig[estado] ?? { label: estado, color: "bg-neutral-100 text-neutral-600" };
}

// ── Roles ─────────────────────────────────────────────────────────────────
const roleLabels: Record<UserRole, string> = {
    ROLE_ADMIN: "Administrador",
    ROLE_DOCTOR: "Doctor",
    ROLE_PACIENTE: "Paciente",
};

export function getRoleLabel( role: UserRole ): string {
    return roleLabels[role] ?? role;
}

export function getDashboardRoute( role: UserRole ): string {
    const routes: Record<UserRole, string> = {
        ROLE_ADMIN: "/dashboard/admin",
        ROLE_DOCTOR: "/dashboard/doctor",
        ROLE_PACIENTE: "/dashboard/patient",
    };
    return routes[role] ?? "/dashboard/patient";
}

// ── Cancelación (regla de negocio: 4h antes → 80% reembolso) ─────────────
export function puedeReembolsar( fechaHoraCita: string ): boolean {
    const ahora = new Date();
    const cita = new Date( fechaHoraCita );
    const diferenciaHoras = ( cita.getTime() - ahora.getTime() ) / ( 1000 * 60 * 60 );
    return diferenciaHoras >= 4;
}

// ── Avatar ────────────────────────────────────────────────────────────────
export function getInitials( nombre: string, apellido?: string ): string {
    const first = nombre.charAt( 0 ).toUpperCase();
    const second = ( apellido ?? "" ).charAt( 0 ).toUpperCase();
    return second ? `${first}${second}` : first;
}