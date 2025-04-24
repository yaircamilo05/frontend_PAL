import type { Category } from "./Category.model";
import type { User } from "./User.model";

/**
 * Modelo para la creación de cursos.
 */
export interface CourseCreate {
  title: string;
  description: string;
  price: number; 
  categoryId: number;
  instructorId: number;
}

/**
 * Modelo completo de un curso (para edición, visualización, etc.).
 */
export interface Course {
  id: number;
  title: string;
  description: string;
  price: number; 
  category: Category;
  instructor: User;
}
