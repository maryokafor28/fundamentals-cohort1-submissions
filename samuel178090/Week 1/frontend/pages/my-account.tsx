import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import { BoxArrowRight, Person, Receipt } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import AccountDetails from '../components/MyAccount/AccountDetails';
import AllOrders from '../components/MyAccount/AllOrders';
import { Context } from '../context';
import { Users } from '../services/user.service';

const MyAccount = () => {
	const router = useRouter();
	const {
		state: { user },
		dispatch,
	} = useContext(Context);

	useEffect(() => {
		if (!user || !user.email) {
			router.push('/auth');
		}
	}, [user, router]);

	const logoutHandler = async () => {
		try {
			dispatch({
				type: 'LOGOUT',
			});
			await Users.logoutUser();
			if (typeof window !== 'undefined') {
				window.localStorage.removeItem('_digi_user');
			}
			toast.success('Logout successful');
			router.push('/auth');
		} catch (error: any) {
			toast.error(error.message || 'Logout failed');
		}
	};

	return (
		<div className="container py-4">
			<h2 className="mb-4">My Account</h2>
			<Tab.Container id="account-tabs" defaultActiveKey="first">
				<Row>
					<Col lg={3} className="mb-4">
						<Card className="shadow-sm">
							<Card.Body className="p-0">
								<Nav variant="pills" className="flex-column">
									<Nav.Item>
										<Nav.Link eventKey="first" className="d-flex align-items-center">
											<Person className="me-2" size={16} />
											Account Details
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="second" className="d-flex align-items-center">
											<Receipt className="me-2" size={16} />
											All Orders
										</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Button
											variant="outline-danger"
											className="w-100 d-flex align-items-center justify-content-center mt-2"
											onClick={logoutHandler}
										>
											<BoxArrowRight className="me-2" size={16} />
											Logout
										</Button>
									</Nav.Item>
								</Nav>
							</Card.Body>
						</Card>
					</Col>
					<Col lg={9}>
						<Tab.Content>
							<Tab.Pane eventKey="first">
								<AccountDetails
									user={user || {}}
									dispatch={dispatch}
								/>
							</Tab.Pane>
							<Tab.Pane eventKey="second">
								<AllOrders />
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		</div>
	);
};

export default MyAccount;
