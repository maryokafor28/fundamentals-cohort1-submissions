import * as projectService from "../services/projectServices";
import Project from "../models/project";
import { Types } from "mongoose";

// ✅ Mock the Project model with proper default export
jest.mock("../models/project", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe("Project Service", () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a project with correct fields", async () => {
    const mockData = {
      title: "DevConnect",
      description: "Collaboration tool",
      techStack: ["React", "Node"],
      createdBy: new Types.ObjectId(),
    };

    const mockCreatedProject = {
      ...mockData,
      _id: new Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock the create method on the mocked Project model
    (
      Project.create as jest.MockedFunction<typeof Project.create>
    ).mockResolvedValue(mockCreatedProject as any);

    // Call the actual service
    const project = await projectService.createProject(mockData as any);

    // Assertions
    expect(project.title).toBe("DevConnect");
    expect(project.description).toBe("Collaboration tool");
    expect(project.techStack).toEqual(["React", "Node"]);
    expect(Project.create).toHaveBeenCalledWith(mockData);
    expect(Project.create).toHaveBeenCalledTimes(1);
  });

  it("should handle project creation errors", async () => {
    const mockData = {
      title: "DevConnect",
      description: "Collaboration tool",
      techStack: ["React", "Node"],
      createdBy: new Types.ObjectId(),
    };

    const mockError = new Error("Database connection failed");

    // Mock create to reject with an error
    (
      Project.create as jest.MockedFunction<typeof Project.create>
    ).mockRejectedValue(mockError);

    // Expect the service to throw
    await expect(projectService.createProject(mockData as any)).rejects.toThrow(
      "Database connection failed"
    );
  });
});
