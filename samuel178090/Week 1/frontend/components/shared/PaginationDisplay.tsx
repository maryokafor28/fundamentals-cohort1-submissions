import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import { Pagination } from 'react-bootstrap';

interface IPaginationDisplayProps {
	metadata: {
		total: number;
		limit: number;
		links?: {
			first?: string;
			prev?: string;
			next?: string;
			last?: string;
		};
	};
	basePath?: string;
}

const PaginationDisplay: FC<IPaginationDisplayProps> = ({ 
	metadata, 
	basePath = '/products' 
}) => {
	const router = useRouter();

	const handleNavigation = useCallback((link: string) => {
		router.push(`${basePath}${link}`);
	}, [router, basePath]);

	return (
		<div className='d-flex flex-column align-items-end mt-4'>
			<Pagination className='mb-3'>
				<Pagination.First
					disabled={!metadata?.links?.first}
					onClick={() => metadata?.links?.first && handleNavigation(metadata.links.first)}
				/>
				<Pagination.Prev
					disabled={!metadata?.links?.prev}
					onClick={() => metadata?.links?.prev && handleNavigation(metadata.links.prev)}
				/>
				<Pagination.Next
					disabled={!metadata?.links?.next}
					onClick={() => metadata?.links?.next && handleNavigation(metadata.links.next)}
				/>
				<Pagination.Last
					disabled={!metadata?.links?.last}
					onClick={() => metadata?.links?.last && handleNavigation(metadata.links.last)}
				/>
			</Pagination>
			<div className='text-primary small'>
				Showing{' '}
				{Math.min(metadata?.limit || 0, metadata?.total || 0)}{' '}
				{metadata?.total === 1 ? 'product' : 'products'} of {metadata?.total || 0}
			</div>
		</div>
	);
};

export default PaginationDisplay;
