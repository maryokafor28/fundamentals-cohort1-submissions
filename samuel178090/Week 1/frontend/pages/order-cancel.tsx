import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { XCircleFill, ArrowLeft, Shop } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { Context } from '../context';

const OrderCancel = () => {
	const {
		state: { user },
	} = useContext(Context);
	const router = useRouter();

	useEffect(() => {
		if (!user || !user.email) {
			router.push('/');
		}
	}, [router, user]);

	return (
		<Container className="d-flex align-items-center justify-content-center min-vh-100">
			<Row className="w-100">
				<Col md={6} lg={5} className="mx-auto">
					<Card className="text-center shadow-lg border-0">
						<Card.Body className="p-5">
							<div className="mb-4">
								<XCircleFill 
									size={64} 
									className="text-danger mb-3" 
								/>
								<h1 className="display-5 fw-bold text-danger mb-2">Oops! Order Cancelled</h1>
								<h2 className="h5 text-muted mb-3">Payment Failed</h2>
							</div>
							<p className="text-muted mb-4">
								Your order has been cancelled due to payment failure. 
								Don't worry, you can try again or continue shopping.
							</p>
							<div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
								<Button 
									variant="outline-secondary" 
									onClick={() => router.back()}
									className="d-flex align-items-center gap-2"
								>
									<ArrowLeft size={16} />
									Go Back
								</Button>
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

export default OrderCancel;
