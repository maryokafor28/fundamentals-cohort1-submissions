import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import RegisterLogin from '../components/Auth/RegisterLogin';

const Auth = () => {
	return (
		<Container className="py-4">
			<Row className="justify-content-center">
				<Col lg={5} md={6} className="mb-4">
					<div className="text-center mb-3">
						<h3 className="text-muted">Sign In</h3>
						<p className="text-muted small">Welcome back! Please sign in to your account.</p>
					</div>
					<RegisterLogin />
				</Col>
				<Col lg={5} md={6} className="mb-4">
					<div className="text-center mb-3">
						<h3 className="text-muted">Sign Up</h3>
						<p className="text-muted small">New here? Create your account to get started.</p>
					</div>
					<RegisterLogin isRegisterForm={true} />
				</Col>
			</Row>
		</Container>
	);
};

export default Auth;
