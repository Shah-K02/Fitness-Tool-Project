const request = require("supertest");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise"); // use mysql2 for testing with Jest
const app = require("./app"); // Export your Express application in a separate file

describe("API tests", () => {
  let db;

  beforeAll(async () => {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_TEST_HOST,
        user: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASS,
        database: process.env.DB_TEST_NAME,
      });
    } catch (error) {
      console.error("Database connection error:", error);
    }
  });

  afterAll(async () => {
    if (db) {
      await db.end();
    }
  });

  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Welcome to my server!");
  });

  test("POST /register should create a new user", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Replace actual DB call with a resolved promise simulating success
    jest.spyOn(db, "query").mockResolvedValueOnce([
      { insertId: 1 }, // mock result object
    ]);

    const response = await request(app)
      .post("/register")
      .send({ email, password });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toContain("User registered successfully");
  });
});
