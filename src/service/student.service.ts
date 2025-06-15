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

export const editStudent = async (id: number, studentData: Partial<Student>): Promise<Student | null> => {
  if (Object.keys(studentData).length === 0) return null;

  const updates = Object.entries(studentData).map(
    ([key, value]) => sql`${sql.unsafe(key)} = ${value}`
  );

  const setClause = updates.reduce((prev, curr, index) => {
    return index === 0 ? curr : sql`${prev}, ${curr}`;
  });

  await sql`
    UPDATE students
    SET ${setClause}
    WHERE id = ${id}
  `;
  return await getStudentById(id);
};

export const deleteStudent = async(id: number): Promise<boolean> => {
  const result = await sql`DELETE FROM students WHERE id = ${id}`;
  return result.count > 0;
}
