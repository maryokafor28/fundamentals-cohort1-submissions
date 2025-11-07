const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is working!' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Test login endpoint working' });
});

app.listen(5000, () => {
  console.log('Test server running on port 5000');
});