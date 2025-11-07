import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { CheckCircleFill, Receipt, Shop, ArrowLeft } from 'react-bootstrap-icons';
import { Context } from '../context';

const OrderSuccess = () => {
	const router = useRouter();
	const {
		state: { user },
		cartDispatch,
	} = useContext(Context);

	useEffect(() => {
		// Clear cart after successful order
		cartDispatch({ type: 'CLEAR_CART' });
	}, [cartDispatch]);

	return (
		<Container className="d-flex align-items-center justify-content-center min-vh-100">
			<Row className="w-100">
				<Col md={6} lg={5} className="mx-auto">
					<Card className="text-center shadow-lg border-0">
						<Card.Body className="p-5">
							<div className="mb-4">
								<CheckCircleFill 
									size={64} 
									className="text-success mb-3" 
								/>
								<h1 className="display-5 fw-bold text-success mb-2">Order Successful!</h1>
								<h2 className="h5 text-muted mb-3">Thank You for Your Purchase</h2>
							</div>
							<p className="text-muted mb-4">
								Your order has been placed successfully. Please check your email 
								for order details and further instructions. You will receive a 
								confirmation email shortly.
							</p>
							<div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
								<Link href="/my-account" passHref>
									<Button 
										variant="outline-primary"
										className="d-flex align-items-center gap-2"
									>
										<Receipt size={16} />
										View Orders
									</Button>
								</Link>
								<Link href="/products" passHref>
									<Button 
										variant="primary"
										className="d-flex align-items-center gap-2"
									>
										<Shop size={16} />
										Continue Shopping
									</Button>
								</Link>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default OrderSuccess;
