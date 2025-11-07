import logger from '../middleware/logger.js';

const GOVERNORATES_CODES_MAP = {
    1: "Cairo",
    2: "Alexandria",
    3: "Port Said",
    4: "Suez",
    11: "Damietta",
    12: "Al Daqhlia",
    13: "Al Sharkia",
    14: "Al Qaliobia",
    15: "Kafr Alsheekh",
    16: "Al Gharbia",
    17: "Al Monuefia",
    18: "Al Bohira",
    19: "Al Ismaellia",
    21: "Al Giza",
    22: "Beni Suief",
    23: "Al Fayoum",
    24: "Al minia",
    25: "Assyout",
    26: "Suhag",
    27: "Quena",
    28: "Aswan",
    29: "Luxor",
    31: "AlBahr AlAhmar",
    32: "AlWadi AlJadid",
    33: "Matrooh",
    34: "North Sinai",
    35: "South Sinai",
    88: "Outside Egypt"
};

export class NationalIDService {
    static validateNID(NID) {
        try {
            if (!NID || typeof NID !== 'string') {
                return {
                    isValid: false,
                    error: 'National ID must be a string'
                };
            }

            if (!/^\d{14}$/.test(NID)) {
                return {
                    isValid: false,
                    error: 'National ID must be exactly 14 digits'
                };
            }

            const century = parseInt(NID.charAt(0));
            const year = parseInt(NID.substring(1, 3));
            const month = parseInt(NID.substring(3, 5));
            const day = parseInt(NID.substring(5, 7));
            const governorate = parseInt(NID.substring(7, 9));
            const uniqueNum = parseInt(NID.substring(9, 13));
            const verificationDigit = parseInt(NID.charAt(13));

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();

            // Validate century (2 for 1900s, 3 for 2000s)
            if (century !== 2 && century !== 3) {
                return {
                    isValid: false,
                    error: 'Invalid century code'
                };
            }

            // Validate year
            const fullYear = century === 3 ? 2000 + year : 1900 + year;
            if (fullYear > currentYear || fullYear < 1900) {
                return {
                    isValid: false,
                    error: 'Invalid birth year'
                };
            }

            // Validate month
            if (month < 1 || month > 12) {
                return {
                    isValid: false,
                    error: 'Invalid birth month'
                };
            }

            // Validate day
            const dayValidation = this.validateDay(day, month, fullYear);
            if (!dayValidation.isValid) {
                return dayValidation;
            }

            // Validate governorate
            if (!(governorate in GOVERNORATES_CODES_MAP)) {
                return {
                    isValid: false,
                    error: 'Invalid governorate code'
                };
            }

            // Validate verification digit
            const calculatedDigit = this.calculateVerificationDigit(NID.slice(0, 13));
            if (calculatedDigit !== verificationDigit) {
                return {
                    isValid: false,
                    error: 'Invalid verification digit'
                };
            }

            // Get additional info
            const info = this.extractInfo(century, year, month, day, governorate, uniqueNum);

            logger.info('National ID validated successfully', { 
                governorate: info.governorate,
                gender: info.gender
            });

            return {
                isValid: true,
                info
            };
        } catch (error) {
            logger.error('Error validating National ID', { error: error.message });
            return {
                isValid: false,
                error: 'Validation error occurred'
            };
        }
    }

    static validateDay(day, month, year) {
        if (day < 1) {
            return {
                isValid: false,
                error: 'Day must be at least 1'
            };
        }

        const daysInMonth = this.getDaysInMonth(month, year);
        if (day > daysInMonth) {
            return {
                isValid: false,
                error: `Invalid day for month ${month}`
            };
        }

        return { isValid: true };
    }

    static getDaysInMonth(month, year) {
        const thirtyOneDayMonths = [1, 3, 5, 7, 8, 10, 12];
        const thirtyDayMonths = [4, 6, 9, 11];

        if (thirtyOneDayMonths.includes(month)) {
            return 31;
        } else if (thirtyDayMonths.includes(month)) {
            return 30;
        } else if (month === 2) {
            return this.isLeapYear(year) ? 29 : 28;
        }
        
        return 30; // fallback
    }

    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    static calculateVerificationDigit(nationalID) {
        try {
            if (!nationalID || nationalID.length !== 13) {
                throw new Error('Invalid national ID length for verification');
            }

            const digits = nationalID.split('').map(Number);
            const factors = [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
            
            const sum = digits.reduce((acc, digit, index) => {
                return acc + (digit * factors[index]);
            }, 0);

            const remainder = sum % 11;

            if (remainder === 10) {
                return 0;
            } else if (remainder === 0) {
                return 1;
            } else {
                return 11 - remainder;
            }
        } catch (error) {
            logger.error('Error calculating verification digit', { error: error.message });
            throw error;
        }
    }

    static extractInfo(century, year, month, day, governorate, uniqueNum) {
        const fullYear = century === 3 ? 2000 + year : 1900 + year;
        
        return {
            birthDate: {
                year: fullYear,
                month,
                day,
                formatted: `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            },
            governorate: GOVERNORATES_CODES_MAP[governorate],
            governorateCode: governorate,
            gender: uniqueNum % 2 === 0 ? 'Female' : 'Male',
            age: new Date().getFullYear() - fullYear
        };
    }

    static getGovernoratesList() {
        return Object.entries(GOVERNORATES_CODES_MAP).map(([code, name]) => ({
            code: parseInt(code),
            name
        }));
    }
}

// Legacy function for backward compatibility
export function validateNID(NID) {
    const result = NationalIDService.validateNID(NID);
    return result.isValid;
}


// Legacy function for backward compatibility
export function get_info(century, year, month, day, governorate, unique_num) {
    try {
        const info = NationalIDService.extractInfo(century, year, month, day, governorate, unique_num);
        
        const legacyFormat = {
            year_of_birth: info.birthDate.year.toString(),
            month_of_birth: info.birthDate.month.toString(),
            day_of_birth: info.birthDate.day.toString(),
            governorate: info.governorate,
            type: info.gender
        };
        
        return [true, legacyFormat];
    } catch (error) {
        logger.error('Error extracting legacy info', { error: error.message });
        return [false, null];
    }
}