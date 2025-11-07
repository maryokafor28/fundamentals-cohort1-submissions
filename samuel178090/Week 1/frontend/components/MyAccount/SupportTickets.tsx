import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

interface SupportTicket {
	id: string;
	subject: string;
	status: 'open' | 'in-progress' | 'closed';
	priority: 'low' | 'medium' | 'high';
	createdAt: string;
	lastUpdated: string;
}

const SupportTickets = () => {
	const [tickets, setTickets] = useState<SupportTicket[]>([]);
	const [loading, setLoading] = useState(false);
	const [creating, setCreating] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [newTicket, setNewTicket] = useState({
		subject: '',
		description: '',
		priority: 'medium' as 'low' | 'medium' | 'high'
	});

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		setLoading(true);
		try {
			// Mock data - replace with actual API call
			const mockTickets: SupportTicket[] = [
				{
					id: '1',
					subject: 'Payment Issue',
					status: 'open',
					priority: 'high',
					createdAt: new Date().toISOString(),
					lastUpdated: new Date().toISOString()
				},
				{
					id: '2',
					subject: 'Order Delivery Delay',
					status: 'in-progress',
					priority: 'medium',
					createdAt: new Date(Date.now() - 86400000).toISOString(),
					lastUpdated: new Date().toISOString()
				}
			];
			setTickets(mockTickets);
		} catch (error: any) {
			toast.error('Failed to fetch support tickets');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTicket = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTicket.subject.trim()) {
			toast.error('Please enter a subject for your ticket');
			return;
		}
		if (newTicket.subject.trim().length < 5) {
			toast.error('Subject must be at least 5 characters long');
			return;
		}
		if (!newTicket.description.trim()) {
			toast.error('Please provide a description of your issue');
			return;
		}
		if (newTicket.description.trim().length < 10) {
			toast.error('Description must be at least 10 characters long');
			return;
		}

		setCreating(true);
		try {
			// Mock creation - replace with actual API call
			const ticket: SupportTicket = {
				id: Date.now().toString(),
				subject: newTicket.subject,
				status: 'open',
				priority: newTicket.priority,
				createdAt: new Date().toISOString(),
				lastUpdated: new Date().toISOString()
			};
			setTickets([ticket, ...tickets]);
			resetForm();
			setShowModal(false);
			toast.success('Support ticket created successfully');
		} catch (error: any) {
			toast.error('Failed to create support ticket');
		} finally {
			setCreating(false);
		}
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			open: 'danger',
			'in-progress': 'warning',
			closed: 'success'
		};
		return variants[status as keyof typeof variants] || 'secondary';
	};

	const getPriorityBadge = (priority: string) => {
		const variants = {
			low: 'info',
			medium: 'warning',
			high: 'danger'
		};
		return variants[priority as keyof typeof variants] || 'secondary';
	};

	const resetForm = () => {
		setNewTicket({ subject: '', description: '', priority: 'medium' });
	};

	const handleCloseModal = () => {
		resetForm();
		setShowModal(false);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<Card>
			<Card.Header className="d-flex justify-content-between align-items-center">
				<h5 className="mb-0">Support Tickets</h5>
				<Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
					Create New Ticket
				</Button>
			</Card.Header>
			<Card.Body>
				{loading && <div className="text-center my-3">Loading tickets...</div>}
				
				{!loading && tickets.length === 0 && (
					<Alert variant="info">
						No support tickets found. Create your first ticket to get help.
					</Alert>
				)}

				{!loading && tickets.length > 0 && (
					<Table responsive striped hover>
						<thead>
							<tr>
								<th>Ticket ID</th>
								<th>Subject</th>
								<th>Status</th>
								<th>Priority</th>
								<th>Created</th>
								<th>Last Updated</th>
							</tr>
						</thead>
						<tbody>
							{tickets.map((ticket) => (
								<tr key={ticket.id}>
									<td><code>#{ticket.id}</code></td>
									<td>{ticket.subject}</td>
									<td>
										<Badge bg={getStatusBadge(ticket.status)}>
											{ticket.status.replace('-', ' ').toUpperCase()}
										</Badge>
									</td>
									<td>
										<Badge bg={getPriorityBadge(ticket.priority)}>
											{ticket.priority.toUpperCase()}
										</Badge>
									</td>
									<td>{formatDate(ticket.createdAt)}</td>
									<td>{formatDate(ticket.lastUpdated)}</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Card.Body>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Create New Support Ticket</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleCreateTicket}>
					<Modal.Body>
						<Form.Group className="mb-3">
							<Form.Label>Subject *</Form.Label>
							<Form.Control
								type="text"
								value={newTicket.subject}
								onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
								placeholder="Brief description of your issue"
								maxLength={100}
								disabled={creating}
								required
							/>
							<Form.Text className="text-muted">
								{newTicket.subject.length}/100 characters
							</Form.Text>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Priority</Form.Label>
							<Form.Select
								value={newTicket.priority}
								onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'low' | 'medium' | 'high' })}
								disabled={creating}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
							</Form.Select>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Description *</Form.Label>
							<Form.Control
								as="textarea"
								rows={4}
								value={newTicket.description}
								onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
								placeholder="Please provide detailed information about your issue"
								maxLength={1000}
								disabled={creating}
								required
							/>
							<Form.Text className="text-muted">
								{newTicket.description.length}/1000 characters
							</Form.Text>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseModal} disabled={creating}>
							Cancel
						</Button>
						<Button variant="primary" type="submit" disabled={creating}>
							{creating && (
								<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
							)}
							{creating ? 'Creating...' : 'Create Ticket'}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</Card>
	);
};

export default SupportTickets;
