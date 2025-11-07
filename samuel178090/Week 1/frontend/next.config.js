/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	
	// API rewrites for development
	async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination: process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL 
					? `${process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL}/api/v1/:path*`
					: 'http://localhost:3100/api/v1/:path*'
			}
		];
	},
	
	// Image optimization
	images: {
		domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com'],
		formats: ['image/webp', 'image/avif'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
		],
	},
};

module.exports = nextConfig;

