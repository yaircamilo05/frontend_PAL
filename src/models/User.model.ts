import type { Role } from "./Roles.moles";

// Interfaz para crear un usuario
export interface UserCreate {
    username: string;
    password: string;
    roles: Role[]; // Solo se envían los nombres de los roles al crear
}

// Interfaz para obtener un usuario desde el backend
export interface User {
    id: number;
    username: string;
    roles: Role[]; // El backend devuelve objetos Role completos
}