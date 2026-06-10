import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Tipos locales ─────────────────────────────────────────────────────────
type UserRole = "ROLE_ADMIN" | "ROLE_DOCTOR" | "ROLE_PACIENTE";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

const ROLE_HOME: Record<UserRole, string> = {
    ROLE_ADMIN: "/dashboard/admin",
    ROLE_DOCTOR: "/dashboard/doctor",
    ROLE_PACIENTE: "/dashboard/patient",
};

const ROLE_ALLOWED: Record<UserRole, string[]> = {
    ROLE_ADMIN: ["/dashboard/admin"],
    ROLE_DOCTOR: ["/dashboard/doctor"],
    ROLE_PACIENTE: ["/dashboard/patient"],
};

// Exportamos como 'proxy' tal cual te lo exige Next.js en tu versión
export function proxy( request: NextRequest ) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get( "mc_token" )?.value;

    const isPublic = PUBLIC_ROUTES.some(
        ( r ) => pathname === r || ( r !== "/" && pathname.startsWith( r + "/" ) )
    );

    // 1. Sin token → Redirigir a login si la ruta no es pública
    if ( !token && !isPublic ) {
        const url = new URL( "/login", request.url );
        url.searchParams.set( "redirect", pathname );
        return NextResponse.redirect( url );
    }

    // 2. Con token → Validar y enrutar
    if ( token ) {
        try {
            // Verificar que el token tenga la estructura básica de JWT antes de decodificar
            const parts = token.split( "." );
            if ( parts.length !== 3 ) throw new Error( "Token malformado" );

            const payload = JSON.parse( atob( parts[1] ) );
            const role = payload?.role as UserRole;

            // Evitar que usuarios autenticados entren a login/register
            if ( pathname === "/login" || pathname === "/register" ) {
                return NextResponse.redirect(
                    new URL( ROLE_HOME[role] ?? "/dashboard/patient", request.url )
                );
            }

            // Verificar acceso por rol al dashboard
            if ( pathname.startsWith( "/dashboard" ) ) {
                const allowed = ROLE_ALLOWED[role] ?? [];
                const hasAccess = allowed.some( ( prefix ) => pathname.startsWith( prefix ) );

                if ( !hasAccess ) {
                    return NextResponse.redirect(
                        new URL( ROLE_HOME[role] ?? "/login", request.url )
                    );
                }
            }
        } catch {
            // Si el token falló al decodificarse (corrupto/inválido), limpiamos y enviamos al login
            const res = NextResponse.redirect( new URL( "/login", request.url ) );
            res.cookies.delete( "mc_token" );
            return res;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};