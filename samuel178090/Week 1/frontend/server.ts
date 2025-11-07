import express, { Request, Response } from 'express';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Environment configuration
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || 'localhost';

// API URLs
const apiUrl = dev
	? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
	: process.env.NEXT_PUBLIC_BASE_API_URL;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(`Environment: ${dev ? 'development' : 'production'}`);
console.log(`API URL: ${apiUrl}`);

app
	.prepare()
	.then(() => {
		const server = express();

		// Trust proxy for production deployments
		if (!dev) {
			server.set('trust proxy', 1);
		}

		// Apply proxy middleware in development mode
		if (dev && apiUrl) {
			server.use(
				'/api',
				createProxyMiddleware({
					target: apiUrl,
					changeOrigin: true,
					pathRewrite: {
						'^/api': '', // Remove /api prefix when forwarding
					},
				})
			);
			console.log(`📡 Proxy enabled: /api -> ${apiUrl}`);
		}

		// Handle all other requests with Next.js
		server.all('*', (req: Request, res: Response) => {
			return handle(req, res);
		});

		// Start server
		const httpServer = server.listen(port, hostname, () => {
			console.log(`🚀 Server ready on http://${hostname}:${port}`);
		});

		// Enhanced error handling
		httpServer.on('error', (err: NodeJS.ErrnoException) => {
			if (err.code === 'EADDRINUSE') {
				console.error(`❌ Port ${port} is already in use`);
				process.exit(1);
			} else {
				console.error('❌ Server error:', err);
			}
		});

		// Graceful shutdown
		process.on('SIGTERM', () => {
			console.log('🛑 SIGTERM received, shutting down gracefully');
			httpServer.close(() => {
				console.log('✅ Server closed');
				process.exit(0);
			});
		});
	})
	.catch((err: Error) => {
		console.error('❌ Failed to start server:', err.message);
		process.exit(1);
	});
