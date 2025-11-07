import { useRouter } from 'next/router';
import { FC } from 'react';
import { Breadcrumb } from 'react-bootstrap';

interface BreadcrumbItem {
	active: boolean;
	href: string;
	text: string;
}

interface IBreadcrumbDisplayProps {
	children?: BreadcrumbItem[];
}
const BreadcrumbDisplay: FC<IBreadcrumbDisplayProps> = ({ children }) => {
	const router = useRouter();

	const handleItemClick = (href: string, active: boolean) => {
		if (!active) {
			router.push(href);
		}
	};

	return (
		<Breadcrumb className='mt-3'>
			{children?.map((item, index) => (
				<Breadcrumb.Item
					key={`${item.href}-${index}`}
					active={item.active}
					onClick={() => handleItemClick(item.href, item.active)}
					style={{ cursor: item.active ? 'default' : 'pointer' }}
					title={item.active ? undefined : `Navigate to ${item.text}`}
				>
					{item.text}
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	);
};

export default BreadcrumbDisplay;
