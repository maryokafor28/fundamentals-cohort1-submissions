import requests, { ApiResponse } from './api';
import queryString from 'query-string';

// Interfaces for product-related data
interface Product {
	_id: string;
	productName: string;
	description: string;
	category: string;
	platformType: string;
	baseType: string;
	productUrl: string;
	downloadUrl: string;
	image?: string;
	highlights: string[];
	requirementSpecification: Record<string, string>[];
	skuDetails: ProductSku[];
	avgRating?: number;
	feedbackDetails?: Review[];
	createdAt: string;
	updatedAt: string;
}

interface ProductSku {
	_id: string;
	price: number;
	validity: number;
	lifetime: boolean;
	stripePriceId: string;
	licenses?: License[];
}

interface License {
	_id: string;
	licenseKey: string;
	isUsed: boolean;
	usedBy?: string;
	createdAt: string;
}

interface Review {
	_id: string;
	rating: number;
	comment: string;
	userName: string;
	createdAt: string;
}

interface ProductFilter {
	category?: string;
	platformType?: string;
	baseType?: string;
	sort?: string;
	limit?: number;
	offset?: number;
	search?: string;
	dashboard?: boolean;
	[key: string]: string | number | boolean | undefined;
}

interface ProductFormData {
	productName: string;
	description: string;
	category: string;
	platformType: string;
	baseType: string;
	productUrl: string;
	downloadUrl: string;
	highlights: string[];
	requirementSpecification: Record<string, string>[];
}

interface SkuFormData {
	price: number;
	validity: number;
	lifetime: boolean;
}

interface ReviewFormData {
	rating: number;
	comment: string;
}

// Product service
export const Products = {
	// Get products with filtering
	getProducts: async (
		filter: ProductFilter = {},
		serverSide: boolean = false
	): Promise<ApiResponse<{ products: Product[]; metadata: any }>> => {
		const url = serverSide 
			? queryString.stringify(filter)
			: queryString.stringifyUrl({
					url: '/products',
					query: filter,
			  });
		return requests.get<ApiResponse<{ products: Product[]; metadata: any }>>(
			serverSide ? `/products?${url}` : url
		);
	},

	// Get single product details
	getProduct: async (id: string): Promise<ApiResponse<{ product: Product; relatedProducts: Product[] }>> => {
		if (!id) {
			throw new Error('Product ID is required');
		}
		return requests.get<ApiResponse<{ product: Product; relatedProducts: Product[] }>>(`/products/${id}`);
	},
	// Create new product
	saveProduct: async (product: ProductFormData): Promise<ApiResponse<Product>> => {
		if (!product.productName || !product.description) {
			throw new Error('Product name and description are required');
		}
		return requests.post<ApiResponse<Product>>('/products', product);
	},

	// Update existing product
	updateProduct: async (
		id: string,
		product: Partial<ProductFormData>
	): Promise<ApiResponse<Product>> => {
		if (!id) {
			throw new Error('Product ID is required');
		}
		return requests.patch<ApiResponse<Product>>(`/products/${id}`, product);
	},

	// Delete product
	deleteProduct: async (id: string): Promise<ApiResponse<{ message: string }>> => {
		if (!id) {
			throw new Error('Product ID is required');
		}
		return requests.delete<ApiResponse<{ message: string }>>(`/products/${id}`);
	},

	// Upload product image
	uploadProductImage: async (
		id: string,
		image: FormData
	): Promise<ApiResponse<{ imageUrl: string }>> => {
		if (!id || !image) {
			throw new Error('Product ID and image are required');
		}
		return requests.post<ApiResponse<{ imageUrl: string }>>(
			`/products/${id}/image`,
			image,
			{ headers: { 'Content-Type': 'multipart/form-data' } }
		);
	},

	// Add SKU to product
	addSku: async (
		productId: string,
		sku: SkuFormData
	): Promise<ApiResponse<ProductSku>> => {
		if (!productId || !sku.price) {
			throw new Error('Product ID and SKU price are required');
		}
		return requests.post<ApiResponse<ProductSku>>(
			`/products/${productId}/skus`,
			sku
		);
	},

	// Update SKU details
	updateSku: async (
		productId: string,
		skuId: string,
		sku: Partial<SkuFormData>
	): Promise<ApiResponse<ProductSku>> => {
		if (!productId || !skuId) {
			throw new Error('Product ID and SKU ID are required');
		}
		return requests.put<ApiResponse<ProductSku>>(
			`/products/${productId}/skus/${skuId}`,
			sku
		);
	},

	// Delete SKU from product
	deleteSku: async (
		productId: string,
		skuId: string
	): Promise<ApiResponse<{ message: string }>> => {
		if (!productId || !skuId) {
			throw new Error('Product ID and SKU ID are required');
		}
		return requests.delete<ApiResponse<{ message: string }>>(
			`/products/${productId}/skus/${skuId}`
		);
	},

	// Get all licenses for a product SKU
	getLicenses: async (
		productId: string,
		skuId: string
	): Promise<ApiResponse<License[]>> => {
		if (!productId || !skuId) {
			throw new Error('Product ID and SKU ID are required');
		}
		return requests.get<ApiResponse<License[]>>(
			`/products/${productId}/skus/${skuId}/licenses`
		);
	},

	// Add license for a product SKU
	addLicense: async (
		productId: string,
		skuId: string,
		license: { licenseKey: string }
	): Promise<ApiResponse<License>> => {
		if (!productId || !skuId || !license.licenseKey) {
			throw new Error('Product ID, SKU ID, and license key are required');
		}
		return requests.post<ApiResponse<License>>(
			`/products/${productId}/skus/${skuId}/licenses`,
			license
		);
	},

	// Update license for a product SKU
	updateLicense: async (
		productId: string,
		skuId: string,
		licenseId: string,
		license: Partial<{ licenseKey: string; isUsed: boolean }>
	): Promise<ApiResponse<License>> => {
		if (!productId || !skuId || !licenseId) {
			throw new Error('Product ID, SKU ID, and License ID are required');
		}
		return requests.put<ApiResponse<License>>(
			`/products/${productId}/skus/${skuId}/licenses/${licenseId}`,
			license
		);
	},

	// Delete license
	deleteLicense: async (licenseId: string): Promise<ApiResponse<{ message: string }>> => {
		if (!licenseId) {
			throw new Error('License ID is required');
		}
		return requests.delete<ApiResponse<{ message: string }>>(
			`/products/licenses/${licenseId}`
		);
	},

	// Add review for a product
	addReview: async (
		productId: string,
		review: ReviewFormData
	): Promise<ApiResponse<Review>> => {
		if (!productId || !review.rating || !review.comment) {
			throw new Error('Product ID, rating, and comment are required');
		}
		if (review.rating < 1 || review.rating > 5) {
			throw new Error('Rating must be between 1 and 5');
		}
		return requests.post<ApiResponse<Review>>(
			`/products/${productId}/reviews`,
			review
		);
	},

	// Delete product review
	deleteReview: async (
		productId: string,
		reviewId: string
	): Promise<ApiResponse<{ message: string }>> => {
		if (!productId || !reviewId) {
			throw new Error('Product ID and Review ID are required');
		}
		return requests.delete<ApiResponse<{ message: string }>>(
			`/products/${productId}/reviews/${reviewId}`
		);
	},

	// Get product reviews
	getReviews: async (
		productId: string,
		limit?: number
	): Promise<ApiResponse<Review[]>> => {
		if (!productId) {
			throw new Error('Product ID is required');
		}
		const query = limit ? `?limit=${limit}` : '';
		return requests.get<ApiResponse<Review[]>>(
			`/products/${productId}/reviews${query}`
		);
	},
};
