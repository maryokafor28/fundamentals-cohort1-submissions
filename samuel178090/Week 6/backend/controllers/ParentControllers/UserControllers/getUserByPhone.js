// Mock implementation for development
const mockUserRepository = {
    async findUserByPhone(phone) {
        if (phone === '01234567890') {
            return {
                UID: 'user-123',
                firstName: 'John',
                LastName: 'Doe',
                phone: '01234567890',
                username: 'johndoe'
            };
        }
        return null;
    }
};

const userRepository = mockUserRepository;

// Check if a phone number is registered (public endpoint for user lookup)
export async function getUserByPhone(req, res) {
    try {
        const { phone } = req.params;

        // Input validation
        if (!phone) {
            return res.status(400).json({ 
                error: "Phone number is required" 
            });
        }

        if (!/^\d{11}$/.test(phone)) {
            return res.status(400).json({ 
                error: "Invalid phone number format" 
            });
        }

        const user = await userRepository.findUserByPhone(phone);

        if (!user) {
            return res.status(404).json({ 
                error: 'This phone number is not registered.' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "User found",
            exists: true
        });
        
    } catch (error) {
        console.error('Error checking phone number:', error);
        return res.status(500).json({ 
            error: 'Failed to check phone number. Please try again.' 
        });
    }
}