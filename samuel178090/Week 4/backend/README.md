# DEVconnect Backend API

The Node.js/Express backend API for DEVconnect social media platform.

## 🚀 Live API

**Backend API**: [https://devconnect-api-ja9c.onrender.com/api](https://devconnect-api-ja9c.onrender.com/api)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

## 🔒 Security Features

- **Rate Limiting** - API protection against abuse
- **Input Sanitization** - XSS prevention
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

1. **Clone and navigate**
```bash
git clone https://github.com/ajewolesamuel/DEVconnect.git
cd DEVconnect/serverbackend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment**
```env
NODE_ENV=development
PORT=5000
MONGO_URL=mongodb://localhost:27017/devconnect
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. **Start development server**
```bash
npm run dev
```

## 📁 Project Structure

```
serverbackend/
├── controllers/         # Route controllers
│   ├── userControllers.js    # User management
│   ├── postControllers.js    # Post operations
│   ├── messageControllers.js # Messaging system
│   └── commentControllers.js # Comment handling
├── middleware/         # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   ├── errorMiddleware.js    # Error handling
│   ├── rateLimiter.js        # Rate limiting
│   └── sanitizer.js          # Input sanitization
├── models/            # Database models
│   ├── userModel.js          # User schema
│   ├── postModel.js          # Post schema
│   ├── MessageModel.js       # Message schema
│   └── commentModel.js       # Comment schema
├── routes/            # API routes
│   └── routes.js             # All route definitions
├── socket/            # Socket.io configuration
│   └── socket.js             # Real-time events
├── utils/             # Utility functions
│   ├── cloudinary.js         # Image upload config
│   └── logger.js             # Logging utility
├── uploads/           # Local file storage
├── tests/             # Test files
└── index.js           # Server entry point
```

## 📚 API Endpoints

### Authentication
```
POST   /api/users/register     # Register new user
POST   /api/users/login        # User login
POST   /api/users/logout       # User logout
```

### User Management
```
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
PATCH  /api/users/edit         # Edit user profile
POST   /api/users/avatar       # Upload user avatar
POST   /api/users/:id/follow   # Follow/unfollow user
GET    /api/users/:id/posts    # Get user's posts
```

### Posts
```
GET    /api/posts              # Get all posts
GET    /api/posts/following    # Get posts from followed users
POST   /api/posts              # Create new post
GET    /api/posts/:id          # Get single post
PATCH  /api/posts/:id          # Update post
DELETE /api/posts/:id          # Delete post
POST   /api/posts/:id/like     # Like/unlike post
POST   /api/posts/:id/bookmark # Bookmark post
```

### Comments
```
POST   /api/comments/:postId        # Add comment to post
GET    /api/comments/:postId        # Get post comments
DELETE /api/comments/:commentId     # Delete comment
POST   /api/comments/:commentId/like # Like comment
```

### Messages
```
POST   /api/messages/:receiverId    # Send message
GET    /api/messages/:receiverId    # Get conversation messages
GET    /api/conversations           # Get all conversations
```

### Bookmarks
```
GET    /api/users/bookmarks        # Get user bookmarks
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```javascript
// Protected route example
const authMiddleware = require('./middleware/authMiddleware')

router.get('/protected-route', authMiddleware, (req, res) => {
  // Access user ID via req.user.id
  res.json({ userId: req.user.id })
})
```

## 📡 Real-time Features

Socket.io handles real-time communication:

```javascript
// Message events
socket.on('sendMessage', (messageData) => {
  // Handle real-time messaging
})

socket.on('joinRoom', (userId) => {
  // Join user-specific room
})
```

## 🗄️ Database Models

### User Model
```javascript
{
  fullName: String,
  email: String,
  password: String,
  profilePhoto: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

### Post Model
```javascript
{
  body: String,
  image: String,
  author: ObjectId,
  likes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId,
  receiver: ObjectId,
  messageBody: String,
  conversationId: ObjectId,
  createdAt: Date
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🌐 Deployment

### Render (Recommended)

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically on push**

### Manual Deployment

```bash
# Install dependencies
npm install --production

# Start server
npm start
```

## 📊 Logging

The API includes comprehensive logging:

```javascript
const logger = require('./utils/logger')

logger.info('Server started successfully')
logger.error('Database connection failed', error)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test user.test.js

# Run tests with coverage
npm run test:coverage
```

## 🔄 Rate Limiting

API endpoints are protected with rate limiting:

- **General endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 👨💻 Author

**Ajewole Joseph Samuel**
- GitHub: [@ajewolesamuel](https://github.com/ajewolesamuel)
- Email: josephsammy1994@gmail.com

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.