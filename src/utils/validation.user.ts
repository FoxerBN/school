import { z } from 'zod';

const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role_id: z.preprocess((val) => Number(val), z.number()),
});
