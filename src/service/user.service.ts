import sql from "../config/postgres.db";
import { User } from "../interfaces/models/User";

export const getAllUsers = async (): Promise<User[]> => {
        const users = await sql<User[]>`SELECT * FROM users`;
        return users;
}

export const getUserById = async(id: number): Promise<User | null> => {
        const user = await sql<User[]> `SELECT * FROM users WHERE id = ${id}`;
        return user[0] || null;
}

export const deleteUserById = async (id: number): Promise<boolean> => {
        const result = await sql`DELETE FROM users WHERE id = ${id}`;
        return result.count > 0;
}

export const insertUser = async(
  user: Omit<User, 'id' | 'created_at' | 'updated_at'>
): Promise<User> => {
    const [newUser] = await sql<User[]>`
        INSERT INTO users (email, password, first_name, last_name, role_id)
        VALUES (${user.email},${user.password},${user.first_name},${user.last_name},${user.role_id})RETURNING *;`;
    return newUser;
}


