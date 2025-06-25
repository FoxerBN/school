import request from "supertest";
import app from "../app";
import { Role } from "../interfaces/models/role.enum";
import sql from "../config/postgres.db";

describe("Student API Tests", () => {
  let adminCookie: string;
  let createdStudentId: number;

  beforeAll(async () => {
    // Login as admin to get cookie
    const res = await request(app)
      .post("/api/login")
      .send({ email: "admin@skola.sk", password: "password123" });
    adminCookie = res.headers['set-cookie']?.[0] || '';
  });

  it("should fetch all students", async () => {
    const res = await request(app)
      .get("/api/students")
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should create a new student", async () => {
    const studentData = {
      first_name: "Test",
      last_name: "Student",
      grade: "5A",
      birth_date: "2010-09-01"
    };
    const res = await request(app)
      .post("/api/students")
      .set("Cookie", adminCookie)
      .send(studentData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.first_name).toBe(studentData.first_name);
    createdStudentId = res.body.id;
  });

  it("should fetch one student by id", async () => {
    const res = await request(app)
      .get(`/api/students/${createdStudentId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdStudentId);
  });

  it("should edit a student", async () => {
    const updateData = {
      first_name: "Updated",
      last_name: "Student",
      grade: "6B",
      birth_date: "2010-09-01"
    };
    const res = await request(app)
      .put(`/api/students/${createdStudentId}`)
      .set("Cookie", adminCookie)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.first_name).toBe(updateData.first_name);
    expect(res.body.grade).toBe(updateData.grade);
  });

  it("should delete a student", async () => {
    const res = await request(app)
      .delete(`/api/students/${createdStudentId}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student deleted successfully");
  });

  afterAll(async () => {
    await sql.end();
  });
});

