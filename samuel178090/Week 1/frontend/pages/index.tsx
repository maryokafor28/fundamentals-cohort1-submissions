import type { GetServerSideProps, NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { ArrowRight, Play, Pause } from 'react-bootstrap-icons';
import ProductItem from '../components/Products/ProductItem';

interface Props {
	products: Record<string, any>;
}
const Home: NextPage<Props> = ({ products }) => {
	const router = useRouter();
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	// Shoe videos with actual playable content
	const shoeVideos = [
		{
			id: 1,
			title: "Nike Air Max Revolution",
			videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
			thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
			description: "Experience the future of comfort"
		},
		{
			id: 2,
			title: "Adidas Ultraboost 22",
			videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
			thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
			description: "Boost your every step"
		},
		{
			id: 3,
			title: "Jordan Retro Collection",
			videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			thumbnail: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=200&fit=crop",
			description: "Legendary style meets performance"
		},
		{
			id: 4,
			title: "Puma Future Rider",
			videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
			thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=200&fit=crop",
			description: "Run into tomorrow"
		}
	];

	// Auto-rotate videos every 8 seconds (longer for better viewing)
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentVideoIndex((prev) => (prev + 1) % shoeVideos.length);
		}, 8000);
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<style jsx>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				@media (max-width: 768px) {
					.video-sidebar {
						display: none;
					}
					.hero-title {
						font-size: 3rem !important;
					}
					.hero-subtitle {
						font-size: 1.5rem !important;
					}
				}
			`}</style>
			<div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
			{/* Video Hero Section with Sidebar */}
			<div style={{ 
				position: 'relative',
				height: '100vh',
				overflow: 'hidden',
				display: 'flex'
			}}>
				{/* Main Video Background */}
				<div style={{ 
					flex: '1',
					position: 'relative',
					height: '100%'
				}}>
					<video
						key={currentVideoIndex}
						autoPlay
						muted
						loop
						playsInline
						src={shoeVideos[currentVideoIndex].videoUrl}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 1
						}}
					/>
					
					{/* Dark Overlay */}
					<div style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.4)',
						zIndex: 2
					}} />
					
					{/* Hero Content */}
					<div style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						textAlign: 'center',
						color: 'white',
						zIndex: 3,
						width: '80%'
					}}>
						<h1 className="hero-title" style={{ 
							fontSize: '5rem', 
							fontWeight: 'bold', 
							marginBottom: '20px',
							letterSpacing: '-3px',
							textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
							animation: 'fadeInUp 1s ease-out'
						}}>
							JUST DO IT
						</h1>
						<h2 className="hero-subtitle" style={{
							fontSize: '2rem',
							fontWeight: '300',
							marginBottom: '10px',
							textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
						}}>
							{shoeVideos[currentVideoIndex].title}
						</h2>
						<p style={{ 
							fontSize: '1.3rem', 
							marginBottom: '40px',
							color: '#f0f0f0',
							textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
						}}>
							{shoeVideos[currentVideoIndex].description}
						</p>
						<Link href="/products">
							<button style={{
								padding: '18px 50px',
								backgroundColor: 'white',
								color: '#111',
								border: 'none',
								borderRadius: '50px',
								fontSize: '1.2rem',
								fontWeight: 'bold',
								cursor: 'pointer',
								transition: 'all 0.3s',
								boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
								textTransform: 'uppercase',
								letterSpacing: '1px'
							}}>
								SHOP NOW
							</button>
						</Link>
					</div>
				</div>
				
				{/* Video Sidebar */}
				<div className="video-sidebar" style={{
					width: '350px',
					backgroundColor: 'rgba(0, 0, 0, 0.9)',
					padding: '30px 20px',
					overflowY: 'auto',
					zIndex: 4,
					borderLeft: '1px solid rgba(255,255,255,0.1)'
				}}>
					<h3 style={{
						color: 'white',
						fontSize: '1.5rem',
						fontWeight: 'bold',
						marginBottom: '25px',
						textAlign: 'center',
						letterSpacing: '1px'
					}}>
						FEATURED COLLECTION
					</h3>
					
					{shoeVideos.map((video, index) => (
						<div
							key={video.id}
							style={{
								marginBottom: '20px',
								padding: '15px',
								borderRadius: '12px',
								backgroundColor: index === currentVideoIndex ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
								border: index === currentVideoIndex ? '2px solid white' : '2px solid transparent',
								cursor: 'pointer',
								transition: 'all 0.3s',
								transform: index === currentVideoIndex ? 'scale(1.02)' : 'scale(1)'
							}}
							onClick={() => setCurrentVideoIndex(index)}
						>
							<div style={{ position: 'relative', marginBottom: '10px' }}>
								<img
									src={video.thumbnail}
									alt={video.title}
									style={{
										width: '100%',
										height: '120px',
										objectFit: 'cover',
										borderRadius: '8px'
									}}
								/>
								<div style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									backgroundColor: 'rgba(0,0,0,0.7)',
									borderRadius: '50%',
									width: '40px',
									height: '40px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<Play color="white" size={16} />
								</div>
							</div>
							<h4 style={{
								color: 'white',
								fontSize: '1rem',
								fontWeight: 'bold',
								marginBottom: '5px'
							}}>
								{video.title}
							</h4>
							<p style={{
								color: '#ccc',
								fontSize: '0.9rem',
								margin: 0
							}}>
								{video.description}
							</p>
						</div>
					))}
					
					{/* Video Controls */}
					<div style={{
						marginTop: '30px',
						padding: '20px',
						backgroundColor: 'rgba(255,255,255,0.1)',
						borderRadius: '12px',
						textAlign: 'center'
					}}>
						<p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
							Auto-playing every 8 seconds
						</p>
						<div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
							{shoeVideos.map((_, index) => (
								<div
									key={index}
									style={{
										width: '8px',
										height: '8px',
										borderRadius: '50%',
										backgroundColor: index === currentVideoIndex ? 'white' : 'rgba(255,255,255,0.4)',
										cursor: 'pointer',
										transition: 'all 0.3s'
									}}
									onClick={() => setCurrentVideoIndex(index)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Featured Products */}
			<Container style={{ padding: '80px 15px' }}>
				<div style={{ textAlign: 'center', marginBottom: '60px' }}>
					<h2 style={{ 
						fontSize: '2.5rem', 
						fontWeight: 'bold', 
						color: '#111',
						marginBottom: '10px'
					}}>
						FEATURED SHOES
					</h2>
					<p style={{ color: '#757575', fontSize: '1.1rem' }}>
						Step into greatness with our latest collection
					</p>
				</div>
				
				<Row xs={1} md={2} lg={4} className='g-4'>
					{products.latestProducts &&
						products.latestProducts.slice(0, 8).map(
							(product: any, index: React.Key | null | undefined) => (
								<ProductItem
									product={product}
									userType={'customer'}
									key={index}
								/>
							)
						)}
				</Row>

				{/* Call to Action */}
				<div style={{ textAlign: 'center', marginTop: '80px' }}>
					<Link href="/products">
						<button style={{
							padding: '18px 50px',
							backgroundColor: '#111',
							color: 'white',
							border: 'none',
							borderRadius: '30px',
							fontSize: '1.1rem',
							fontWeight: 'bold',
							cursor: 'pointer',
							transition: 'all 0.3s'
						}}>
							VIEW ALL SHOES
						</button>
					</Link>
				</div>
			</Container>

			{/* Bottom Banner */}
			<div style={{
				backgroundColor: '#111',
				color: 'white',
				padding: '60px 0',
				textAlign: 'center'
			}}>
				<Container>
					<h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
						FREE SHIPPING & RETURNS
					</h3>
					<p style={{ fontSize: '1.1rem', color: '#ccc' }}>
						Free standard shipping on orders over ₦10,000 and free 60-day returns
					</p>
				</Container>
			</div>
		</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (
	context
) => {
	try {
		const apiUrl = process.env.NODE_ENV !== 'production'
			? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
			: process.env.NEXT_PUBLIC_BASE_API_URL;
		
		if (!apiUrl) {
			console.warn('API URL not configured, using empty data');
			return {
				props: {
					products: { latestProducts: [], topSoldProducts: [] },
				},
			};
		}
		
		const { data } = await axios.get(`${apiUrl}/api/v1/products?homepage=true`);
		return {
			props: {
				products: data?.result || { latestProducts: [], topSoldProducts: [] },
			},
		};
	} catch (error) {
		console.error('Failed to fetch products:', error);
		// Always return props even if API fails
		return {
			props: {
				products: { latestProducts: [], topSoldProducts: [] },
			},
		};
	}
};

export default Home;
