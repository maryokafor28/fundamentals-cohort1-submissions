import React, { useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
	InputGroup,
	Form,
	Badge,
	Button,
	Nav,
	Navbar,
	NavDropdown,
	Row,
	Col,
} from 'react-bootstrap';
import { PersonCircle, Search } from 'react-bootstrap-icons';
import styles from '../../styles/Home.module.css';
import { Context } from '../../context';
import CartOffCanvas from '../CartOffCanvas';

const TopHead = () => {
	const [show, setShow] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [baseType, setBaseType] = useState('Applications');

	const {
		state: { user },
		cartItems,
	} = useContext(Context);

	const router = useRouter();

	const handleSearch = useCallback(() => {
		if (searchText.trim()) {
			router.push(`/products?search=${encodeURIComponent(searchText.trim())}`);
		}
	}, [router, searchText]);

	const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		}
	}, [handleSearch]);

	return (
		<>
			<Row className='mt-3'>
				<Col xs={6} md={4}>
					<h3 className={styles.logoHeading} onClick={() => router.push('/')}>
						QDACK
					</h3>
				</Col>
				<Col xs={6} md={4}>
					{' '}
					<InputGroup>
						<InputGroup.Text id='inputGroup-sizing-default'>
							<Search />
						</InputGroup.Text>
						<Form.Control
							aria-label='Search products'
							aria-describedby='inputGroup-sizing-default'
							placeholder='Search products...'
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyPress={handleKeyPress}
						/>
						<Button
							variant='outline-primary'
							id='search-button'
							onClick={handleSearch}
							disabled={!searchText.trim()}
							title='Search products'
						>
							Search
						</Button>
					</InputGroup>
				</Col>
				<Col xs={6} md={4}>
					{/* <CartFill
						height='40'
						width='40'
						color='#4c575f'
						className={styles.personIcon}
					/> */}
					{user?.email ? (
						<div 
							className={`${styles.personIcon} cursor-pointer d-flex align-items-center`}
							onClick={() => router.push('/my-account')}
							title={`Welcome, ${user.name || user.email}`}
							role='button'
							tabIndex={0}
						>
							<img
  src={
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name ?? user.email ?? 'User'
    )}&background=007bff&color=fff&size=40`
  }
  alt={user.name || 'User Avatar'}
  width={40}
  height={40}
  className='rounded-circle'
  style={{ objectFit: 'cover' }}
  onError={(e) => {
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name ?? user.email ?? 'User'
    )}&background=6c757d&color=fff&size=40`;
  }}
/>

							<span className='ms-2 d-none d-md-inline text-muted small'>
								{user.name || user.email}
							</span>
						</div>
					) : (
						<PersonCircle
							height='40'
							width='40'
							color='#4c575f'
							className={`${styles.personIcon} cursor-pointer`}
							onClick={() => router.push('/auth')}
							title='Login / Register'
							role='button'
							tabIndex={0}
						/>
					)}
				</Col>
			</Row>
			<Navbar
				collapseOnSelect
				expand='lg'
				bg='light'
				variant='light'
				className='py-2'
			>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='me-auto'>
						<Nav.Link onClick={() => router.push('/')}>Home</Nav.Link>
						<NavDropdown
							title={baseType === 'Applications' ? 'All Products' : baseType}
							id='category-nav-dropdown'
							onSelect={(eventKey) => {
								if (eventKey) {
									setBaseType(eventKey);
									if (eventKey === 'Applications') {
										router.push('/products');
									} else {
										router.push(`/products?baseType=${encodeURIComponent(eventKey)}`);
									}
								}
							}}
						>
							<NavDropdown.Item eventKey='Applications'>
								All Products
							</NavDropdown.Item>
							<NavDropdown.Item eventKey='Computer'>
								Computer
							</NavDropdown.Item>
							<NavDropdown.Item eventKey='Mobile'>
								Mobile
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link
							className={`${styles.cartItems} cursor-pointer`}
							onClick={() => setShow(true)}
							title='View cart items'
						>
							Cart: <Badge bg='primary'>{cartItems.length}</Badge>
							{cartItems.length > 0 && (
								<span className='ms-1'>
									(₦{cartItems
										.reduce(
											(total: number, item: { quantity: number; price: number }) =>
												total + (Number(item.price) * Number(item.quantity)),
											0
										).toLocaleString('en-NG')})
								</span>
							)}
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<CartOffCanvas setShow={setShow} show={show} />
		</>
	);
};

export default TopHead;
