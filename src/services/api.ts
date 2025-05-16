import type { Role } from "@/models/Roles.model";
import type { UserCreate } from "@/models/User.model";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Interceptor para agregar el Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwt"); // Obtén el token del sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Definir interfaces para TypeScript
interface Category {
  id: number;
  name: string;
}

interface CreateCategoryDTO {
  name: string;
}

interface Content {
  id: number;
  type: string;
  url: string;
  courseId: number;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  price: number | null;
  categoryId: number | null;
  instructorId: number | null;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  instructor: User;
}

interface User {
  id: number;
  username: string;
}

// Categories
export const getCategories = () => api.get<Category[]>("/categories/all");
export const createCategory = (data: CreateCategoryDTO) => api.post<Category>("/categories/create", data);
export const deleteCategory = (id: number) => api.delete(`/categories/delete/${id}`);

// Content
export const getContent = () => api.get<Content[]>("/content/all");
export const uploadContent = (fileData: FormData) => api.post("/content/upload", fileData);
export const deleteContent = (id: number) => api.delete(`/content/delete/${id}`);

// Courses
export const getCourses = () => api.get<Course[]>("/courses/all");
export const createCourse = (courseData: CreateCourseDTO) => {
  return api.post('/courses/create', courseData);
};
export const deleteCourse = (id: number) => api.delete(`/courses/delete/${id}`);

// Users
export const getUsers = () => api.get<User[]>("/users/all");
export const createUser = (userData: UserCreate) => {
  // Aseguramos que roles sea un arreglo de strings (nombres)
  const dataToSend = {
    ...userData,
    roles: Array.isArray(userData.roles) 
      ? userData.roles.map(role => typeof role === 'string' ? role : role.name)
      : []
  };
  
  return api.post("/users/create", dataToSend);
};
export const deleteUser = (id: number) => api.delete(`/users/delete/${id}`);
export const getUserByRoleName = (roleName: string) => api.get<User[]>(`/users/by-role?role=${roleName}`);

//Roles

export const getRoles = () => api.get<Role[]>("/roles/all");


//Enroll

export const enrollCourse = (courseId: number, userId: number) => {
  return api.post('/enrollments/register', { userId, courseId });
}

export const getMyEnrollments = (userId: number) => {
  return api.get(`/enrollments/my-courses/${userId}`);
}

// Procesar pago
export const processPayment = (paymentId: number) => {
  return api.post(`/payments/process/${paymentId}`);
}

export default api;