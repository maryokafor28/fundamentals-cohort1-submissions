import React, { FC, useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { Archive, Eye, Pen } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import { getFormatedStringFromDays } from '../../helper/utils';
import { Products } from '../../services/product.service';
import SkuDetailsForm from './SkuDetailsForm';
import SkuDetailsLicense from './SkuDetailsLicense';

interface ISkuDetailsListProps {
	skuDetails: any[];
	productId: string;
	setAllSkuDetails: (skuDetails: any[]) => void;
}

const SkuDetailsList: FC<ISkuDetailsListProps> = ({
	skuDetails: allSkuDetails,
	productId,
	setAllSkuDetails,
}) => {
	const [skuDetailsFormShow, setSkuDetailsFormShow] = useState(false);
	const [skuIdForUpdate, setSkuIdForUpdate] = useState('');
	const [licensesListFor, setLicensesListFor] = useState('');
	const [isLoadingForDelete, setIsLoadingForDelete] = useState<{
		status: boolean;
		id: string;
	}>({
		status: false,
		id: '',
	});
	const deleteHandler = async (skuId: string) => {
		try {
			const deleteConfirm = confirm(
				'Are you sure you want to delete this SKU? This will also delete all associated licenses.'
			);
			if (deleteConfirm) {
				setIsLoadingForDelete({ status: true, id: skuId });
				const deleteSkuRes = await Products.deleteSku(productId, skuId);
				if (!deleteSkuRes.success) {
					throw new Error(deleteSkuRes.message);
				}
				setAllSkuDetails(
					allSkuDetails.filter((sku: { _id: string }) => sku._id !== skuId)
				);
				toast.success(deleteSkuRes.message || 'SKU deleted successfully');
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
			setIsLoadingForDelete({ status: false, id: '' });
		}
	};

	return (
		<>
			{!skuDetailsFormShow && !licensesListFor && (
				<>
					<div className='d-flex justify-content-between align-items-center mb-3'>
						<h5 className='mb-0'>SKU Details</h5>
						<Button
							variant='primary'
							onClick={() => setSkuDetailsFormShow(true)}
						>
							Add SKU Details
						</Button>
					</div>
					<Table responsive striped hover>
						<thead>
							<tr>
								<th>Name</th>
								<th>Price</th>
								{/* <th>Quantity</th> */}
								<th>License Keys</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{allSkuDetails && allSkuDetails.length > 0 ? (
								allSkuDetails.map((skuDetail: any, key: any) => (
									<tr key={skuDetail._id || key}>
										<td>{skuDetail?.skuName}</td>
										<td>
											₹{skuDetail?.price}{' '}
											<Badge bg='warning' text='dark'>
												{skuDetail?.lifetime
													? 'Lifetime'
													: getFormatedStringFromDays(skuDetail?.validity)}
											</Badge>
										</td>
										{/* <td>{skuDetail?.quantity}</td> */}
										<td>
											<Button
												variant='outline-info'
												size='sm'
												onClick={() => {
													setLicensesListFor(skuDetail?._id);
													setSkuDetailsFormShow(false);
												}}
												title='View License Keys'
												disabled={isLoadingForDelete.status}
											>
												<Eye /> View
											</Button>
										</td>
										<td>
											<Button
												variant='outline-primary'
												size='sm'
												className='me-2'
												onClick={() => {
													setSkuIdForUpdate(skuDetail._id);
													setSkuDetailsFormShow(true);
												}}
												title='Edit SKU'
												disabled={isLoadingForDelete.status}
											>
												<Pen />
											</Button>
											<Button
												variant='outline-danger'
												size='sm'
												onClick={() => deleteHandler(skuDetail._id)}
												disabled={isLoadingForDelete.status && isLoadingForDelete.id === skuDetail._id}
												title='Delete SKU'
											>
												{isLoadingForDelete.status &&
												isLoadingForDelete.id === skuDetail._id ? (
													<span
														className='spinner-border spinner-border-sm'
														role='status'
														aria-hidden='true'
													></span>
												) : (
													<Archive />
												)}
											</Button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className='text-center text-muted py-4'>
										<div>
											<p className='mb-2'>No SKU Details found</p>
											<small>Click 'Add SKU Details' to get started</small>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</>
			)}

			{skuDetailsFormShow && (
				<SkuDetailsForm
					setSkuDetailsFormShow={setSkuDetailsFormShow}
					setAllSkuDetails={setAllSkuDetails}
					allSkuDetails={allSkuDetails}
					productId={productId}
					skuIdForUpdate={skuIdForUpdate}
					setSkuIdForUpdate={setSkuIdForUpdate}
				/>
			)}

			{licensesListFor && (
				<SkuDetailsLicense
					licensesListFor={licensesListFor}
					setLicensesListFor={setLicensesListFor}
					productId={productId}
				/>
			)}
		</>
	);
};

export default SkuDetailsList;
