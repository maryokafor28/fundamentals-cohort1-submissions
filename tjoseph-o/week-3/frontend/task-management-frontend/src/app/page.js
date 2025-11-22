'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import styles from './home.module.css';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Secure Task Manager
        </h1>
        <p className={styles.subtitle}>
          A modern task management application with JWT authentication and role-based access control
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.icon}>🔒</div>
            <h3>Secure Authentication</h3>
            <p>JWT-based auth with refresh tokens</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>👥</div>
            <h3>Role-Based Access</h3>
            <p>User and Admin permissions</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>✅</div>
            <h3>Task Management</h3>
            <p>Create, search, and filter tasks</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            onClick={() => router.push('/login')}
            className={styles.loginButton}
          >
            Login
          </button>
          <button 
            onClick={() => router.push('/register')}
            className={styles.registerButton}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}