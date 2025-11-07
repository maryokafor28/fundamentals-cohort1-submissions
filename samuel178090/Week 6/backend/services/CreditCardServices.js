import axios from "axios";
import logger from '../middleware/logger.js';

export class CreditCardService {
    constructor() {
        this.apiKey = process.env.XRapidAPIKey;
        this.apiHost = process.env.XRapidAPIHost;
        this.baseURL = 'https://fake-credit-card-number-generator-api.p.rapidapi.com';
        
        if (!this.apiKey || !this.apiHost) {
            logger.error('Credit card API credentials not configured');
            throw new Error('Credit card service not properly configured');
        }
    }

    async generateCreditCard(creditCardType) {
        try {
            if (!creditCardType) {
                throw new Error('Credit card type is required');
            }

            const validTypes = ['visa', 'mastercard', 'amex', 'jcb'];
            if (!validTypes.includes(creditCardType.toLowerCase())) {
                throw new Error(`Invalid credit card type. Must be one of: ${validTypes.join(', ')}`);
            }

            const url = `${this.baseURL}/creditcard-cardgenerate/${creditCardType.toLowerCase()}`;
            const options = {
                method: 'GET',
                url,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': this.apiHost
                },
                timeout: 10000 // 10 second timeout
            };

            logger.info('Generating credit card', { type: creditCardType });
            const response = await axios.request(options);
            
            if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                throw new Error('Invalid response from credit card generation API');
            }

            logger.info('Credit card generated successfully', { type: creditCardType });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error('Error generating credit card', { 
                type: creditCardType, 
                error: error.message,
                isAxiosError: error.isAxiosError
            });
            
            return {
                success: false,
                error: error.message,
                isAxiosError: error.isAxiosError || false
            };
        }
    }
}

// Legacy function for backward compatibility
export const fetchCCData = async (creditCardType) => {
    const service = new CreditCardService();
    const result = await service.generateCreditCard(creditCardType);
    
    if (result.success) {
        return result;
    } else {
        const error = new Error(result.error);
        error.isAxiosError = result.isAxiosError;
        return error;
    }
};

export class CreditCardValidator {
    static validateCreditCardInfo(cardNumber, cvv, expiryDate) {
        try {
            if (!cardNumber || !cvv || !expiryDate) {
                return {
                    isValid: false,
                    errors: ['Card number, CVV, and expiry date are required']
                };
            }

            const errors = [];
            
            if (!this.validateCreditCardNumber(cardNumber)) {
                errors.push('Invalid credit card number');
            }
            
            if (!this.validateCVV(cvv)) {
                errors.push('Invalid CVV');
            }
            
            if (this.isCreditCardExpired(expiryDate)) {
                errors.push('Credit card has expired');
            }

            return {
                isValid: errors.length === 0,
                errors
            };
        } catch (error) {
            logger.error('Error validating credit card info', { error: error.message });
            return {
                isValid: false,
                errors: ['Validation error occurred']
            };
        }
    }

    static validateCreditCardNumber(cardNumber) {
        try {
            if (!cardNumber || typeof cardNumber !== 'string') {
                return false;
            }

            const cleanCardNumber = cardNumber.replace(/\D/g, '');
            
            if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
                return false;
            }

            // Luhn algorithm implementation
            let sum = 0;
            let isEven = false;

            for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cleanCardNumber[i], 10);

                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                isEven = !isEven;
            }

            return sum % 10 === 0;
        } catch (error) {
            logger.error('Error validating credit card number', { error: error.message });
            return false;
        }
    }

    static validateCVV(cvv) {
        try {
            if (!cvv) {
                return false;
            }
            
            const cvvString = cvv.toString();
            return /^\d{3,4}$/.test(cvvString);
        } catch (error) {
            logger.error('Error validating CVV', { error: error.message });
            return false;
        }
    }

    static isCreditCardExpired(expiryDate) {
        try {
            if (!expiryDate || typeof expiryDate !== 'string') {
                return true;
            }

            // Support MM/YY and MM/YYYY formats
            const parts = expiryDate.split('/');
            if (parts.length !== 2) {
                return true;
            }

            const month = parseInt(parts[0], 10);
            let year = parseInt(parts[1], 10);

            if (month < 1 || month > 12) {
                return true;
            }

            // Convert YY to YYYY
            if (year < 100) {
                year += 2000;
            }

            const expiration = new Date(year, month - 1);
            const now = new Date();
            
            // Set to last day of expiry month
            expiration.setMonth(expiration.getMonth() + 1, 0);
            
            return expiration < now;
        } catch (error) {
            logger.error('Error checking credit card expiration', { error: error.message });
            return true;
        }
    }

    static getCardType(cardNumber) {
        try {
            if (!cardNumber) {
                return 'unknown';
            }

            const cleanNumber = cardNumber.replace(/\D/g, '');
            
            if (/^4/.test(cleanNumber)) {
                return 'visa';
            } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
                return 'mastercard';
            } else if (/^3[47]/.test(cleanNumber)) {
                return 'amex';
            } else if (/^35/.test(cleanNumber)) {
                return 'jcb';
            }
            
            return 'unknown';
        } catch (error) {
            logger.error('Error determining card type', { error: error.message });
            return 'unknown';
        }
    }
}

// Legacy functions for backward compatibility
export function validateCreditCardInfo(cardNumber, cvv, expiryDate) {
    const result = CreditCardValidator.validateCreditCardInfo(cardNumber, cvv, expiryDate);
    return result.isValid;
}
