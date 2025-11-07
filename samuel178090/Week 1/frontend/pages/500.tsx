import Link from 'next/link';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { ExclamationTriangleFill, ArrowLeft, House } from 'react-bootstrap-icons';

export default function Custom500() {
	return (
		<Container className="d-flex align-items-center justify-content-center min-vh-100">
			<Row className="w-100">
				<Col md={6} lg={5} className="mx-auto">
					<Card className="text-center shadow-lg border-0">
						<Card.Body className="p-5">
							<div className="mb-4">
								<ExclamationTriangleFill 
									size={64} 
									className="text-danger mb-3" 
								/>
								<h1 className="display-4 fw-bold text-danger mb-2">500</h1>
								<h2 className="h4 text-muted mb-3">Internal Server Error</h2>
							</div>
							<p className="text-muted mb-4">
								Something went wrong on our end. We're working to fix this issue.
								Please try again later.
							</p>
							<div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
								<Button 
									variant="outline-secondary" 
									onClick={() => window.history.back()}
									className="d-flex align-items-center gap-2"
								>
									<ArrowLeft size={16} />
									Go Back
								</Button>
								<Link href="/" passHref>
									<Button 
										variant="primary"
										className="d-flex align-items-center gap-2"
									>
										<House size={16} />
										Home Page
									</Button>
								</Link>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
