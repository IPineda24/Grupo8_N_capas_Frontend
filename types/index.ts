// ═══════════════════════════════════════════════════════════════════════════
// TIPOS GLOBALES — MediConnect
// Basados en: documento de roles + endpoints del backend
// ═══════════════════════════════════════════════════════════════════════════

// ── Roles ─────────────────────────────────────────────────────────────────
export type UserRole = "ROLE_ADMIN" | "ROLE_DOCTOR" | "ROLE_PACIENTE";

// ── Autenticación ─────────────────────────────────────────────────────────
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
}

export interface AuthResponse {
    token: string;
    type: "Bearer";
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    role: UserRole;
}

export interface AuthUser {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    role: UserRole;
}

// ── Respuestas genéricas de la API ────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string>;
}

// ── Especialidades ────────────────────────────────────────────────────────
export interface Especialidad {
    id: number;
    nombre: string;
    descripcion: string;
    activa: boolean;
}

// ── Doctores ──────────────────────────────────────────────────────────────
export interface Doctor {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    especialidad: Especialidad;
    tarifa: number;
    horarios: Horario[];
    fotoPerfil?: string;
    activo: boolean;
    calificacionPromedio?: number;
    totalCitas?: number;
}

export interface Horario {
    id: number;
    diaSemana: DiaSemana;
    horaInicio: string; // "08:00"
    horaFin: string;    // "17:00"
}

export type DiaSemana =
    | "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES"
    | "VIERNES" | "SABADO" | "DOMINGO";

// ── Citas ─────────────────────────────────────────────────────────────────
export type EstadoCita =
    | "PENDIENTE" | "CONFIRMADA" | "EN_CURSO"
    | "COMPLETADA" | "CANCELADA" | "NO_ASISTIO";

export interface Cita {
    id: number;
    doctor: Doctor;
    paciente: Paciente;
    fechaHora: string;
    duracionMinutos: number;
    estado: EstadoCita;
    motivo: string;
    enlaceVideollamada?: string;
    notaSeguimiento?: string;
    calificacion?: number;
    monto: number;
    pagado: boolean;
}

export interface ReservarCitaRequest {
    doctorId: number;
    fechaHora: string;
    motivo: string;
    paymentMethodId?: string;
}

// ── Pacientes ─────────────────────────────────────────────────────────────
export interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    fechaNacimiento?: string;
    genero?: "MASCULINO" | "FEMENINO" | "OTRO";
}

// ── Historial clínico ─────────────────────────────────────────────────────
export interface HistorialClinico {
    id: number;
    pacienteId: number;
    citas: Cita[];
    recetas: Receta[];
    documentos: DocumentoMedico[];
}

// ── Recetas digitales ─────────────────────────────────────────────────────
export interface Receta {
    id: number;
    doctorId: number;
    pacienteId: number;
    citaId: number;
    medicamentos: Medicamento[];
    indicaciones: string;
    hash: string;
    fechaEmision: string;
    usosDisponibles: number; // máx 3
    usosConsumidos: number;
    vigente: boolean;
}

export interface Medicamento {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
}

// ── Documentos adjuntos ───────────────────────────────────────────────────
export interface DocumentoMedico {
    id: number;
    nombre: string;
    tipo: string;
    url: string;
    subidoPor: UserRole;
    fechaSubida: string;
}

// ── Reportes (Admin) ──────────────────────────────────────────────────────
export interface ReporteDoctorSolicitado {
    doctor: Doctor;
    totalCitas: number;
    calificacionPromedio: number;
    ingresoGenerado: number;
}

// ── Configuración del sistema (Admin) ─────────────────────────────────────
export interface ConfiguracionSistema {
    horasMinCancelacion: number;
    porcentajeReembolso: number;
    maxRecetaReutilizable: number;
}