import type { GetServerSideProps, NextPage } from 'next';
import {
	Badge,
	Button,
	Card,
	Col,
	Dropdown,
	DropdownButton,
	Form,
	Nav,
} from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import ReactStars from 'react-stars';
import { BagCheckFill, PersonFill } from 'react-bootstrap-icons';
import { Tab, Modal } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import CartOffCanvas from '../../components/CartOffCanvas';
import axios from 'axios';
import SkuDetailsList from '../../components/Product/SkuDetailsList';
import { getFormatedStringFromDays } from '../../helper/utils';
import ProductItem from '../../components/Products/ProductItem';
import { Context } from '../../context';
import ReviewSection from '../../components/Product/ReviewSection';

interface ProductProps {
	product: Record<string, any>;
	relatedProducts: Record<string, any>[];
}

const Product: NextPage<ProductProps> = ({ product, relatedProducts }) => {
	const [show, setShow] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedSize, setSelectedSize] = useState('');
	const [isFavorite, setIsFavorite] = useState(false);
	const [allSkuDetails, setAllSkuDetails] = React.useState(
		product?.skuDetails || []
	);

	const [displaySku, setDisplaySku] = React.useState(() => {
		const skus = product?.skuDetails || product?._doc?.skuDetails || [];
		if (skus.length > 0) {
			const sku = skus[0];
			// Extract from nested structure if needed
			return {
				_id: sku._id || sku.id,
				price: sku.price,
				skuName: sku.skuName,
				validity: sku.validity,
				lifetime: sku.lifetime,
				stripePriceId: sku.stripePriceId
			};
		}
		return {};
	});

	const [quantity, setQuantity] = useState(1);

	const {
		cartItems,
		cartDispatch,
		state: { user },
	} = useContext(Context);

	const handleCart = () => {
		console.log('=== ADD TO CART DEBUG ===');
		console.log('displaySku:', displaySku);
		
		// Get SKU data from the actual product structure
		const skus = product?.skuDetails || product?._doc?.skuDetails || [];
		const firstSku = skus[0];
		
		console.log('Available SKUs:', skus);
		console.log('First SKU:', firstSku);
		
		// Use SKU data with fallbacks
		const skuToUse = {
			_id: firstSku?._id || product?._id || product?._doc?._id,
			price: firstSku?.price || 25000,
			skuName: firstSku?.skuName || 'Standard',
			validity: firstSku?.validity || 365,
			lifetime: firstSku?.lifetime || true,
			stripePriceId: firstSku?.stripePriceId || 'default-price'
		};
		
		// Check if we have at least a product ID
		if (!skuToUse._id) {
			alert('Product not available. Please try again later.');
			return;
		}
		
		console.log('SKU to use:', skuToUse);

		const payload = {
			skuId: skuToUse._id,
			quantity: quantity,
			validity: skuToUse.lifetime ? 0 : skuToUse.validity,
			lifetime: skuToUse.lifetime,
			price: skuToUse.price,
			productName: product?.productName || product?._doc?.productName || 'Product',
			productImage: imageUrl,
			productId: product?._id || product?._doc?._id,
			skuPriceId: skuToUse.stripePriceId,
		};
		
		console.log('Cart payload:', payload);
		
		cartDispatch({
			type: 'ADD_TO_CART',
			payload: payload,
		});
		
		console.log('Cart dispatch called, showing cart...');
		setShow(true);
	};

	// Debug add to cart
	console.log('=== PRODUCT DEBUG ===');
	console.log('product:', product);
	console.log('product.skuDetails:', product?.skuDetails);
	console.log('product._doc.skuDetails:', product?._doc?.skuDetails);
	console.log('displaySku:', displaySku);
	console.log('displaySku._id:', displaySku._id);
	console.log('displaySku.price:', displaySku.price);
	console.log('Button disabled?', !displaySku?._id || !displaySku?.price);

	// Fixed placeholder image URL
	const placeholderImage = 'https://via.placeholder.com/400x300/f8f9fa/6c757d.png?text=No+Image';
	
	// Get the actual image URL from the correct path
	const imageUrl = product?._doc?.image || product?.image || placeholderImage;

	return (
		<>

			{/* Nike-style Layout */}
			<div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh', padding: '20px 0' }}>
				<Row className='g-0'>
					<Col lg={7}>
						<div style={{ padding: '0 40px' }}>
							<img 
								src={imageUrl}
								alt={product?.productName || product?._doc?.productName || 'Product image'}
								style={{ 
									width: '100%', 
									height: '600px', 
									objectFit: 'cover',
									borderRadius: '12px',
									cursor: 'pointer'
								}}
								onClick={() => setShowImageModal(true)}
								onError={(e) => {
									(e.target as HTMLImageElement).src = placeholderImage;
								}}
							/>
						</div>
					</Col>
					<Col lg={5}>
						<div style={{ padding: '40px', backgroundColor: 'white', height: '100%' }}>
							<h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
								{product?.productName || product?._doc?.productName}
							</h1>
							
							<p style={{ color: '#757575', fontSize: '1.1rem', marginBottom: '20px' }}>
								{product?.description || product?._doc?.description}
							</p>

							<div style={{ marginBottom: '30px' }}>
								<h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111' }}>₦{displaySku?.price || '000'}</h2>
								<p style={{ color: '#757575', fontSize: '0.9rem' }}>Incl. of taxes</p>
								<p style={{ color: '#757575', fontSize: '0.9rem' }}>(Also includes all applicable duties)</p>
							</div>

							{/* Size Selection */}
							<div style={{ marginBottom: '30px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
									<h3 style={{ fontSize: '1rem', fontWeight: '500' }}>Select Size (Nigerian)</h3>
									<a href='#' style={{ color: '#757575', fontSize: '0.9rem', textDecoration: 'none' }}>Size Guide</a>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
									{['38', '39', '40', '41', '42', '43', '44', '45'].map((size, idx) => (
										<button
											key={idx}
											onClick={() => setSelectedSize(size)}
											style={{
												padding: '15px',
												border: selectedSize === size ? '2px solid #111' : '1px solid #e5e5e5',
												backgroundColor: selectedSize === size ? '#f0f0f0' : 'white',
												borderRadius: '4px',
												cursor: 'pointer',
												fontWeight: selectedSize === size ? 'bold' : '500',
												transition: 'all 0.2s'
											}}
										>
											{size}
										</button>
									))}
								</div>
								{selectedSize && (
									<p style={{ marginTop: '10px', color: '#111', fontSize: '0.9rem', fontWeight: '500' }}>
										Selected: Size {selectedSize}
									</p>
								)}
							</div>

							{/* Add to Bag Button */}
							<div style={{ marginBottom: '20px' }}>
								<button
									style={{
										width: '100%',
										padding: '18px',
										backgroundColor: '#111',
										color: 'white',
										border: 'none',
										borderRadius: '30px',
										fontSize: '1rem',
										fontWeight: '500',
										cursor: 'pointer',
										transition: 'all 0.2s'
									}}
									onClick={handleCart}
									disabled={false}
									onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#333'}
									onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#111'}
								>
									Add to Bag
								</button>
							</div>

							{/* Favourite Button */}
							<div style={{ marginBottom: '30px' }}>
								<button
									onClick={() => setIsFavorite(!isFavorite)}
									style={{
										width: '100%',
										padding: '18px',
										backgroundColor: isFavorite ? '#ff4757' : 'white',
										color: isFavorite ? 'white' : '#111',
										border: isFavorite ? '1px solid #ff4757' : '1px solid #ccc',
										borderRadius: '30px',
										fontSize: '1rem',
										fontWeight: '500',
										cursor: 'pointer',
										transition: 'all 0.3s'
									}}
								>
									{isFavorite ? 'Added to Favourites ❤️' : 'Add to Favourites ♡'}
								</button>
							</div>

							{/* Product Features */}
							<div>
								<h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '15px' }}>Product Details</h4>
								<ul style={{ listStyle: 'none', padding: 0, color: '#757575' }}>
									{(product?.highlights || product?._doc?.highlights || []).map((highlight: string, key: any) => (
										<li key={key} style={{ marginBottom: '8px' }}>• {highlight}</li>
									))}
								</ul>
							</div>
						</div>
					</Col>
				</Row>
			</div>
			<br />
			<hr />
			<Row>
				<Tab.Container id='left-tabs-example' defaultActiveKey='first'>
					<Row>
						<Col sm={3}>
							<Nav variant='pills' className='flex-column'>
								<Nav.Item>
									<Nav.Link eventKey='first' href='#'>
										Descriptions
									</Nav.Link>
								</Nav.Item>
								{product?.requirmentSpecification &&
									product?.requirmentSpecification.length > 0 && (
										<Nav.Item>
											<Nav.Link eventKey='second' href='#'>
												Requirements
											</Nav.Link>
										</Nav.Item>
									)}

								<Nav.Item>
									<Nav.Link eventKey='third' href='#'>
										Reviews
									</Nav.Link>
								</Nav.Item>
								{user?.type === 'admin' && (
									<Nav.Item>
										<Nav.Link eventKey='fourth' href='#'>
											Product SKUs
										</Nav.Link>
									</Nav.Item>
								)}
							</Nav>
						</Col>
						<Col sm={9}>
							<Tab.Content>
								<Tab.Pane eventKey='first'>
									{product?.description} <br />
									<a
										target='_blank'
										href={product?.productUrl}
										rel='noreferrer'
										style={{ textDecoration: 'none', float: 'right' }}
									>
										Get more info....
									</a>
									<br />
									<br />
									<a
										className='btn btn-primary text-center'
										target='_blank'
										href={product?.downloadUrl}
										rel='noreferrer'
										style={{ textDecoration: 'none', float: 'right' }}
									>
										Download this
									</a>
								</Tab.Pane>
								<Tab.Pane eventKey='second'>
									<Table responsive>
										<tbody>
											{product?.requirmentSpecification &&
												product?.requirmentSpecification.length > 0 &&
												product?.requirmentSpecification.map(
													(requirement: string, key: any) => (
														<tr key={key}>
															<td width='30%'>
																{Object.keys(requirement)[0]}{' '}
															</td>
															<td width='70%'>
																{Object.values(requirement)[0]}
															</td>
														</tr>
													)
												)}
										</tbody>
									</Table>
								</Tab.Pane>
								<Tab.Pane eventKey='third'>
									<ReviewSection
										reviews={product.feedbackDetails || []}
										productId={product._id}
									/>
								</Tab.Pane>
								<Tab.Pane eventKey='fourth'>
									<SkuDetailsList
										skuDetails={allSkuDetails}
										productId={product._id}
										setAllSkuDetails={setAllSkuDetails}
									/>
								</Tab.Pane>
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</Row>
			<br />
			<div className='separator'>Related Products</div>
			<br />
			<Row xs={1} md={4} className='g-3'>
				{relatedProducts.map((relatedProduct) => (
					<Col key={relatedProduct._id}>
						<ProductItem product={relatedProduct} userType={'customer'} />
					</Col>
				))}
			</Row>
			<CartOffCanvas setShow={setShow} show={show} />
			
			{/* Image Modal */}
			<Modal 
				show={showImageModal} 
				onHide={() => setShowImageModal(false)}
				size="lg"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>{product?.productName || product?._doc?.productName}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-center p-0">
					<img 
						src={imageUrl}
						alt={product?.productName || product?._doc?.productName || 'Product image'}
						style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
						onError={(e) => {
							(e.target as HTMLImageElement).src = placeholderImage;
						}}
					/>
				</Modal.Body>
			</Modal>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<ProductProps> = async (
	context
): Promise<any> => {
	try {
		if (!context.params?.id) {
			return {
				props: {
					product: {},
					relatedProducts: [],
				},
			};
		}
		const { data } = await axios.get(
			`${
				process.env.NODE_ENV !== 'production'
					? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
					: process.env.NEXT_PUBLIC_BASE_API_URL
			}/api/v1/products/` + context.params?.id
		);
		return {
			props: {
				product: data?.result?.product || ({} as Record<string, any>),
				relatedProducts:
					data?.result?.relatedProducts ||
					([] as unknown as Record<string, any[]>),
			},
		};
	} catch (error) {
		console.log(error);
		return {
			props: {
				product: {},
				relatedProducts: [],
			},
		};
	}
};

export default Product;