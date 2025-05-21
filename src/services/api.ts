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

// Define interface for question option
interface QuestionOptionDTO {
  id: number;
  text: string;
  isCorrect: boolean | null;
}

// Define types of questions
enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_ANSWER = 'MULTIPLE_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY'
}

// Define interface for question
interface QuestionDTO {
  id: number;
  text: string;
  points: number;
  type: QuestionType;
  correctAnswer: string | null;
  options: QuestionOptionDTO[] | null;
}

// Updated ExamAttemptDTO to match the actual response structure
interface ExamAttemptDTO {
  id: number;
  examId: number;
  examTitle: string;
  startTime: string;
  timeLimit: number;
  totalQuestions: number;
  questions: QuestionDTO[];
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

// Detalles del curso
export const getCourseDetails = (courseId: number) => {
  return api.get(`/courses/${courseId}/details`);
}

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

// Exámenes
export const startExam = (examId: number, userId: number) => {
  return api.post<ExamAttemptDTO>(`/exams/${examId}/start?userId=${userId}`);
}

export const getExamById = (examId: number) => {
  return api.get<QuestionDTO[]>(`/exams/${examId}/questions`);
}

export const submitExam = (examId: number, userId: number, submission: any) => {
  return api.post(`/exams/submit/${examId}?userId=${userId}`, submission);
}

export const getExamResults = (examId: number, userId: number) => {
  return api.get(`/exams/results/${examId}?userId=${userId}`);
}

export default api;