# 🎨 Secure Task Manager - Frontend

A modern, secure Next.js frontend application with JWT authentication, role-based UI elements, and secure token management.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Secure Token Storage Strategy](#secure-token-storage-strategy)
- [Application Structure](#application-structure)
- [Pages Overview](#pages-overview)
- [Security Considerations](#security-considerations)

---

## ✨ Features

### Authentication
- ✅ User registration with client-side validation
- ✅ Secure login with JWT tokens
- ✅ Token refresh mechanism
- ✅ Automatic logout on token expiration
- ✅ Secure token storage (sessionStorage)

### Task Management
- ✅ Create tasks with title, description, and status
- ✅ View all tasks (role-based filtering)
- ✅ Delete tasks (Admin only - button hidden for regular users)
- ✅ Status indicators (Pending, In Progress, Completed)
- ✅ Real-time task updates

### User Experience
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Protected routes
- ✅ Role-based UI elements

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (ES6+) |
| Styling | CSS Modules |
| State Management | React Context API |
| HTTP Client | Fetch API |
| Authentication | JWT (sessionStorage) |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Tjoseph-O/task-management-frontend.git
cd task-man-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open the application:**
```
http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 🔐 Secure Token Storage Strategy

### The Problem: XSS Vulnerability with localStorage

**Why NOT localStorage:**
- ❌ Accessible by any JavaScript code on the page
- ❌ Vulnerable to XSS (Cross-Site Scripting) attacks
- ❌ Persists across browser sessions
- ❌ Can be accessed by third-party scripts

```javascript
// ❌ INSECURE - DO NOT USE
localStorage.setItem('accessToken', token);
```

### Our Solution: sessionStorage + Memory

We use a **hybrid approach** combining React state (memory) and sessionStorage:

```javascript



const [accessToken, setAccessToken] = useState(null);


sessionStorage.setItem('accessToken', token);
```

### Why This Approach?

**Advantages:**
1. **Memory Storage (React State)**
   - ✅ Lost when component unmounts
   - ✅ Not accessible to other scripts
   - ✅ Cleared on page navigation

2. **sessionStorage Backup**
   - ✅ Survives page refreshes
   - ✅ Automatically cleared when browser closes
   - ✅ Not accessible across tabs
   - ✅ Reduced XSS attack surface vs localStorage

3. **Security Benefits**
   - ✅ Tokens don't persist indefinitely
   - ✅ Automatic cleanup on browser close
   - ✅ Limited exposure window
   - ✅ No cross-tab access

### Token Flow

```
1. User Login
   ↓
2. Receive Access Token + Refresh Token
   ↓
3. Store in:
   - React State (primary)
   - sessionStorage (backup for refresh)
   ↓
4. Include Access Token in API requests
   ↓
5. On Page Refresh:
   - Read from sessionStorage
   - Restore to React State
   ↓
6. On Browser Close:
   - sessionStorage cleared automatically
   - User must re-login
   ↓
7. On Logout:
   - Clear React State
   - Clear sessionStorage
   - Blacklist Refresh Token (API call)
```

### Implementation Details

**AuthContext.js:**
```javascript
const login = (userData, tokens) => {
  setUser(userData);
  setAccessToken(tokens.accessToken);
  
  sessionStorage.setItem('user', JSON.stringify(userData));
  sessionStorage.setItem('accessToken', tokens.accessToken);
  sessionStorage.setItem('refreshToken', tokens.refreshToken);
};

const logout = async () => {
  setUser(null);
  setAccessToken(null);
  
 
  sessionStorage.clear();
  

  await api.logout(refreshToken);
};


useEffect(() => {
  const storedUser = sessionStorage.getItem('user');
  const storedToken = sessionStorage.getItem('accessToken');
  
  if (storedUser && storedToken) {
    setUser(JSON.parse(storedUser));
    setAccessToken(storedToken);
  }
}, []);
```

### Future Enhancement: HttpOnly Cookies

**Best Practice (Recommended for Production):**

```javascript
res.cookie('accessToken', token, {
  httpOnly: true,  
  secure: true,    
  sameSite: 'strict',
  maxAge: 30 * 60 * 1000  
});


```

**Benefits:**
- ✅ Completely inaccessible to JavaScript (XSS-proof)
- ✅ Automatic inclusion in requests
- ✅ No client-side token management
- ✅ Most secure option

---

