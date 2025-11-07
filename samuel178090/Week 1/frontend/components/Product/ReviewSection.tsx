import React, { FC, useContext, useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { ArrowClockwise, PersonFill } from 'react-bootstrap-icons';
import ReactStars from 'react-stars';
import toast from 'react-hot-toast';
import { Context } from '../../context';
import { Products } from '../../services/product.service';

interface IProps {
	reviews: Record<string, any>[];
	productId: string;
}

const initialState = {
	rating: 0,
	comment: '',
};

const ReviewSection: FC<IProps> = ({ reviews, productId }) => {
	const [filteredReviews, setFilteredReviews] = useState(reviews);
	const [allReviews, setAllReviews] = useState(reviews);
	const [isLoading, setIsLoading] = useState(false);
	const [reviewForm, setReviewForm] = useState(initialState);
	const [filterValue, setFilterValue] = useState(0);
	const [formShown, setFormShown] = useState(false);
	const {
		state: { user },
	} = useContext(Context);

	useEffect(() => {
		setFilteredReviews(reviews);
		setAllReviews(reviews);
	}, [reviews]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const { rating, comment } = reviewForm;
			if (!rating || rating === 0) {
				toast.error('Please select a rating');
				return false;
			}
			if (!comment.trim()) {
				toast.error('Please write a review');
				return false;
			}
			if (comment.trim().length < 10) {
				toast.error('Review must be at least 10 characters long');
				return false;
			}

			const newReviewResponse = await Products.addReview(productId, reviewForm);
			if (newReviewResponse.success) {
				toast.success(newReviewResponse.message);
				// Add the new review to the existing reviews
				const updatedReviews = [...allReviews, newReviewResponse.result];
				setAllReviews(updatedReviews);
				setFilteredReviews(updatedReviews);
			}
			setReviewForm(initialState);
			setFormShown(false);
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
	const handleDelete = async (e: any, id: string) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const delProdRes = await Products.deleteReview(productId, id);
			toast.success(delProdRes.message);
			// Remove the deleted review from the existing reviews
			const updatedReviews = allReviews.filter(review => review._id !== id);
			setAllReviews(updatedReviews);
			setFilteredReviews(updatedReviews);
			setReviewForm(initialState);
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
		<div>
			{user && user.email && (
				<div>
					{!formShown && (
						<Button
							variant='outline-info'
							className='addReview'
							onClick={() => {
								setFormShown(true);
							}}
						>
							Add review
						</Button>
					)}
					{formShown && (
						<div className='reviewInputZone'>
							<Form>
								<Form.Group className='mb-3' controlId='formBasicEmail'>
									<Form.Label>Your Rating</Form.Label>
									<br />
									<ReactStars
										count={5}
										value={reviewForm.rating}
										onChange={(nextValue: number) =>
											setReviewForm({ ...reviewForm, rating: nextValue })
										}
										size={24}
										color2={'#ffd700'}
									/>
								</Form.Group>
								<Form.Group className='mb-3' controlId='formBasicPassword'>
									<Form.Label>Your Review</Form.Label>
									<Form.Control
										as='textarea'
										rows={3}
										value={reviewForm.comment}
										onChange={(e) =>
											setReviewForm({ ...reviewForm, comment: e.target.value })
										}
										placeholder="Write your detailed review here (minimum 10 characters)"
										maxLength={500}
										disabled={isLoading}
									/>
									<Form.Text className="text-muted">
										{reviewForm.comment.length}/500 characters
									</Form.Text>
								</Form.Group>
								<Form.Group
									className='mb-3'
									controlId='formBasicCheckbox'
								></Form.Group>
								<Button
									variant='secondary'
									onClick={() => {
										setReviewForm(initialState);
										setFormShown(false);
									}}
									disabled={isLoading}
								>
									Cancel
								</Button>{' '}
								<Button
									variant='primary'
									type='submit'
									onClick={(e) => handleSubmit(e)}
									disabled={isLoading}
								>
									{isLoading && (
										<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
									)}
									{isLoading ? 'Submitting...' : 'Submit'}
								</Button>
							</Form>
						</div>
					)}
					<hr />
				</div>
			)}

			<div className='filterRating'>
				<h5>Filter By - </h5>
				<ReactStars
					count={5}
					value={filterValue}
					onChange={(number: number) => {
						const filteredAllReview: Record<string, any>[] =
							filteredReviews.filter((value) => value.rating === number);
						setAllReviews(filteredAllReview);
						setFilterValue(number);
					}}
					size={24}
					color2={'#ffd700'}
				/>
				<Button
					className='reloadBtn'
					variant='outline-secondary'
					onClick={() => {
						setAllReviews(filteredReviews);
						setFilterValue(0);
					}}
				>
					<ArrowClockwise />
				</Button>
			</div>
			<div className='reviewZone'>
				{' '}
				{allReviews.map((review, index) => (
					<Card
						bg='light'
						key={review._id || index}
						text='dark'
						style={{ width: '100%' }}
						className='mb-2'
					>
						<Card.Header className='reviewHeader'>
							<PersonFill className='personReview' />
							{review.customerName}
							<ReactStars
								count={5}
								value={review.rating}
								edit={false}
								size={20}
								color2={'#ffd700'}
							/>
						</Card.Header>
						<Card.Body>
							<Card.Text>
								<p className='reviewDt text-muted small'>
									{new Date(review.updatedAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</p>
								{review.comment || review.feedbackMsg}
							</Card.Text>
							<Button
								variant='danger'
								onClick={(e) => handleDelete(e, review._id)}
								disabled={isLoading}
							>
								Delete
							</Button>
						</Card.Body>
					</Card>
				))}
				{allReviews.length < 1 && <h5>No reviews</h5>}
			</div>
		</div>
	);
};

export default ReviewSection;
