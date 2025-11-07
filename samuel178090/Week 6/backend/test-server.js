import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Mock data for testing
const mockUsers = [
  { UID: "1", firstName: "John", LastName: "Doe", username: "johndoe", email: "john@example.com", phone: "01234567890", balance: 1000, createdAt: new Date() },
  { UID: "2", firstName: "Jane", LastName: "Smith", username: "janesmith", email: "jane@example.com", phone: "01234567891", balance: 1500, createdAt: new Date() }
]

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Mock auth endpoints
app.post('/auth/login', (req, res) => {
    const { phone, password } = req.body
    if (phone && password) {
        res.json({ userID: "1", token: "mock-jwt-token" })
    } else {
        res.status(400).json({ error: "Invalid credentials" })
    }
})

// Mock user endpoints
app.get('/users', (req, res) => {
    res.json({ items: mockUsers, totalItems: mockUsers.length, currentPage: 0, totalPages: 1 })
})

app.get('/users/id/:id', (req, res) => {
    const user = mockUsers.find(u => u.UID === req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ error: "User not found" })
    }
})

// Mock transaction endpoint
app.post('/transactions/send-money/phone', (req, res) => {
    const { senderId, recipientPhone, amount } = req.body
    if (senderId && recipientPhone && amount) {
        res.json({ message: "Transaction successful", transactionId: "mock-tx-123" })
    } else {
        res.status(400).json({ error: "Invalid transaction data" })
    }
})

app.listen(port, () => {
    console.log(`FlowServe Mock API server running on port ${port}`)
})