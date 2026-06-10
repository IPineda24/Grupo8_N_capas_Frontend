import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, UserRole, AuthResponse } from "@/types";

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;

    setSession: ( data: AuthResponse ) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        ( set ) => ( {
            user: null,
            token: null,
            isAuthenticated: false,

            setSession: ( data: AuthResponse ) => {
                const { token, type: _type, ...user } = data;

                if ( typeof window !== "undefined" ) {
                    // Nota: persist ya guarda todo el estado en 'mc-auth'.
                    // Conservamos esto asumiendo que alguna API externa lo lee directo.
                    localStorage.setItem( "mc_token", token );
                    // Sincronizar cookie para que middleware.ts pueda leerla en Edge Runtime
                    document.cookie = `mc_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
                }

                // Casteamos `user` para asegurar que cumple con AuthUser sin incluir `type`
                set( { user: user as unknown as AuthUser, token, isAuthenticated: true } );
            },

            clearSession: () => {
                if ( typeof window !== "undefined" ) {
                    localStorage.removeItem( "mc_token" );
                    document.cookie = "mc_token=; Max-Age=0; path=/;";
                }
                set( { user: null, token: null, isAuthenticated: false } );
            },
        } ),
        {
            name: "mc-auth",
            partialize: ( state ) => ( {
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            } ),
        }
    )
);

// ── Selectores ────────────────────────────────────────────────────────────
export const selectUser = ( s: AuthState ) => s.user;
export const selectIsAuthenticated = ( s: AuthState ) => s.isAuthenticated;
export const selectRole = ( s: AuthState ): UserRole | null => s.user?.role ?? null;
export const selectFullName = ( s: AuthState ) =>
    s.user ? `${s.user.nombre} ${s.user.apellido}` : "";