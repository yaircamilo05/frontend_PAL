import type { Role } from "./Roles.moles";

export interface UserCreate {
    username: string;
    password: string;
    roles: Role[];
}