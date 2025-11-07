const express = require("express")
const {connect} = require("mongoose")
require("dotenv").config()
const cors = require("cors")

const app = express();

// CORS
app.use(cors({
  credentials: true, 
  origin: ["http://localhost:5173", "http://localhost:5175", "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsers
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit: '10mb'}))

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Import controllers
const { registerUser, loginUser } = require('./controllers/userControllers');

// Routes
app.post('/api/users/register', registerUser);
app.post('/api/users/login', loginUser);

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.code || 500).json({message: error.message || "An unknown error occurred."})
});

connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(5001, () => {
      console.log(`✅ Test server running on port 5001`);
    });
    console.log('MongoDB connected successfully ✅');
  })
  .catch(err => {
    console.log('MongoDB connection failed ❌');
    console.log(err);
  });