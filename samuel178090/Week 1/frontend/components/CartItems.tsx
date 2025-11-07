import Link from 'next/link';
import React, { FC, useContext, useCallback } from 'react';
import { Badge, Button, Image } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Context } from '../context';
import { getFormatedStringFromDays } from '../helper/utils';
import { BACKEND_BASE_URL } from '../services/api';

interface ICartItemsProps {
	hideDeleteButton?: boolean;
}

const CartItems: FC<ICartItemsProps> = ({ hideDeleteButton = false }) => {
	const { cartItems, cartDispatch } = useContext(Context);

	const handleRemoveItem = useCallback((skuId: string) => {
		cartDispatch({ type: 'REMOVE_FROM_CART', payload: { skuId } });
	}, [cartDispatch]);

	const calculateTotal = useCallback(() => {
		return cartItems.reduce(
			(total: number, item: { quantity: number; price: number }) =>
				total + (Number(item.price) * Number(item.quantity)),
			0
		);
	}, [cartItems]);
	return (
		<>
			{cartItems.length > 0 ? (
				cartItems.map((item: any, index: number) => (
					<div
						className='d-flex justify-content-between align-items-center mt-3 p-3 border rounded bg-light'
						key={item.skuId || index}
					>
						<div className='d-flex align-items-center'>
							<Link href={`/products/${item.productId}`}>
								<Image
									alt={`${item.productName} product image`}
									height={50}
									width={50}
									rounded
									src={item.productImage || '/placeholder.svg'}
									className='me-3'
									style={{ cursor: 'pointer' }}
									title='Click to view product details'
									onError={(e) => {
										(e.target as HTMLImageElement).src = '/placeholder.svg';
									}}
								/>
							</Link>
							<div>
								<div className='fw-medium mb-1'>{item.productName}</div>
								<Badge bg='info' text='dark' className='small'>
									{item.lifetime
										? 'Lifetime'
										: getFormatedStringFromDays(item.validity)}
								</Badge>
							</div>
						</div>
						<div className='d-flex align-items-center gap-2'>
							<span className='fw-medium'>
								{item.quantity} × ₦{Number(item.price).toLocaleString('en-NG')}
							</span>
							{!hideDeleteButton && (
								<Button
									variant='outline-danger'
									size='sm'
									onClick={() => handleRemoveItem(item.skuId)}
									title='Remove item from cart'
								>
									<Trash />
								</Button>
							)}
						</div>
					</div>
				))
			) : (
				<div className='text-center py-4'>
					<h5 className='text-muted mb-3'>Your cart is empty</h5>
					<Link href='/products' passHref>
						<Button variant='primary'>Start Shopping</Button>
					</Link>
				</div>
			)}
			{cartItems.length > 0 && (
				<>
					<hr className='my-3' />
					<div className='d-flex justify-content-between align-items-center'>
						<span className='h6 mb-0'>Total:</span>
						<span className='h5 mb-0 fw-bold text-primary'>
							₦{calculateTotal().toLocaleString('en-NG')}
						</span>
					</div>
				</>
			)}
		</>
	);
};

export default CartItems;
