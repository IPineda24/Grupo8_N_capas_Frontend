import api from "@/services/api";
import { AxiosError } from "axios";
import type { LoginRequest, RegisterRequest, AuthResponse, ApiError } from "@/types";

function toApiError( error: unknown ): ApiError {
    if ( error instanceof AxiosError && error.response ) {
        const data = error.response.data as { message?: string; errors?: Record<string, string> };
        return {
            message: data?.message ?? "Error desconocido",
            status: error.response.status,
            errors: data?.errors,
        };
    }
    return { message: "Error de conexión con el servidor", status: 0 };
}

export const authService = {
    async login( credentials: LoginRequest ): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>( "/api/auth/login", credentials );
            return data;
        } catch ( error ) {
            throw toApiError( error );
        }
    },

    async register( payload: RegisterRequest ): Promise<AuthResponse> {
        try {
            const { data } = await api.post<AuthResponse>( "/api/auth/register", payload );
            return data;
        } catch ( error ) {
            throw toApiError( error );
        }
    },

    logout(): void {
        if ( typeof window !== "undefined" ) {
            localStorage.removeItem( "mc_token" );
            document.cookie = "mc_token=; Max-Age=0; path=/;";
        }
    },
};