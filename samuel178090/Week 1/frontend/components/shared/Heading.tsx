import Head from 'next/head';
import { FC } from 'react';

interface IHeadingProps {
	title?: string;
	description?: string;
	keywords?: string;
	canonicalUrl?: string;
}

const Heading: FC<IHeadingProps> = ({
	title = 'QDACK',
	description = 'QDACK - Get Instant License In a Click',
	keywords = 'digital licenses, software licenses, instant download, QDACK',
	canonicalUrl,
}) => {
	const fullTitle = title === 'QDACK' ? title : `${title} | QDACK`;

	return (
		<Head>
			<title>{fullTitle}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta name='robots' content='index, follow' />
			<meta property='og:title' content={fullTitle} />
			<meta property='og:description' content={description} />
			<meta property='og:type' content='website' />
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={fullTitle} />
			<meta name='twitter:description' content={description} />
			{canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
			<link rel='icon' href='/favicon.ico' />
			<link rel='apple-touch-icon' href='/apple-touch-icon.png' />
		</Head>
	);
};

export default Heading;
