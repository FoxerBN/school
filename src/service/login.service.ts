import sql from "../config/postgres.db";
import { User } from "../interfaces/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    return user[0] || null;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}

//TODO check token settings
export const generateToken = async (userId: number, userRoleId: number): Promise<string> => {
    const token = jwt.sign(
        { id: userId, role: userRoleId },
        process.env.JWT_SECRET || "default",
        { expiresIn: "1h" }
    )
    return token;
}