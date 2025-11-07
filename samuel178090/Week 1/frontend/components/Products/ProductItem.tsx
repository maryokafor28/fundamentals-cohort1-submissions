import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { Button, Card, Col, Badge } from 'react-bootstrap';
import { Eye, Pen, Trash, Upload } from 'react-bootstrap-icons';
import ReactStars from 'react-stars';
import toast from 'react-hot-toast';

import { getFormatedStringFromDays } from '../../helper/utils';
import { Products } from '../../services/product.service';
import { BACKEND_BASE_URL } from '../../services/api';

interface IProductItemProps {
	userType: string;
	product: Record<string, any>;
}

const ProductItem: FC<IProductItemProps> = ({ userType, product }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const router = useRouter();
	const deleteProduct = async () => {
		try {
			setIsLoading(true);
			const deleteConfirm = confirm(
				'Are you sure you want to delete this product? This will permanently delete all details, SKUs, and licenses.'
			);
			if (deleteConfirm) {
				const deleteProductRes = await Products.deleteProduct(product._id);
				if (!deleteProductRes.success) {
					throw new Error(deleteProductRes.message);
				}
				router.push('/products/');
				toast.success(deleteProductRes.message || 'Product deleted successfully');
			}
		} catch (error: any) {
			if (error.response) {
				if (Array.isArray(error.response?.data?.message)) {
					return error.response.data.message.forEach((message: any) => {
						toast.error(message);
					});
				} else {
					return toast.error(error.response.data.message);
				}
			}
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const uploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			setUploading(true);
			const file = e.target.files?.[0];
			if (!file) {
				toast.error('Please select a file');
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				toast.error('File size must be less than 5MB');
				return;
			}
			const formData = new FormData();
			formData.append('productImage', file);
			const uploadProductImageRes = await Products.uploadProductImage(
				product._id,
				formData
			);
			if (!uploadProductImageRes.success) {
				throw new Error(uploadProductImageRes.message);
			}
			product.image = uploadProductImageRes.result;
			toast.success(uploadProductImageRes.message || 'Image uploaded successfully');
		} catch (error: any) {
			if (error.response) {
				if (Array.isArray(error.response?.data?.message)) {
					return error.response.data.message.forEach((message: any) => {
						toast.error(message);
					});
				}
				return toast.error(error.response.data.message);
			}
			toast.error(error.message);
		} finally {
			setUploading(false);
		}
	};

	return (
		// eslint-disable-next-line react/jsx-key
		<Col>
			<Card className='productCard'>
				<Card.Img
					onClick={() => router.push(`/products/${product?._id}`)}
					variant='top'
					src={
						uploading
							? 'https://via.placeholder.com/400x300/f8f9fa/6c757d.png?text=Uploading...'
							: product?.image || 'https://via.placeholder.com/400x300/f8f9fa/6c757d.png?text=No+Image'
					}
					style={{ cursor: 'pointer', height: '200px', objectFit: 'cover' }}
					alt={product?.productName || 'Product image'}
					onError={(e) => {
						(e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/f8f9fa/6c757d.png?text=No+Image';
					}}
				/>
				<Card.Body>
					<Card.Title 
						onClick={() => router.push(`/products/${product?._id}`)}
						style={{ cursor: 'pointer' }}
						title='View product details'
					>
						{product.productName}
					</Card.Title>
					<ReactStars
						count={5}
						edit={false}
						value={product?.avgRating || 0}
						size={20}
						color2={'#ffd700'}
					/>
					<Card.Text>
						<span className='priceText'>
							<span className='priceText'>
								{product?.skuDetails?.length > 0
									? product.skuDetails.length > 1
										? (() => {
												const prices = product.skuDetails.map((sku: { price: number }) => sku.price);
												return `₦${Math.min(...prices)} - ₦${Math.max(...prices)}`;
										  })()
										: `₦${product.skuDetails[0]?.price || 0}`
									: '₦0'}{' '}
							</span>
						</span>
					</Card.Text>
					{product?.skuDetails &&
						product?.skuDetails?.length > 0 &&
						product?.skuDetails
							.sort(
								(a: { validity: number }, b: { validity: number }) =>
									a.validity - b.validity
							)
							.map((sku: Record<string, any>, key: any) => (
								<Badge bg='warning' text='dark' className='skuBtn me-1 mb-1' key={sku._id || key}>
									{sku.lifetime
										? 'Lifetime'
										: getFormatedStringFromDays(sku.validity)}
								</Badge>
							))}
					<br />
					{userType === 'admin' ? (
						<div className='btnGrpForProduct d-flex gap-2 flex-wrap'>
							<div className='file btn btn-md btn-outline-primary fileInputDiv' title='Upload Image'>
								{uploading ? (
									<span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
								) : (
									<Upload />
								)}
								<input
									type='file'
									name='file'
									className='fileInput'
									onChange={uploadProductImage}
									accept='image/*'
									disabled={uploading || isLoading}
								/>
							</div>
							<Link href={`/products/update-product?productId=${product?._id}`} className='btn btn-outline-secondary viewProdBtn' title='Edit Product'>
								<Pen />
							</Link>
							<Button
								variant='outline-danger'
								className='viewProdBtn'
								onClick={() => deleteProduct()}
								disabled={isLoading || uploading}
								title='Delete Product'
							>
								{isLoading && (
									<span
										className='spinner-border spinner-border-sm me-2'
										role='status'
										aria-hidden='true'
									></span>
								)}
								<Trash />
							</Button>
							<Link href={`/products/${product?._id}`} className='btn btn-outline-info viewProdBtn' title='View Product'>
								<Eye />
							</Link>
						</div>
					) : (
						<Link href={`/products/${product?._id}`} className='btn btn-outline-info viewProdBtn' title='View Product Details'>
							<Eye />
							View Details
						</Link>
					)}
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ProductItem;
