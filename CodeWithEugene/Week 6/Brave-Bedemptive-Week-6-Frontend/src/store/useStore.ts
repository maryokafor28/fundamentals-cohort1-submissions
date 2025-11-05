import { create } from 'zustand';
import { User, Transaction } from '../types';
import userService from '../services/userService';
import transactionService from '../services/transactionService';

interface AppState {
  // Users
  users: User[];
  currentUser: User | null;
  totalUsers: number;
  isLoadingUsers: boolean;
  userError: string | null;
  
  // Transactions
  transactions: Transaction[];
  totalTransactions: number;
  isLoadingTransactions: boolean;
  transactionError: string | null;
  
  // Stats
  stats: {
    totalUsers: number;
    totalBalance: number;
    averageBalance: number;
    totalTransactions: number;
    totalCredit: number;
    totalDebit: number;
    pendingCount: number;
    successfulCount: number;
    failedCount: number;
  } | null;
  isLoadingStats: boolean;
  
  // Actions - Users
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  createUser: (data: any) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Actions - Transactions
  fetchTransactions: (page?: number, limit?: number, userId?: string) => Promise<void>;
  createTransaction: (data: any) => Promise<Transaction>;
  fetchUserTransactions: (userId: string) => Promise<void>;
  
  // Actions - Stats
  fetchStats: () => Promise<void>;
  
  // Utility Actions
  clearErrors: () => void;
  reset: () => void;
}

const useStore = create<AppState>((set, get) => ({
  // Initial State
  users: [],
  currentUser: null,
  totalUsers: 0,
  isLoadingUsers: false,
  userError: null,
  
  transactions: [],
  totalTransactions: 0,
  isLoadingTransactions: false,
  transactionError: null,
  
  stats: null,
  isLoadingStats: false,
  
  // User Actions
  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoadingUsers: true, userError: null });
    try {
      const response = await userService.getUsers(page, limit);
      set({ 
        users: response.data,
        totalUsers: response.total,
        isLoadingUsers: false 
      });
    } catch (error: any) {
      set({ 
        userError: error.response?.data?.message || 'Failed to fetch users',
        isLoadingUsers: false 
      });
    }
  },
  
  fetchUserById: async (id: string) => {
    set({ isLoadingUsers: true, userError: null });
    try {
      const user = await userService.getUserById(id);
      set({ currentUser: user, isLoadingUsers: false });
    } catch (error: any) {
      set({ 
        userError: error.response?.data?.message || 'Failed to fetch user',
        isLoadingUsers: false 
      });
    }
  },
  
  createUser: async (data: any) => {
    set({ isLoadingUsers: true, userError: null });
    try {
      const newUser = await userService.createUser(data);
      set((state) => ({ 
        users: [newUser, ...state.users],
        totalUsers: state.totalUsers + 1,
        isLoadingUsers: false 
      }));
      return newUser;
    } catch (error: any) {
      set({ 
        userError: error.response?.data?.message || 'Failed to create user',
        isLoadingUsers: false 
      });
      throw error;
    }
  },
  
  updateUser: async (id: string, data: any) => {
    set({ isLoadingUsers: true, userError: null });
    try {
      const updatedUser = await userService.updateUser(id, data);
      set((state) => ({
        users: state.users.map(user => user.id === id ? updatedUser : user),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoadingUsers: false
      }));
    } catch (error: any) {
      set({ 
        userError: error.response?.data?.message || 'Failed to update user',
        isLoadingUsers: false 
      });
      throw error;
    }
  },
  
  deleteUser: async (id: string) => {
    set({ isLoadingUsers: true, userError: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        totalUsers: state.totalUsers - 1,
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        isLoadingUsers: false
      }));
    } catch (error: any) {
      set({ 
        userError: error.response?.data?.message || 'Failed to delete user',
        isLoadingUsers: false 
      });
      throw error;
    }
  },
  
  // Transaction Actions
  fetchTransactions: async (page = 1, limit = 10, userId?: string) => {
    set({ isLoadingTransactions: true, transactionError: null });
    try {
      const response = await transactionService.getTransactions(page, limit, userId);
      set({ 
        transactions: response.data,
        totalTransactions: response.total,
        isLoadingTransactions: false 
      });
    } catch (error: any) {
      set({ 
        transactionError: error.response?.data?.message || 'Failed to fetch transactions',
        isLoadingTransactions: false 
      });
    }
  },
  
  createTransaction: async (data: any) => {
    set({ isLoadingTransactions: true, transactionError: null });
    try {
      const newTransaction = await transactionService.createTransaction(data);
      set((state) => ({ 
        transactions: [newTransaction, ...state.transactions],
        totalTransactions: state.totalTransactions + 1,
        isLoadingTransactions: false 
      }));
      
      // Update user balance if current user is affected
      const state = get();
      if (state.currentUser?.id === data.userId) {
        await get().fetchUserById(data.userId);
      }
      
      return newTransaction;
    } catch (error: any) {
      set({ 
        transactionError: error.response?.data?.message || 'Failed to create transaction',
        isLoadingTransactions: false 
      });
      throw error;
    }
  },
  
  fetchUserTransactions: async (userId: string) => {
    set({ isLoadingTransactions: true, transactionError: null });
    try {
      const transactions = await transactionService.getUserTransactions(userId);
      set({ 
        transactions,
        isLoadingTransactions: false 
      });
    } catch (error: any) {
      set({ 
        transactionError: error.response?.data?.message || 'Failed to fetch user transactions',
        isLoadingTransactions: false 
      });
    }
  },
  
  // Stats Actions
  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const [userStats, transactionStats] = await Promise.all([
        userService.getUserStats(),
        transactionService.getTransactionStats()
      ]);
      
      set({
        stats: {
          ...userStats,
          ...transactionStats
        },
        isLoadingStats: false
      });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      set({ isLoadingStats: false });
    }
  },
  
  // Utility Actions
  clearErrors: () => {
    set({ userError: null, transactionError: null });
  },
  
  reset: () => {
    set({
      users: [],
      currentUser: null,
      totalUsers: 0,
      isLoadingUsers: false,
      userError: null,
      transactions: [],
      totalTransactions: 0,
      isLoadingTransactions: false,
      transactionError: null,
      stats: null,
      isLoadingStats: false,
    });
  }
}));

export default useStore;
