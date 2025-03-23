import type { Category } from "./Category.model";
import type { User } from "./User.model";

export interface CourseCreate{
    title: String;
    description: String;
    price: number; 
    categoryId: number;
    instructorId: number;
}

export interface Course{
    title: String;
    description: String;
    price: number; 
    category: Category;
    instructor: User;
}