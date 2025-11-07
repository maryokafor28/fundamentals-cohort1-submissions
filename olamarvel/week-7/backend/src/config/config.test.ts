// connectDB.test.ts
import mongoose from "mongoose";
import { connectDB } from "./db";

jest.mock("mongoose", () => ({
    set: jest.fn(),
    connect: jest.fn(),
}));

// Mock console.log to prevent actual logging in test output
const mockLog = jest.spyOn(console, "log").mockImplementation(() => { });

describe("connectDB", () => {
    const mockUri = "mongodb://localhost:27017/testdb";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should set strictQuery to true and connect to MongoDB", async () => {
        (mongoose.connect as jest.Mock).mockResolvedValueOnce({});

        await connectDB(mockUri);

        expect(mongoose.set).toHaveBeenCalledWith("strictQuery", true);
        expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
        expect(mockLog).toHaveBeenCalledWith("MongoDB connected");
    });

    test("should throw an error if connection fails", async () => {
        (mongoose.connect as jest.Mock).mockRejectedValueOnce(
            new Error("Connection failed")
        );

        await expect(connectDB(mockUri)).rejects.toThrow("Connection failed");
        expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
    });
});
