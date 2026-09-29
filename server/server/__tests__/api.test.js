const fs = require("fs");
const os = require("os");
const path = require("path");

// Configure before the app loads.
const uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), "fitness-uploads-"));
process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-hs256-signing";
process.env.UPLOADS_DIR = uploadsDir;

const mockConnection = {
  beginTransaction: jest.fn(),
  query: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn(),
};
jest.mock("../db", () => ({
  query: jest.fn(),
  getConnection: jest.fn(() => Promise.resolve(mockConnection)),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");
const app = require("../app");

const tokenFor = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
const auth = (userId = 7) => ({ Authorization: `Bearer ${tokenFor(userId)}` });

const PNG_BYTES = Buffer.from(
  "89504e470d0a1a0a0000000d4948445200000001000000010806000000" +
    "1f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a4c50000000049454e44ae426082",
  "hex"
);

beforeEach(() => {
  jest.clearAllMocks();
  mockConnection.query.mockReset();
  db.query.mockReset();
});

afterAll(() => fs.rmSync(uploadsDir, { recursive: true, force: true }));

describe("platform", () => {
  test("health check responds", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("sends security headers and hides the framework", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["content-security-policy"]).toBeDefined();
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  test("unknown API routes return JSON 404", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Not found");
  });

  test("malformed JSON gets a clean 400", async () => {
    const res = await request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send("{not json");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/valid JSON/);
  });
});

describe("registration", () => {
  test("rejects an invalid email", async () => {
    const res = await request(app).post("/api/register").send({ email: "nope", password: "longenough" });
    expect(res.status).toBe(400);
  });

  test("rejects a short password", async () => {
    const res = await request(app).post("/api/register").send({ email: "a@b.co", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least|between 8/);
  });

  test("normalises the email and returns a token", async () => {
    mockConnection.query.mockResolvedValueOnce([{ insertId: 42 }]).mockResolvedValueOnce([{}]);
    const res = await request(app)
      .post("/api/register")
      .send({ email: "  New.User@Example.COM ", password: "longenough" });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(42);
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).userId).toBe(42);
    expect(mockConnection.query.mock.calls[0][1][0]).toBe("new.user@example.com");
    // Password is stored hashed, never as given.
    expect(mockConnection.query.mock.calls[0][1][1]).not.toBe("longenough");
    expect(mockConnection.commit).toHaveBeenCalled();
  });

  test("reports a duplicate email as 409 and rolls back", async () => {
    mockConnection.query.mockRejectedValueOnce(Object.assign(new Error("dup"), { code: "ER_DUP_ENTRY" }));
    const res = await request(app).post("/api/register").send({ email: "a@b.co", password: "longenough" });
    expect(res.status).toBe(409);
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe("login", () => {
  test("unknown email and wrong password get the same answer", async () => {
    const hash = await bcrypt.hash("right-password", 4);
    db.query.mockResolvedValueOnce([[]]);
    const unknown = await request(app).post("/api/login").send({ email: "x@y.co", password: "whatever1" });
    db.query.mockResolvedValueOnce([[{ id: 1, password: hash }]]);
    const wrong = await request(app).post("/api/login").send({ email: "x@y.co", password: "wrong-password" });

    expect(unknown.status).toBe(401);
    expect(wrong.status).toBe(401);
    expect(unknown.body.message).toBe(wrong.body.message);
  });

  test("correct password returns a token", async () => {
    db.query.mockResolvedValueOnce([[{ id: 5, password: await bcrypt.hash("right-password", 4) }]]);
    const res = await request(app).post("/api/login").send({ email: "x@y.co", password: "right-password" });
    expect(res.status).toBe(200);
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).userId).toBe(5);
  });
});

describe("authentication", () => {
  test("protected routes need a token", async () => {
    expect((await request(app).get("/api/user/info")).status).toBe(401);
    expect((await request(app).get("/api/posts")).status).toBe(401);
  });

  test("forged tokens are rejected", async () => {
    const forged = jwt.sign({ userId: 1 }, "some-other-secret");
    const res = await request(app).get("/api/user/info").set("Authorization", `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  test("expired tokens get a clear message", async () => {
    const expired = jwt.sign({ userId: 1, exp: Math.floor(Date.now() / 1000) - 60 }, process.env.JWT_SECRET);
    const res = await request(app).get("/api/user/info").set("Authorization", `Bearer ${expired}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/expired/);
  });
});

describe("posts and comments", () => {
  test("comments are always written as the signed-in user", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 3 }]);
    const res = await request(app)
      .post("/api/posts/10/comments")
      .set(auth(7))
      .send({ text: "Nice!", userId: 999 }); // attempt to post as someone else
    expect(res.status).toBe(201);
    expect(db.query.mock.calls[0][1]).toEqual(["10", 7, "Nice!"]);
  });

  test("you can't delete someone else's post", async () => {
    db.query.mockResolvedValueOnce([[{ id: 10, user_id: 99, image: "uploads/x.png" }]]);
    const res = await request(app).delete("/api/posts/10").set(auth(7));
    expect(res.status).toBe(403);
    expect(db.query).toHaveBeenCalledTimes(1); // no DELETE issued
  });

  test("you can delete your own post, and its image goes too", async () => {
    const image = path.join(uploadsDir, "mine.png");
    fs.writeFileSync(image, PNG_BYTES);
    db.query.mockResolvedValueOnce([[{ id: 10, user_id: 7, image: "uploads/mine.png" }]]).mockResolvedValueOnce([{}]);
    const res = await request(app).delete("/api/posts/10").set(auth(7));
    expect(res.status).toBe(204);
    expect(db.query.mock.calls[1][0]).toMatch(/DELETE FROM posts/);
    await new Promise((r) => setTimeout(r, 50));
    expect(fs.existsSync(image)).toBe(false);
  });

  test("uploads a real image under a random name", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 11 }]);
    const res = await request(app)
      .post("/api/posts")
      .set(auth(7))
      .field("description", "Leg day")
      .attach("image", PNG_BYTES, { filename: "../../evil.png", contentType: "image/png" });
    expect(res.status).toBe(201);
    const stored = res.body.data.post.image;
    expect(stored).toMatch(/^uploads\/\d+-[0-9a-f]{16}\.png$/);
    expect(fs.existsSync(path.join(uploadsDir, path.basename(stored)))).toBe(true);
  });

  test("rejects a non-image disguised as a PNG and deletes it", async () => {
    const before = fs.readdirSync(uploadsDir).length;
    const res = await request(app)
      .post("/api/posts")
      .set(auth(7))
      .attach("image", Buffer.from("<script>alert(1)</script>"), { filename: "x.png", contentType: "image/png" });
    expect(res.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
    expect(fs.readdirSync(uploadsDir).length).toBe(before);
  });

  test("rejects file types that aren't images", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set(auth(7))
      .attach("image", Buffer.from("hello"), { filename: "notes.txt", contentType: "text/plain" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/JPEG, PNG, GIF or WebP/);
  });
});

describe("food log", () => {
  test("validates entries", async () => {
    const res = await request(app)
      .post("/api/log/food")
      .set(auth())
      .send({ food_id: "1", description: "Oats", log_time: "2026-02-30 08:00:00", calories: 100 });
    expect(res.status).toBe(400);
  });

  test("rejects negative nutrients", async () => {
    const res = await request(app)
      .post("/api/log/food")
      .set(auth())
      .send({ food_id: "1", description: "Oats", log_time: "2026-09-29 08:00:00", calories: -5 });
    expect(res.status).toBe(400);
  });

  test("stores a valid entry for the signed-in user", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app)
      .post("/api/log/food")
      .set(auth(7))
      .send({ food_id: "123", description: "Oats (40 g)", log_time: "2026-09-29 08:00:00", calories: 150, protein: 5 });
    expect(res.status).toBe(201);
    expect(db.query.mock.calls[0][1]).toEqual(["123", "Oats (40 g)", "2026-09-29 08:00:00", 5, 0, 0, 150, 7]);
  });

  test("rejects impossible dates when reading a day", async () => {
    const res = await request(app).get("/api/logs/2026-13-01").set(auth());
    expect(res.status).toBe(400);
  });
});

describe("profile", () => {
  test("rejects out-of-range measurements", async () => {
    const res = await request(app)
      .post("/api/user/update")
      .set(auth())
      .send({ name: "A", email: "a@b.co", gender: "male", activityLevel: "sedentary", height: 1800 });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/height/);
  });

  test("keeps the sign-in email in step with the profile", async () => {
    mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]).mockResolvedValueOnce([{}]);
    const res = await request(app)
      .post("/api/user/update")
      .set(auth(7))
      .send({ name: "A", email: "New@B.co", gender: "male", activityLevel: "sedentary", height: 180, weight: 80 });
    expect(res.status).toBe(200);
    expect(mockConnection.query.mock.calls[1]).toEqual(["UPDATE users SET email = ? WHERE id = ?", ["new@b.co", 7]]);
  });
});

describe("rate limiting", () => {
  test("login is limited after repeated attempts", async () => {
    db.query.mockResolvedValue([[]]);
    let last;
    for (let i = 0; i < 25; i++) {
      last = await request(app).post("/api/login").send({ email: "x@y.co", password: "guess1234" });
    }
    expect(last.status).toBe(429);
  });
});
