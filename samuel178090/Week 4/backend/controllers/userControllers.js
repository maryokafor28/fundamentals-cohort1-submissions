const HttpError = require('../models/errorModel')
const UserModel = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const fs = require("fs")

// UUID fallback for older Node.js versions
const generateUUID = () => {
    try {
        return crypto.randomUUID()
    } catch (error) {
        // Fallback for Node.js < 14.17
        return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0
            const v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
}
const path = require("path")
const cloudinary = require("../utils/cloudinary")

//=============== REGISTER USER
//POST : /api/users/register
//UNPROTECTED
const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        
        // Input validation
        if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword) {
            return next(new HttpError("Fill in all fields", 422));
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new HttpError("Please enter a valid email", 422));
        }
        
        const lowerCaseEmail = email.toLowerCase().trim();
        const emailExist = await UserModel.findOne({ email: lowerCaseEmail });
        if (emailExist) {
            return next(new HttpError("Email already exist", 422));
        }
        
        if (password !== confirmPassword) {
            return next(new HttpError("Password do not match", 422));
        }
        
        // Simple password validation for testing
        if (password.length < 6) {
            return next(new HttpError("Password must be at least 6 characters", 422));
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await UserModel.create({ 
            fullName: fullName.trim(), 
            email: lowerCaseEmail, 
            password: hashedPassword 
        });
        
        // Don't return password in response
        const { password: _, ...userResponse } = newUser.toObject();
        res.status(201).json(userResponse);
    } catch (error) {
        return next(new HttpError(error.message || "Registration failed", 500));
    }
};

//=============== LOGIN USER
//POST : /api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }

        //make email lowercased
        const lowerCaseEmail = email.toLowerCase();
        // fetch user from database
        const user = await UserModel.findOne({ email: lowerCaseEmail })
        if (!user) {
            return next(new HttpError("Invalid credentials", 422))
        }
        //compare passwords
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return next(new HttpError("Invalid credentials", 422))
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        
        // Set secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        // Return token AND user data in response
        res.status(200).json({ 
            message: "Login successful",
            token: token, // ← ADDED THIS
            user: { 
                _id: user._id,
                id: user._id, 
                fullName: user.fullName, 
                email: user.email,
                profilePhoto: user.profilePhoto || null,
                bio: user.bio || "",
                followers: user.followers || [],
                following: user.following || []
            }
        })

    } catch (error) {
        return next(new HttpError(error.message || "Login failed", 500))
    }
}

//=============== GET USER
//GET : /api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select("-password")
        if (!user) {
            return next(new HttpError("User not found", 422))
        }
        res.status(200).json(user)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//=============== GET USERS
//GET : /api/users
//PROTECTED
const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().limit(10).sort({ createdAt: -1 })
        res.json(users);
    } catch (error) {
        return next(new HttpError(error))
    }
}

//=============== EDIT USER
//PATCH : /api/users/edit
//PROTECTED
const editUser = async (req, res, next) => {
    try {
        const { fullName, bio } = req.body;
        
        if(!fullName?.trim()) {
            return next(new HttpError("Full name is required", 422))
        }
        
        const editedUser = await UserModel.findByIdAndUpdate(
            req.user.id, 
            { 
                fullName: fullName.trim(), 
                bio: bio?.trim() || "No bio yet" 
            }, 
            { new: true }
        ).select('-password');
        
        res.status(200).json(editedUser);
    } catch (error) {
        return next(new HttpError(error.message || "Failed to update profile", 500))
    }
}

//=============== FOLLOW/UNFOLLOW USER
//POST : /api/users/:id/follow
//PROTECTED
const followUnfollowUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id;
        
        if (req.user.id === userToFollowId) {
            return next(new HttpError("You cannot follow yourself", 422))
        }
        
        // Check if user to follow exists
        const userToFollow = await UserModel.findById(userToFollowId);
        if(!userToFollow) {
            return next(new HttpError("User not found", 404))
        }
        
        const currentUser = await UserModel.findById(req.user.id);
        const isFollowing = currentUser.following.includes(userToFollowId);
        
        let updatedUser;
        if (!isFollowing) {
            // Follow user
            updatedUser = await UserModel.findByIdAndUpdate(
                userToFollowId,
                { $push: { followers: req.user.id } }, 
                { new: true }
            ).select('-password');
            
            await UserModel.findByIdAndUpdate(
                req.user.id, 
                { $push: { following: userToFollowId } }
            );
        } else {
            // Unfollow user
            updatedUser = await UserModel.findByIdAndUpdate(
                userToFollowId,
                { $pull: { followers: req.user.id } }, 
                { new: true }
            ).select('-password');
            
            await UserModel.findByIdAndUpdate(
                req.user.id, 
                { $pull: { following: userToFollowId } }
            );
        }
        
        res.json({
            message: isFollowing ? "User unfollowed" : "User followed",
            user: updatedUser
        });
    } catch (error) {
        return next(new HttpError(error.message || "Failed to follow/unfollow user", 500))
    }
}

//=============== CHANGE USER PROFILE PHOTO
//POST : /api/users/avatar
//PROTECTED
const changeUserAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("Please choose an image", 422))
        }
        
        const { avatar } = req.files;
        
        // Check file size (2MB limit)
        if (avatar.size > 2000000) {
            return next(new HttpError("Profile picture too big. Should be less than 2MB", 422))
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(avatar.mimetype)) {
            return next(new HttpError("Please upload a valid image file (JPEG, PNG, WebP)", 422))
        }
        
        let fileName = avatar.name;
        let splittedFilename = fileName.split(".");
        let newFilename = splittedFilename[0] + generateUUID() + "." + splittedFilename[splittedFilename.length - 1];
        const uploadPath = path.join(__dirname, "..", "uploads", newFilename);

        avatar.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError("File upload failed: " + err.message, 500))
            }
            
            let profilePhotoUrl;
            
            try {
                // Try Cloudinary upload
                const result = await cloudinary.uploader.upload(uploadPath, {
                    resource_type: "image",
                    folder: "devconnect/avatars",
                    transformation: [
                        { width: 300, height: 300, crop: "fill", gravity: "face" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                });
                
                profilePhotoUrl = result.secure_url;
                // Clean up local file after successful upload
                fs.unlink(uploadPath, (unlinkErr) => {
                    if (unlinkErr) console.log('Failed to delete local file:', unlinkErr);
                });
                
            } catch (cloudinaryError) {
                console.log('Cloudinary failed, using local storage:', cloudinaryError.message);
                // Fallback: use local file URL
                profilePhotoUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${newFilename}`;
            }
            
            // Update user in database
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.user.id, 
                { profilePhoto: profilePhotoUrl }, 
                { new: true }
            ).select('-password');
            
            res.status(200).json({
                message: "Profile photo updated successfully",
                user: updatedUser,
                profilePhoto: profilePhotoUrl
            });
        })
    } catch (error) {
        return next(new HttpError(error.message || "Avatar upload failed", 500))
    }
}

//=============== LOGOUT USER
//POST : /api/users/logout
//PROTECTED
const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return next(new HttpError(error.message || "Logout failed", 500))
    }
}

module.exports = { registerUser, loginUser, logoutUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar }