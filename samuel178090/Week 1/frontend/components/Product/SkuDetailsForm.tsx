import React, { FC, useEffect, useState } from 'react';
import {
	Button,
	Card,
	Dropdown,
	DropdownButton,
	Form,
	InputGroup,
} from 'react-bootstrap';
import toast from 'react-hot-toast';
import { getFormattedStringFromDays } from '../../helper/utils';
import { Products } from '../../services/product.service';

interface ISkuDetailsFormProps {
	setSkuDetailsFormShow: any;
	productId: string;
	setAllSkuDetails: any;
	allSkuDetails: any;
	skuIdForUpdate: string;
	setSkuIdForUpdate: any;
}

const initialState = {
	skuName: '',
	price: 0,
	validity: 0,
	validityType: 'Select Type',
	lifetime: false,
};

const SkuDetailsForm: FC<ISkuDetailsFormProps> = ({
	setSkuDetailsFormShow,
	productId,
	setAllSkuDetails,
	allSkuDetails,
	skuIdForUpdate,
	setSkuIdForUpdate,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [skuForm, setSkuForm] = useState(initialState);
	const handleCancel = () => {
		setSkuIdForUpdate('');
		setSkuForm(initialState);
		setSkuDetailsFormShow(false);
	};

	useEffect(() => {
		if (skuIdForUpdate) {
			const sku = allSkuDetails.find(
				(sku: { _id: string }) => sku._id === skuIdForUpdate
			);
			const periodTimes = getFormattedStringFromDays(sku?.validity);
			setSkuForm({
				...initialState,
				...sku,
				validity: periodTimes.split(' ')[0] || 0,
				validityType: periodTimes.split(' ')[1] || 'Select Type',
			});
		}
	}, [skuIdForUpdate, allSkuDetails]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const { skuName, price, validity, lifetime } = skuForm;
			if (!skuName.trim()) {
				toast.error('Please enter SKU name');
				return;
			}
			if (!price || price <= 0) {
				toast.error('Please enter a valid price');
				return;
			}
			if (!lifetime && (!validity || validity <= 0)) {
				toast.error('Please enter validity period');
				return;
			}
			if (!lifetime && skuForm.validityType === 'Select Type') {
				toast.error('Please select validity type');
				return;
			}

			if (!lifetime) {
				skuForm.validity =
					skuForm.validityType === 'months'
						? skuForm.validity * 30 // convert to days to store
						: skuForm.validity * 365;
			} else {
				skuForm.validity = Number.MAX_SAFE_INTEGER;
			}
			setIsLoading(true);
			// Prepare SKU data for API
			const skuData = {
				price: skuForm.price,
				validity: skuForm.validity,
				lifetime: skuForm.lifetime,
			};
			
			const skuDetailsRes = skuIdForUpdate
				? await Products.updateSku(productId, skuIdForUpdate, skuData)
				: await Products.addSku(productId, skuData);
				
			if (!skuDetailsRes.success) {
				throw new Error(skuDetailsRes.message);
			}
			toast.success(skuDetailsRes.message || 'SKU saved successfully');
			setSkuDetailsFormShow(false);
			setSkuIdForUpdate('');
			// Refresh the SKU list by calling parent component method
			// Note: The API returns a single SKU, not skuDetails array
			if (typeof setAllSkuDetails === 'function') {
				// This should trigger a refresh in the parent component
				setAllSkuDetails((prev: any) => 
					skuIdForUpdate 
						? prev.map((sku: any) => sku._id === skuIdForUpdate ? skuDetailsRes.result : sku)
						: [...prev, skuDetailsRes.result]
				);
			}
		} catch (error: any) {
			if (error.response) {
				if (Array.isArray(error.response?.data?.message)) {
					return error.response.data.message.forEach((message: any) => {
						toast.error(message);
					});
				} else {
					return toast.error(error.response.data.message);
				}
			}
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card style={{ padding: '10px' }}>
			<h6 style={{ color: 'green' }}>SKU information ::</h6>
			<Form>
				<Form.Group controlId='formBasicEmail'>
					<Form.Label>SKU Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter SKU Name'
						value={skuForm.skuName}
						onChange={(e) =>
							setSkuForm({ ...skuForm, skuName: e.target.value })
						}
						disabled={isLoading}
						required
					/>
				</Form.Group>
				<Form.Group controlId='formBasicPassword'>
					<Form.Label>SKU Price For Each License</Form.Label>
					<Form.Control
						type='number'
						placeholder='Enter SKU Price'
						value={skuForm.price}
						onChange={(e) =>
							setSkuForm({ ...skuForm, price: parseFloat(e.target.value) || 0 })
						}
						disabled={isLoading}
						min='0'
						step='0.01'
						required
					/>
				</Form.Group>
				<Form.Group controlId='formBasicPassword'>
					<Form.Label>SKU Validity</Form.Label>{' '}
					<small style={{ color: 'grey' }}>
						(If validity is lifetime then check the box)
						<Form.Check
							type='switch'
							id='custom-switch'
							label='Lifetime'
							checked={skuForm.lifetime}
							onChange={(e) =>
								e.target.checked
									? setSkuForm({
											...skuForm,
											lifetime: e.target.checked,
											validity: 0,
											validityType: 'Select Type',
									  })
									: setSkuForm({
											...skuForm,
											validity: 0,
											lifetime: e.target.checked,
											validityType: 'Select Type',
									  })
							}
						/>
					</small>
					<InputGroup className='mb-3'>
						<Form.Control
							aria-label='Text input with checkbox'
							disabled={skuForm.lifetime}
							type='number'
							value={skuForm.validity}
							onChange={(e) =>
								setSkuForm({ ...skuForm, validity: parseInt(e.target.value) })
							}
						/>
						<DropdownButton
							variant='outline-secondary'
							title={skuForm.validityType}
							id='input-group-dropdown-9'
							disabled={skuForm.lifetime}
							align='end'
							onSelect={(e) =>
								setSkuForm({
									...skuForm,
									validityType: e || '',
								})
							}
						>
							<Dropdown.Item href='#' eventKey={'months'}>
								Months
							</Dropdown.Item>
							<Dropdown.Item href='#' eventKey={'years'}>
								Years
							</Dropdown.Item>
						</DropdownButton>
					</InputGroup>
				</Form.Group>

				<div style={{ marginTop: '10px' }}>
					<Button variant='outline-info' onClick={handleCancel}>
						Cancel
					</Button>{' '}
					<Button
						variant='outline-primary'
						type='submit'
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading && (
							<span
								className='spinner-border spinner-border-sm me-2'
								role='status'
								aria-hidden='true'
							></span>
						)}
						{isLoading ? 'Submitting...' : 'Submit'}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default SkuDetailsForm;
