import { z } from "zod";

export const updateStudent = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  grade: z.string().optional(),
  birth_date: z.preprocess((arg) => arg ? new Date(arg as string) : undefined, z.date().optional()),
});

export const insertStudentValidate = z.object({
  first_name: z.string(),
  last_name: z.string(),
  grade: z.string(),
  birth_date: z.preprocess(
    (arg) => arg ? new Date(arg as string) : undefined,
    z.date()
  ),
});