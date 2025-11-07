/**
 * Converts number of days to a formatted string (e.g., "1 year 2 months 3 days")
 * @param numberOfDays - The number of days to convert
 * @returns Formatted string representation
 */
export const getFormattedStringFromDays = (numberOfDays: number): string => {
	if (!numberOfDays || numberOfDays <= 0) {
		return '0 days';
	}

	const years = Math.floor(numberOfDays / 365);
	const months = Math.floor((numberOfDays % 365) / 30);
	const days = Math.floor((numberOfDays % 365) % 30);

	const parts: string[] = [];

	if (years > 0) {
		parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
	}
	if (months > 0) {
		parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
	}
	if (days > 0) {
		parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
	}

	return parts.length > 0 ? parts.join(' ') : '0 days';
};

/**
 * Legacy function name for backward compatibility
 * @deprecated Use getFormattedStringFromDays instead
 */
export const getFormatedStringFromDays = getFormattedStringFromDays;

/**
 * Formats a price with Indian currency formatting
 * @param price - The price to format
 * @returns Formatted price string with ₹ symbol
 */
export const formatPrice = (price: number | string): string => {
	const numPrice = typeof price === 'string' ? parseFloat(price) : price;
	if (isNaN(numPrice)) return '₹0';
	return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Truncates text to specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
	if (!text || text.length <= maxLength) return text || '';
	return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitalizes the first letter of each word
 * @param text - The text to capitalize
 * @returns Capitalized text
 */
export const capitalizeWords = (text: string): string => {
	if (!text) return '';
	return text
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

/**
 * Generates a random ID string
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Formats file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
