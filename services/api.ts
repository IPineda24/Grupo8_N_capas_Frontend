import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const api = axios.create( {
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15_000,
} );

// ── REQUEST: adjunta JWT automáticamente ──────────────────────────────────
api.interceptors.request.use(
    ( config: InternalAxiosRequestConfig ) => {
        if ( typeof window !== "undefined" ) {
            const token = localStorage.getItem( "mc_token" );
            if ( token ) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    ( error: AxiosError ) => Promise.reject( error )
);

// ── RESPONSE: manejo global de 401 ───────────────────────────────────────
api.interceptors.response.use(
    ( response ) => response,
    ( error: AxiosError ) => {
        if ( error.response?.status === 401 && typeof window !== "undefined" ) {
            localStorage.removeItem( "mc_token" );
            document.cookie = "mc_token=; Max-Age=0; path=/;";
            window.location.href = "/login";
        }
        return Promise.reject( error );
    }
);

export default api;