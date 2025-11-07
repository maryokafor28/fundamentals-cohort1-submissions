import requests, { ApiResponse } from './api';
import queryString from 'query-string';

// Interfaces for order-related data
interface CartItem {
	skuId: string;
	quantity: number;
	price: number;
	productName: string;
	productImage?: string;
	lifetime?: boolean;
	validity?: number;
	productId: string;
	skuPriceId: string;
}

interface CheckoutSession {
	url: string;
	sessionId: string;
}

interface Order {
	_id: string;
	orderedItems: any[];
	paymentInfo?: {
		paymentAmount: number;
		paymentMethod: string;
	};
	orderStatus: string;
	customerAddress?: any;
	createdAt: string;
}

interface OrdersQuery {
	status?: string;
	limit?: number;
	offset?: number;
}

// Order service
export const Orders = {
	// Create checkout session for order
	checkoutSession: async (
		cartItems: CartItem[]
	): Promise<ApiResponse<CheckoutSession>> => {
		return requests.post<ApiResponse<CheckoutSession>>('/orders/checkout', {
			checkoutDetails: cartItems,
		});
	},

	// Get all orders with optional filtering
	getAllOrders: async (query?: OrdersQuery): Promise<ApiResponse<Order[]>> => {
		const queryParams = query ? `?${queryString.stringify(query)}` : '';
		return requests.get<ApiResponse<Order[]>>(`/orders${queryParams}`);
	},

	// Get a specific order by ID
	getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
		if (!orderId) {
			throw new Error('Order ID is required');
		}
		return requests.get<ApiResponse<Order>>(`/orders/${orderId}`);
	},

	// Cancel an order
	cancelOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
		if (!orderId) {
			throw new Error('Order ID is required');
		}
		return requests.patch<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
	},

	// Update order status (admin only)
	updateOrderStatus: async (
		orderId: string, 
		status: string
	): Promise<ApiResponse<Order>> => {
		if (!orderId || !status) {
			throw new Error('Order ID and status are required');
		}
		return requests.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, {
			status,
		});
	},
};
