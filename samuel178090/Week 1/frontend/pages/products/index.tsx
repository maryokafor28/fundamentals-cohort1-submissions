import styles from '../../styles/Product.module.css';
import { GetServerSideProps } from 'next';
import type { NextPage } from 'next';
import queryString from 'query-string';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import BreadcrumbDisplay from '../../components/shared/BreadcrumbDisplay';
import PaginationDisplay from '../../components/shared/PaginationDisplay';
import ProductItem from '../../components/Products/ProductItem';
import ProductFilter from '../../components/Products/ProductFilter';
import { Context } from '../../context';

interface Product {
	_id: string;
	productName: string;
	image?: string;
	avgRating?: number;
	feedbackDetails?: any[];
	skuDetails?: any[];
	[key: string]: any;
}

interface Metadata {
	total: number;
	limit: number;
	links?: {
		first?: string;
		prev?: string;
		next?: string;
		last?: string;
	};
}

interface Props {
	products: Product[];
	metadata: Metadata;
}

const AllProducts: NextPage<Props> = ({ products, metadata }) => {
	const [userType, setUserType] = useState('customer');
	const [sortText, setSortText] = useState('Sort by');
	const router = useRouter();

	const {
		state: { user },
		dispatch,
	} = useContext(Context);

	useEffect(() => {
		if (user && user.email) {
			setUserType(user.type);
		}
	}, [user]);

	return (
		<div className='container mt-4'>
			<Row className='mb-4'>
				<Col md={8}>
					<BreadcrumbDisplay
						children={[
							{
								active: false,
								href: '/',
								text: 'Home',
							},
							{
								active: true,
								href: '',
								text: 'Products',
							},
						]}
					/>
				</Col>
				<Col md={4} className='d-flex align-items-center justify-content-end gap-2'>
					<DropdownButton
						variant='outline-primary'
						title={sortText}
						id='sort-dropdown'
						size='sm'
						onSelect={(eventKey) => {
							if (eventKey) {
								setSortText(
									eventKey === '-avgRating'
										? 'Rating'
										: eventKey === '-createdAt'
										? 'Latest'
										: 'Sort By'
								);
								const newQuery = { ...router.query };
								delete newQuery.offset;
								newQuery.sort = eventKey;
								router.push({ pathname: router.pathname, query: newQuery });
							} else {
								const newQuery = { ...router.query };
								delete newQuery.sort;
								router.push({ pathname: router.pathname, query: newQuery });
							}
						}}
					>
						<Dropdown.Item eventKey='-avgRating'>
							By Rating
						</Dropdown.Item>
						<Dropdown.Item eventKey='-createdAt'>
							Latest First
						</Dropdown.Item>
						<Dropdown.Item eventKey='price'>
							Price: Low to High
						</Dropdown.Item>
						<Dropdown.Item eventKey='-price'>
							Price: High to Low
						</Dropdown.Item>
						<Dropdown.Item eventKey=''>
							Reset Sorting
						</Dropdown.Item>
					</DropdownButton>
					{userType === 'admin' && (
						<Link href='/products/update-product' className='btn btn-primary btnAddProduct'>
							<PlusCircle className='btnAddProductIcon' />
							Add Product
						</Link>
					)}
				</Col>
			</Row>
			<Row>
				<Col sm={2}>
					<ProductFilter />
				</Col>
				<Col sm={10}>
					<Row xs={1} md={3} className='g-3'>
						{products?.length > 0 ? (
							products.map((product) => (
								<ProductItem
									key={product._id}
									userType={userType}
									product={product}
								/>
							))
						) : (
							<div className='col-12 text-center py-5'>
								<h4 className='text-muted'>No Products Found</h4>
								<p className='text-muted'>Try adjusting your filters or search criteria.</p>
							</div>
						)}
					</Row>
				</Col>
			</Row>
			<Row>
				<Col>
					<PaginationDisplay metadata={metadata} />
				</Col>
			</Row>
		</div>
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
			console.error('API URL not configured');
			return {
				props: {
					products: [],
					metadata: { total: 0, limit: 10 },
				},
			};
		}

		const url = queryString.stringifyUrl({
			url: `${apiUrl}/api/v1/products`,
			query: context.query,
		});

		const { data } = await axios.get(url);

		return {
			props: {
				products: data?.result?.products || [],
				metadata: data?.result?.metadata || { total: 0, limit: 10 },
			},
		};
	} catch (error) {
		console.error('Error fetching products:', error);
		return {
			props: {
				products: [],
				metadata: { total: 0, limit: 10 },
			},
		};
	}
};

export default AllProducts;
