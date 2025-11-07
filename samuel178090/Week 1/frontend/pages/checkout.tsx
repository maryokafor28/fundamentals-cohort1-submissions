import React, { useState, useContext } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { CreditCard, Person, Envelope, Telephone, GeoAlt } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import validator from 'validator';
import toast from 'react-hot-toast';
import axios from 'axios';
import CartItems from '../components/CartItems';
import BreadcrumbDisplay from '../components/shared/BreadcrumbDisplay';
import { Context } from '../context';

interface BillingForm {
	name: string;
	email: string;
	phone: string;
	address: string;
}

const Checkout = () => {
	const router = useRouter();
	const { state: { user }, cartItems, cartDispatch } = useContext(Context);
	
	const [billingForm, setBillingForm] = useState<BillingForm>({
		name: user?.name || '',
		email: user?.email || '',
		phone: '',
		address: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<BillingForm>>({});
	const validateForm = (): boolean => {
		const newErrors: Partial<BillingForm> = {};
		const { name, email, phone, address } = billingForm;

		if (!name.trim()) newErrors.name = 'Full name is required';
		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!validator.isEmail(email)) {
			newErrors.email = 'Please enter a valid email address';
		}
		if (!phone.trim()) {
			newErrors.phone = 'Phone number is required';
		} else if (!validator.isMobilePhone(phone, 'any')) {
			newErrors.phone = 'Please enter a valid phone number';
		}
		if (!address.trim()) newErrors.address = 'Billing address is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof BillingForm, value: string) => {
		setBillingForm(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const placeOrder = async () => {
		if (!user?.email) {
			toast.error('Please login to place an order');
			router.push('/auth');
			return;
		}

		if (cartItems.length === 0) {
			toast.error('Your cart is empty');
			return;
		}

		if (!validateForm()) {
			toast.error('Please fix the errors below');
			return;
		}

		try {
			setIsLoading(true);
			
			const apiUrl = process.env.NODE_ENV !== 'production'
				? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
				: process.env.NEXT_PUBLIC_BASE_API_URL;

			const orderData = {
				checkoutDetails: cartItems.map(item => ({
					productId: item.productId,
					skuId: item.skuId,
					skuPriceId: item.skuPriceId || `price_${item.skuId}`,
					quantity: item.quantity,
					price: item.price,
					productName: item.productName,
					productImage: item.productImage,
					lifetime: item.lifetime || false,
					validity: item.validity,
				})),
				customerEmail: billingForm.email,
				customerName: billingForm.name,
				customerPhone: billingForm.phone,
				customerAddress: billingForm.address,
			};

			const response = await axios.post(`${apiUrl}/api/v1/orders/checkout`, orderData, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.data.success) {
				toast.success('Order placed successfully!');
				// Clear cart
				cartDispatch({ type: 'CLEAR_CART' });
				// Redirect to orders page
				router.push('/my-account?tab=orders');
			} else {
				throw new Error(response.data.message || 'Failed to place order');
			}
		} catch (error: any) {
			if (error.response?.status === 401) {
				toast.error('Please login to place an order');
				router.push('/auth');
			} else {
				toast.error(error.response?.data?.message || error.message || 'Failed to place order');
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Container className="py-4">
			<BreadcrumbDisplay
				children={[
					{ active: false, href: '/', text: 'Home' },
					{ active: false, href: '/products', text: 'Products' },
					{ active: true, href: '', text: 'Checkout' },
				]}
			/>
			<Row className="mt-4">
				<Col lg={8} className="mb-4">
					<Card className="shadow-sm">
						<Card.Header className="bg-primary text-white">
							<h5 className="mb-0 d-flex align-items-center">
								<Person className="me-2" />
								Billing Information
							</h5>
						</Card.Header>
						<Card.Body className="p-4">
							<Form>
								<Form.Group className="mb-3">
									<Form.Label className="fw-medium">
										<Person className="me-1" size={16} />
										Full Name *
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your full name"
										value={billingForm.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										isInvalid={!!errors.name}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.name}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label className="fw-medium">
										<Envelope className="me-1" size={16} />
										Email Address *
									</Form.Label>
									<Form.Control
										type="email"
										placeholder="name@example.com"
										value={billingForm.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										isInvalid={!!errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label className="fw-medium">
										<Telephone className="me-1" size={16} />
										Phone Number *
									</Form.Label>
									<Form.Control
										type="tel"
										placeholder="Enter your phone number"
										value={billingForm.phone}
										onChange={(e) => handleInputChange('phone', e.target.value)}
										isInvalid={!!errors.phone}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.phone}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Label className="fw-medium">
										<GeoAlt className="me-1" size={16} />
										Billing Address *
									</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										placeholder="Enter your complete billing address"
										value={billingForm.address}
										onChange={(e) => handleInputChange('address', e.target.value)}
										isInvalid={!!errors.address}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.address}
									</Form.Control.Feedback>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={4}>
					<Card className="shadow-sm mb-3">
						<Card.Header className="bg-light">
							<h6 className="mb-0">Order Summary</h6>
						</Card.Header>
						<Card.Body className="p-0">
							<CartItems hideDeleteButton={true} />
						</Card.Body>
					</Card>

					{!user?.email && (
						<Alert variant="warning" className="mb-3">
							<strong>Please login</strong> to place an order.
						</Alert>
					)}

					{cartItems.length === 0 && (
						<Alert variant="info" className="mb-3">
							<strong>Your cart is empty.</strong> Add some products to continue.
						</Alert>
					)}

					<Button
						variant="primary"
						size="lg"
						className="w-100 d-flex align-items-center justify-content-center"
						onClick={placeOrder}
						disabled={isLoading || !user?.email || cartItems.length === 0}
					>
						{isLoading ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-2"
									role="status"
									aria-hidden="true"
								></span>
								Processing...
							</>
						) : (
							<>
								<CreditCard className="me-2" />
								Place Order
							</>
						)}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default Checkout;
