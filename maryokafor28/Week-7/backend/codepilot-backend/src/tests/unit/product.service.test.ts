import * as ProductService from "../../modules/products/service";
import Product from "../../modules/products/model";

// Mock the Product model
jest.mock("../../modules/products/model");

describe("Product Service Unit Tests", () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create and return a new product", async () => {
      const mockProductData = {
        name: "Test Product",
        description: "Test Description",
        price: 99.99,
        createdBy: "user123",
      };

      const mockSavedProduct = {
        _id: "product123",
        ...mockProductData,
        createdAt: new Date(),
      };

      // Mock the save method
      const mockSave = jest.fn().mockResolvedValue(mockSavedProduct);
      (Product as any).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await ProductService.createProduct(mockProductData);

      expect(Product).toHaveBeenCalledWith(mockProductData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedProduct);
    });

    it("should throw error if save fails", async () => {
      const mockError = new Error("Database error");
      const mockSave = jest.fn().mockRejectedValue(mockError);

      (Product as any).mockImplementation(() => ({
        save: mockSave,
      }));

      await expect(
        ProductService.createProduct({ name: "Test" })
      ).rejects.toThrow("Database error");
    });
  });

  describe("getAllProducts", () => {
    it("should return all products sorted by createdAt", async () => {
      const mockProducts = [
        { _id: "1", name: "Product 1", createdAt: new Date("2024-01-02") },
        { _id: "2", name: "Product 2", createdAt: new Date("2024-01-01") },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockProducts);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

      (Product.find as jest.Mock) = mockFind;

      const result = await ProductService.getAllProducts();

      expect(mockFind).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockProducts);
    });

    it("should return empty array when no products exist", async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

      (Product.find as jest.Mock) = mockFind;

      const result = await ProductService.getAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe("getProductById", () => {
    it("should return a product by id", async () => {
      const mockProduct = {
        _id: "product123",
        name: "Test Product",
        price: 99.99,
      };

      (Product.findById as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockProduct);

      const result = await ProductService.getProductById("product123");

      expect(Product.findById).toHaveBeenCalledWith("product123");
      expect(result).toEqual(mockProduct);
    });

    it("should return null when product not found", async () => {
      (Product.findById as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await ProductService.getProductById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateProduct", () => {
    it("should update and return the updated product", async () => {
      const updateData = { name: "Updated Product", price: 149.99 };
      const mockUpdatedProduct = {
        _id: "product123",
        ...updateData,
      };

      (Product.findByIdAndUpdate as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockUpdatedProduct);

      const result = await ProductService.updateProduct(
        "product123",
        updateData
      );

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        "product123",
        updateData,
        { new: true }
      );
      expect(result).toEqual(mockUpdatedProduct);
    });

    it("should return null if product to update not found", async () => {
      (Product.findByIdAndUpdate as jest.Mock) = jest
        .fn()
        .mockResolvedValue(null);

      const result = await ProductService.updateProduct("nonexistent", {
        name: "Test",
      });

      expect(result).toBeNull();
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by id", async () => {
      const mockDeletedProduct = {
        _id: "product123",
        name: "Deleted Product",
      };

      (Product.findByIdAndDelete as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockDeletedProduct);

      const result = await ProductService.deleteProduct("product123");

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith("product123");
      expect(result).toEqual(mockDeletedProduct);
    });

    it("should return null if product to delete not found", async () => {
      (Product.findByIdAndDelete as jest.Mock) = jest
        .fn()
        .mockResolvedValue(null);

      const result = await ProductService.deleteProduct("nonexistent");

      expect(result).toBeNull();
    });
  });
});
