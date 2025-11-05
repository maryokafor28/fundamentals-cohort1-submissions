"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
let token;
beforeAll(async () => {
    await (0, supertest_1.default)(index_1.default).post("/api/auth/register").send({
        email: "user@example.com",
        password: "Password123!",
    });
    const login = await (0, supertest_1.default)(index_1.default).post("/api/auth/login").send({
        email: "user@example.com",
        password: "Password123!",
    });
    token = login.body.accessToken;
});
describe("Task Routes", () => {
    it("should create a task", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "My first task", description: "testing" });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Task created");
    });
    it("should list tasks", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
