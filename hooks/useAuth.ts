"use client";

import { useAuthStore, selectUser, selectIsAuthenticated, selectRole } from "@/store/authStore";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export function useAuth() {
    const router = useRouter();
    const user = useAuthStore( selectUser );
    const isAuthenticated = useAuthStore( selectIsAuthenticated );
    const role = useAuthStore( selectRole );
    const clearSession = useAuthStore( ( s ) => s.clearSession );

    const logout = () => {
        authService.logout();
        clearSession();
        router.push( "/login" );
    };

    return { user, isAuthenticated, role, logout };
}