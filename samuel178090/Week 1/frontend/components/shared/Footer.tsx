import React, { FC } from 'react';

const Footer: FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='mt-auto'>
			<hr className='mb-3' />
			<div className='text-center py-3'>
				<p className='footerText mb-0 text-muted'>
					Copyright © {currentYear} QDACK. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
