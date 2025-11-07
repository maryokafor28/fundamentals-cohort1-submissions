import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { Person, Envelope, ChatDots, Send, InfoCircle } from 'react-bootstrap-icons';
import validator from 'validator';
import toast from 'react-hot-toast';
import BreadcrumbDisplay from '../components/shared/BreadcrumbDisplay';

interface ContactForm {
	name: string;
	email: string;
	message: string;
}

const ContactUs = () => {
	const [contactForm, setContactForm] = useState<ContactForm>({
		name: '',
		email: '',
		message: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<ContactForm>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<ContactForm> = {};
		const { name, email, message } = contactForm;

		if (!name.trim()) newErrors.name = 'Full name is required';
		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!validator.isEmail(email)) {
			newErrors.email = 'Please enter a valid email address';
		}
		if (!message.trim()) {
			newErrors.message = 'Message is required';
		} else if (message.trim().length < 10) {
			newErrors.message = 'Message must be at least 10 characters long';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof ContactForm, value: string) => {
		setContactForm(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) {
			toast.error('Please fix the errors below');
			return;
		}

		try {
			setIsLoading(true);
			await new Promise(resolve => setTimeout(resolve, 2000));
			toast.success('Message sent successfully! We\'ll get back to you soon.');
			setContactForm({ name: '', email: '', message: '' });
		} catch (error: any) {
			toast.error(error.message || 'Failed to send message');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container className="py-4">
			<BreadcrumbDisplay
				children={[
					{ active: false, href: '/', text: 'Home' },
					{ active: true, href: '', text: 'Contact Us' },
				]}
			/>
			<Row className="mt-4">
				<Col lg={8} className="mb-4">
					<Card className="shadow-sm">
						<Card.Header className="bg-primary text-white">
							<h5 className="mb-0 d-flex align-items-center">
								<ChatDots className="me-2" />
								Get in Touch
							</h5>
						</Card.Header>
						<Card.Body className="p-4">
							<Form onSubmit={handleSubmit}>
								<Form.Group className="mb-3">
									<Form.Label className="fw-medium">
										<Person className="me-1" size={16} />
										Full Name *
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your full name"
										value={contactForm.name}
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
										value={contactForm.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										isInvalid={!!errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-4">
									<Form.Label className="fw-medium">
										<ChatDots className="me-1" size={16} />
										Message *
									</Form.Label>
									<Form.Control
										as="textarea"
										rows={5}
										placeholder="Please describe your inquiry or feedback..."
										value={contactForm.message}
										onChange={(e) => handleInputChange('message', e.target.value)}
										isInvalid={!!errors.message}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.message}
									</Form.Control.Feedback>
									<Form.Text className="text-muted">
										Minimum 10 characters required
									</Form.Text>
								</Form.Group>

								<Button
									type="submit"
									variant="primary"
									size="lg"
									className="d-flex align-items-center justify-content-center"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												role="status"
												aria-hidden="true"
											></span>
											Sending...
										</>
									) : (
										<>
											<Send className="me-2" />
											Send Message
										</>
									)}
								</Button>
							</Form>
						</Card.Body>
					</Card>
				</Col>

				<Col lg={4}>
					<Card className="shadow-sm h-100">
						<Card.Header className="bg-light">
							<h6 className="mb-0 d-flex align-items-center">
								<InfoCircle className="me-2" />
								Important Information
							</h6>
						</Card.Header>
						<Card.Body>
							<Alert variant="info" className="mb-3">
								<Alert.Heading className="h6">Response Time</Alert.Heading>
								<p className="mb-0 small">
									We're currently operating with limited staff and may not respond as quickly as usual.
								</p>
							</Alert>

							<div className="mb-3">
								<h6 className="text-primary mb-2">What to Expect:</h6>
								<ul className="list-unstyled small text-muted">
									<li className="mb-2">
										• Please be patient while waiting for a response
									</li>
									<li className="mb-2">
										• We typically respond within 24-48 hours
									</li>
									<li className="mb-2">
										• For urgent matters, please include "URGENT" in your message
									</li>
								</ul>
							</div>

							<div>
								<h6 className="text-primary mb-2">Contact Information:</h6>
								<div className="small text-muted">
									<div className="mb-1">
										<Envelope className="me-1" size={14} />
										support@digizone.com
									</div>
									<div>
										Business Hours: Mon-Fri, 9 AM - 6 PM
									</div>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default ContactUs;