"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
    },
    bio: {
        type: String,
        trim: true,
        minLength: [10, "Bio must be at least 2 charaters long"],
    },
    avatar: {
        type: String,
        required: true,
        default: function () {
            return this.name ? this.name.charAt(0).toUpperCase() : "U";
        },
    },
    LinkedIn: {
        type: String,
        trim: true,
        match: [
            /^https:\/\/(www\.)?linkedin\.com\/.*$/,
            "Please enter a valid LinkedIn URL",
        ],
    },
    skills: {
        type: [String],
        default: [],
        lowercase: true,
    },
    github: {
        type: String,
        trim: true,
        match: [
            /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/,
            "Please enter a valid GitHub URL",
        ],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
    refreshToken: {
        type: String,
        default: null,
        select: false,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password"))
            return next();
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error); // Pass error to Mongoose
    }
});
// 🧮 Method to compare passwords
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt_1.default.compare(candidate, this.password);
};
exports.User = mongoose_1.default.model("User", userSchema);
