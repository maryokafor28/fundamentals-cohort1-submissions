import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { Container } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import NextNProgress from 'nextjs-progressbar';
import { Provider } from '../context';
import Heading from '../components/shared/Heading';
import TopHead from '../components/shared/TopHead';
import Footer from '../components/shared/Footer';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider>
			<Heading />
				<NextNProgress
					color="#0d6efd"
					startPosition={0.3}
					stopDelayMs={200}
					height={3}
					showOnShallow={true}
				/>
				<div className="d-flex flex-column min-vh-100">
					<Container fluid className="px-0">
						<TopHead />
					</Container>
					<Container className="flex-grow-1 py-3">
						<Component {...pageProps} />
					</Container>
					<Footer />
				</div>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: '#fff',
							color: '#333',
							border: '1px solid #ddd',
							borderRadius: '8px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						},
						success: {
							style: {
								border: '1px solid #d4edda',
								background: '#d1ecf1',
							},
							iconTheme: {
								primary: '#155724',
								secondary: '#d4edda',
							},
						},
						error: {
							style: {
								border: '1px solid #f5c6cb',
								background: '#f8d7da',
							},
							iconTheme: {
								primary: '#721c24',
								secondary: '#f5c6cb',
							},
						},
					}}
				/>
		</Provider>
	);
}

export default MyApp;
