import { useRouter } from 'next/router';
import React, { useState, useCallback } from 'react';
import { Card, Dropdown, DropdownButton, ListGroup } from 'react-bootstrap';
import styles from '../../styles/Product.module.css';

const ProductFilter = () => {
	const router = useRouter();
	const [filterCatText, setFilterCatText] = useState('Category');
	const [filterPlatformText, setFilterPlatformText] = useState('Platform');

	const handleCategorySelect = useCallback((eventKey: string | null) => {
		if (eventKey) {
			setFilterCatText(
				eventKey.includes('Application') ? 'Applications' : 'OS'
			);
			const newQuery = { ...router.query };
			delete newQuery.offset;
			newQuery.category = eventKey;
			router.push({ pathname: router.pathname, query: newQuery });
		} else {
			setFilterCatText('Category');
			const newQuery = { ...router.query };
			delete newQuery.category;
			router.push({ pathname: router.pathname, query: newQuery });
		}
	}, [router]);

	const handlePlatformSelect = useCallback((eventKey: string | null) => {
		if (eventKey) {
			setFilterPlatformText(eventKey);
			const newQuery = { ...router.query };
			delete newQuery.offset;
			newQuery.platformType = eventKey;
			router.push({ pathname: router.pathname, query: newQuery });
		} else {
			setFilterPlatformText('Platform');
			const newQuery = { ...router.query };
			delete newQuery.platformType;
			router.push({ pathname: router.pathname, query: newQuery });
		}
	}, [router]);

	return (
		<Card>
			<Card.Header>Filter By</Card.Header>
			<ListGroup variant='flush'>
				<ListGroup.Item>
					<DropdownButton
						variant='outline-secondary'
						title={filterCatText}
						id='category-dropdown'
						className={styles.dropdownFilterBtn}
						onSelect={handleCategorySelect}
					>
						<Dropdown.Item eventKey=''>
							Select category
						</Dropdown.Item>
						<Dropdown.Item eventKey='Operating System'>
							Operating System
						</Dropdown.Item>
						<Dropdown.Item eventKey='Application Software'>
							Application Software
						</Dropdown.Item>
					</DropdownButton>
				</ListGroup.Item>
				<ListGroup.Item>
					<DropdownButton
						variant='outline-secondary'
						title={filterPlatformText}
						id='platform-dropdown'
						className={styles.dropdownFilterBtn}
						onSelect={handlePlatformSelect}
					>
						<Dropdown.Item eventKey=''>
							Select platform
						</Dropdown.Item>
						<Dropdown.Item eventKey='Windows'>
							Windows
						</Dropdown.Item>
						<Dropdown.Item eventKey='Android'>
							Android
						</Dropdown.Item>
						<Dropdown.Item eventKey='iOS'>
							iOS
						</Dropdown.Item>
						<Dropdown.Item eventKey='Linux'>
							Linux
						</Dropdown.Item>
						<Dropdown.Item eventKey='Mac'>
							Mac
						</Dropdown.Item>
					</DropdownButton>
				</ListGroup.Item>
			</ListGroup>
		</Card>
	);
};

export default ProductFilter;
