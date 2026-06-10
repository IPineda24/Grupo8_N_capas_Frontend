import type { AuthResponse } from "@/types";

export const MOCK_USERS: Record<string, AuthResponse> = {
    "admin@mediconnect.com": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluQG1lZGljb25uZWN0LmNvbSJ9.mock",
        type: "Bearer",
        id: 1,
        email: "admin@mediconnect.com",
        nombre: "Carlos",
        apellido: "Rodríguez",
        role: "ROLE_ADMIN",
    },
    "doctor@mediconnect.com": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9ET0NUT1IiLCJzdWIiOiJkb2N0b3JAbWVkaWNvbm5lY3QuY29tIn0.mock",
        type: "Bearer",
        id: 2,
        email: "doctor@mediconnect.com",
        nombre: "Ana",
        apellido: "Martínez",
        role: "ROLE_DOCTOR",
    },
    "paciente@mediconnect.com": {
        token: "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9QQUNJRU5URSIsInN1YiI6InBhY2llbnRlQG1lZGljb25uZWN0LmNvbSJ9.mock",
        type: "Bearer",
        id: 3,
        email: "paciente@mediconnect.com",
        nombre: "Luis",
        apellido: "García",
        role: "ROLE_PACIENTE",
    },
};

export const MOCK_PASSWORD = "password123";

export const mockDelay = () =>
    new Promise( ( resolve ) => setTimeout( resolve, Math.floor( Math.random() * 400 ) + 200 ) );