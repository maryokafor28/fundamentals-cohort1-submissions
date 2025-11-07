import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import {
	Badge,
	Button,
	Card,
	Col,
	Image,
	ListGroup,
	Row,
	Table,
} from 'react-bootstrap';
import { Clipboard } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

interface OrderItem {
	skuCode: string;
	productId: string;
	productName: string;
	productImage?: string;
	quantity: number;
	price: number;
	license?: string;
}

interface CustomerAddress {
	line1?: string;
	line2?: string;
	city?: string;
	state?: string;
	country?: string;
	postal_code?: string;
}

interface PaymentInfo {
	paymentAmount: number;
	paymentMethod: string;
}

interface Order {
	orderedItems: OrderItem[];
	paymentInfo?: PaymentInfo;
	orderStatus: string;
	customerAddress?: CustomerAddress;
	createdAt?: string;
}

interface OrderProps {
	order: Order;
}

const Order: NextPage<OrderProps> = ({ order }) => {
	if (!order || !order.orderedItems) {
		return (
			<div className='container mt-4'>
				<Card>
					<Card.Body className='text-center'>
						<h5>Order not found</h5>
						<p className='text-muted'>The requested order could not be found.</p>
						<Link href='/orders' passHref>
							<Button variant='primary'>View All Orders</Button>
						</Link>
					</Card.Body>
				</Card>
			</div>
		);
	}

	return (
		<div className='container mt-4'>
			<Row>
				<Col>
					<Card>
						<Card.Header>
							<h5 className='mb-0'>Order Details</h5>
						</Card.Header>
						<Card.Body>
							<Table responsive striped hover>
								<thead>
									<tr>
										<th>Products</th>
										<th>License Keys</th>
									</tr>
								</thead>
								<tbody>
									{order.orderedItems?.map((item: OrderItem) => (
										<tr key={item.skuCode}>
											<td>
												<div className='d-flex align-items-center'>
													<Link href={`/products/${item.productId}`}>
														<Image
															height={50}
															width={50}
															rounded
															src={item.productImage || '/placeholder.svg'}
															alt={`${item.productName} product image`}
															className='me-3'
															style={{ cursor: 'pointer' }}
															title='Click to view product details'
															onError={(e) => {
																(e.target as HTMLImageElement).src = '/placeholder.svg';
															}}
														/>
													</Link>
													<div>
														<Link href={`/products/${item.productId}`} passHref>
															<a className='text-decoration-none fw-medium'>
																{item.productName || 'Product'}
															</a>
														</Link>
														<div className='text-muted small'>
															{item.quantity} × ₹{item.price.toLocaleString('en-IN')}
														</div>
													</div>
												</div>

											</td>
											<td>
												{item.license ? (
													<div className='d-flex align-items-center gap-2'>
														<code className='bg-light p-2 rounded small'>
															{item.license}
														</code>
														<Button
															variant='outline-secondary'
															size='sm'
															onClick={async () => {
																try {
																	await navigator.clipboard.writeText(item.license!);
																	toast.success('License key copied successfully');
																} catch (error) {
																	toast.error('Failed to copy license key');
																}
															}}
															title='Copy license key'
														>
															<Clipboard />
														</Button>
													</div>
												) : (
													<Badge bg='warning' text='dark'>Not Available</Badge>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card className='mt-4'>
						<Card.Header>
							<div className='d-flex justify-content-between align-items-center'>
								<h5 className='mb-0'>Order Summary</h5>
								<h4 className='mb-0 text-primary'>
									₹{order.paymentInfo?.paymentAmount?.toLocaleString('en-IN') || '0'}
								</h4>
							</div>
						</Card.Header>
						<Card.Body>
							<ListGroup variant='flush'>
								<ListGroup.Item className='d-flex justify-content-between'>
									<span>Order Date:</span>
									<span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
										day: 'numeric',
										month: 'short',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}) : 'N/A'}</span>
								</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between'>
									<span>Payment Method:</span>
									<Badge bg='info'>{order.paymentInfo?.paymentMethod?.toUpperCase() || 'N/A'}</Badge>
								</ListGroup.Item>
								<ListGroup.Item className='d-flex justify-content-between'>
									<span>Order Status:</span>
									<Badge bg={order.orderStatus?.toLowerCase() === 'completed' ? 'success' : 'warning'}>
										{order.orderStatus?.toUpperCase() || 'PENDING'}
									</Badge>
								</ListGroup.Item>
								{order.customerAddress && (
									<ListGroup.Item>
										<div className='fw-medium mb-2'>Billing Address:</div>
										<div className='text-muted small'>
											{order.customerAddress.line1 && <div>{order.customerAddress.line1}</div>}
											{order.customerAddress.line2 && <div>{order.customerAddress.line2}</div>}
											<div>
												{[order.customerAddress.city, order.customerAddress.state, order.customerAddress.postal_code]
													.filter(Boolean)
													.join(', ')}
											</div>
											{order.customerAddress.country && <div>{order.customerAddress.country}</div>}
										</div>
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<OrderProps> = async (
	context
) => {
	try {
		if (!context.params?.id) {
			return {
				notFound: true,
			};
		}

		const apiUrl = process.env.NODE_ENV !== 'production'
			? process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL
			: process.env.NEXT_PUBLIC_BASE_API_URL;

		if (!apiUrl) {
			console.error('API URL not configured');
			return {
				notFound: true,
			};
		}

		const { data } = await axios.get(
			`${apiUrl}/orders/${context.params.id}`,
			{
				withCredentials: true,
				headers: {
					...(context.req?.headers?.cookie && {
						Cookie: context.req.headers.cookie,
					}),
				},
				timeout: 10000,
			}
		);

		if (!data?.success || !data?.result) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				order: data.result,
			},
		};
	} catch (error) {
		console.error('Error fetching order:', error);
		return {
			notFound: true,
		};
	}
};

export default Order;
