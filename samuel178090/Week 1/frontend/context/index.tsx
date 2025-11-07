import { useReducer, createContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface ProviderProps {
	children: React.ReactNode;
}

interface User {
	email?: string;
	name?: string;
	[key: string]: any;
}

interface CartItem {
	skuId: string;
	quantity: number;
	price: number;
	productName: string;
	productImage?: string;
	lifetime?: boolean;
	validity?: number;
	[key: string]: any;
}

// initial state
const initialState = {
	user: null as User | null,
};

interface ContextType {
	state: { user: User | null };
	dispatch: (action: {
		type: 'LOGIN' | 'LOGOUT' | 'UPDATE_USER';
		payload?: User | null;
	}) => void;
	cartItems: CartItem[];
	cartDispatch: (action: {
		type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_CART' | 'GET_CART_ITEMS' | 'CLEAR_CART';
		payload?: CartItem | CartItem[] | { skuId: string };
	}) => void;
}

const initialContext: ContextType = {
	state: initialState,
	dispatch: () => {},
	cartItems: [],
	cartDispatch: () => {},
};

// create context
const Context = createContext<ContextType>(initialContext);

// root reducer
const rootReducer = (
	state: { user: User | null },
	action: { type: 'LOGIN' | 'LOGOUT' | 'UPDATE_USER'; payload?: User | null }
): { user: User | null } => {
	switch (action.type) {
		case 'LOGIN':
			return { ...state, user: action.payload || null };
		case 'LOGOUT':
			return { ...state, user: null };
		case 'UPDATE_USER':
			return { ...state, user: action.payload || null };
		default:
			return state;
	}
};

// cart reducer
const cartReducer = (
	state: CartItem[],
	action: {
		type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_CART' | 'GET_CART_ITEMS' | 'CLEAR_CART';
		payload?: CartItem | CartItem[] | { skuId: string };
	}
): CartItem[] => {
	let newState: CartItem[];

	switch (action.type) {
		case 'ADD_TO_CART':
			newState = [...state, action.payload as CartItem];
			break;
		case 'REMOVE_FROM_CART':
			newState = state.filter(
				(item) => item.skuId !== (action.payload as { skuId: string })?.skuId
			);
			break;
		case 'UPDATE_CART':
			newState = state.map((item) => {
				if (item.skuId === (action.payload as CartItem)?.skuId) {
					return action.payload as CartItem;
				}
				return item;
			});
			break;
		case 'GET_CART_ITEMS':
			return (action.payload as CartItem[]) || [];
		case 'CLEAR_CART':
			newState = [];
			break;
		default:
			return state;
	}

	// Update localStorage safely
	try {
		if (typeof window !== 'undefined') {
			if (action.type === 'CLEAR_CART') {
				window.localStorage.removeItem('_digi_cart');
			} else {
				window.localStorage.setItem('_digi_cart', JSON.stringify(newState));
			}
		}
	} catch (error) {
		console.error('Failed to update localStorage:', error);
	}

	return newState;
};

// context provider
const Provider = ({ children }: ProviderProps) => {
	const [state, dispatch] = useReducer(rootReducer, initialState);
	const [cartItems, cartDispatch] = useReducer(cartReducer, []);

	const router = useRouter();

	// Initialize user and cart from localStorage
	useEffect(() => {
		try {
			if (typeof window !== 'undefined') {
				// Get user from localStorage
				const storedUser = window.localStorage.getItem('_digi_user');
				if (storedUser && storedUser !== 'null') {
					const user = JSON.parse(storedUser);
					if (user && Object.keys(user).length > 0) {
						dispatch({ type: 'LOGIN', payload: user });
					}
				}

				// Get cart items from localStorage
				const storedCart = window.localStorage.getItem('_digi_cart');
				if (storedCart) {
					const cartData = JSON.parse(storedCart);
					cartDispatch({ type: 'GET_CART_ITEMS', payload: cartData });
				}
			}
		} catch (error) {
			console.error('Failed to load data from localStorage:', error);
		}
	}, []);

	// Axios response interceptor for handling 401 errors
	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				const res = error.response;
				if (res?.status === 401 && res.config && !res.config.__isRetryRequest) {
					return new Promise((resolve, reject) => {
						axios
							.put('/api/v1/users/logout')
							.then(() => {
								console.log('401 error - logging out user');
								dispatch({ type: 'LOGOUT' });
								try {
									if (typeof window !== 'undefined') {
										window.localStorage.removeItem('_digi_user');
									}
								} catch (e) {
									console.error('Failed to clear localStorage:', e);
								}
								router.push('/auth');
								resolve(undefined);
							})
							.catch((err) => {
								console.error('Logout error:', err);
								reject(error);
							});
					});
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.response.eject(interceptor);
		};
	}, [router]);

	// Update localStorage when user state changes
	useEffect(() => {
		try {
			if (typeof window !== 'undefined') {
				if (state.user) {
					window.localStorage.setItem('_digi_user', JSON.stringify(state.user));
				} else {
					window.localStorage.removeItem('_digi_user');
				}
			}
		} catch (error) {
			console.error('Failed to update user in localStorage:', error);
		}
	}, [state.user]);

	return (
		<Context.Provider value={{ state, dispatch, cartItems, cartDispatch }}>
			{children}
		</Context.Provider>
	);
};

export { Context, Provider };
