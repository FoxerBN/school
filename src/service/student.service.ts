import sql from "../config/postgres.db";
import { Student } from "../interfaces/models/Student";

export const getAllStudents = async(): Promise<Student[]> => {
    const students = await sql<Student[]>`SELECT * FROM students`;
    return students;
}

export const getStudentById = async(id: number): Promise<Student | null> => {
    const student = await sql<Student[]>`SELECT * FROM students WHERE id = ${id}`;
    return student[0] || null;
}