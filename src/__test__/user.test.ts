import request from "supertest";
import app from "../app";
import { Role } from "../interfaces/models/role.enum";
import sql from "../config/postgres.db";
describe("Simple Login and User Tests", () => {
  let adminCookie: string;
  let adminUserId: number;


  describe("Login Test", () => {
    it("should login as admin with admin@skola.sk and password123", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ 
          email: "admin@skola.sk",
          password: "password123"
        });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe("admin@skola.sk");
      expect(res.body.user.role_id).toBe(Role.Admin);
      
      // Extract cookie
      const cookies = res.headers['set-cookie'];
      adminCookie = cookies?.[0] || '';
      adminUserId = 15;
      
      expect(adminCookie).toContain('token=');
    });
  });

  describe("Invalid email login",() => {
    it("should return 404 for non-existing email", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ 
          email: "richard@skola.sk",
          password: "password123"
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  })

  describe("User Fetch Tests", () => {
    it("should fetch all users", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should fetch one user by id", async () => {
      const res = await request(app)
        .get(`/api/users/${adminUserId}`)
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("teacher2@skola.sk");
      expect(res.body.id).toBe(adminUserId);
    });
  });
});

  afterAll(async () => {
    await sql.end(); // Close the postgres connection
  });


