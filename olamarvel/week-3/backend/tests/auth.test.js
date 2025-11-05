"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../src/index"));
//import { connectDb } from "../src/config/db";
describe("Auth Routes", () => {
    it("should register a user", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/register")
            .send({ email: "test@example.com", password: "Password123!" });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User created");
    });
    it("should login a user", async () => {
        await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/register")
            .send({ email: "test@example.com", password: "Password123!" });
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "Password123!" });
        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
    it("should reject invalid login", async () => {
        const res = await (0, supertest_1.default)(index_1.default)
            .post("/api/auth/login")
            .send({ email: "wrong@example.com", password: "wrongpass" });
        expect(res.status).toBe(401);
    });
});
