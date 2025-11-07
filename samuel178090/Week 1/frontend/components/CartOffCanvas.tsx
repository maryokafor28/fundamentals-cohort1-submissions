import { useRouter } from 'next/router';
import React, { FC, useContext, useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Context } from '../context';
import { Orders } from '../services/order.service';
import CartItems from './CartItems';

interface ICartOffCanvasProps {
	show: boolean;
	setShow: (show: boolean) => void;
}
const CartOffCanvas: FC<ICartOffCanvasProps> = ({ show, setShow }) => {
	const handleClose = () => setShow(false);
	const router = useRouter();
	const { cartItems } = useContext(Context);
	const [isLoading, setIsLoading] = useState(false);
	const handleCheckout = () => {
		if (cartItems.length === 0) {
			toast.error('Your cart is empty');
			return;
		}
		
		handleClose();
		router.push('/checkout');
	};

	return (
		<>
			<Offcanvas show={show} onHide={handleClose} placement='end'>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Shopping Cart</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<CartItems />
					<Button
						variant='primary'
						className='w-100 mt-3'
						disabled={isLoading || cartItems.length === 0}
						onClick={handleCheckout}
						size='lg'
					>
						{isLoading && (
							<span
								className='spinner-border spinner-border-sm me-2'
								role='status'
								aria-hidden='true'
							></span>
						)}
						{isLoading ? 'Processing...' : 'Proceed to Checkout'}
					</Button>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
};

export default CartOffCanvas;
