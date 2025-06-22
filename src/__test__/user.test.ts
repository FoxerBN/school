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

    describe("Create and Delete User", () => {
    let testUserId: number;

    it("should insert a new user", async () => {
      const userToInsert = {
        email: "testuser@skola.sk",
        password: "TestPassword123!",
        first_name: "Test",
        last_name: "User",
        role_id: Role.Teacher
      };

      const res = await request(app)
        .post("/api/users")
        .set("Cookie", adminCookie)
        .send(userToInsert);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe(userToInsert.email);
      testUserId = res.body.id;
    });

    it("should fetch the newly inserted user", async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("testuser@skola.sk");
      expect(res.body.id).toBe(testUserId);
    });

    it("should delete the newly inserted user", async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
    });

    it("should return 404 when trying to fetch deleted user", async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .set("Cookie", adminCookie);

      expect(res.status).toBe(404);
    });
  });

  describe("Logout Test", () => {
    it("should logout successfully", async () => {
      const res = await request(app)
        .post("/api/logout")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");
    });
  });

  afterAll(async () => {
    await sql.end();
  });

});


