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

