#!/bin/bash

# Secure Task Management System Setup Script
# This script sets up both the backend and frontend applications

set -e

echo "🚀 Setting up Secure Task Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js (v16 or higher) first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if MongoDB is running
check_mongodb() {
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed. Please install MongoDB first."
        print_warning "You can install it using:"
        print_warning "  - Ubuntu/Debian: sudo apt-get install mongodb"
        print_warning "  - macOS: brew install mongodb-community"
        print_warning "  - Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
        return 1
    fi
    
    # Check if MongoDB is running
    if ! pgrep -x "mongod" > /dev/null; then
        print_warning "MongoDB is not running. Please start MongoDB first."
        print_warning "You can start it using:"
        print_warning "  - sudo systemctl start mongod"
        print_warning "  - Or brew services start mongodb-community"
        return 1
    fi
    
    print_success "MongoDB is running"
    return 0
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd "Brave-Bedemptive-Week-3-Backend"
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file..."
        cp env.example .env
        print_warning "Please update the .env file with your configuration"
    fi
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd "Brave-Bedemptive-Week-3-Frontend"
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    print_success "Frontend setup completed"
    cd ..
}

# Main setup function
main() {
    echo "=========================================="
    echo "🔒 Secure Task Management System Setup"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_nodejs
    
    # Check MongoDB (optional, will show warning if not available)
    if ! check_mongodb; then
        print_warning "MongoDB check failed, but setup will continue"
    fi
    
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    # Final instructions
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. 📝 Update backend configuration:"
    echo "   - Edit Brave-Bedemptive-Week-3-Backend/.env"
    echo "   - Set your MongoDB URI and JWT secrets"
    echo ""
    echo "2. 🚀 Start the backend server:"
    echo "   cd Brave-Bedemptive-Week-3-Backend"
    echo "   npm run dev"
    echo ""
    echo "3. 🎨 Start the frontend development server:"
    echo "   cd Brave-Bedemptive-Week-3-Frontend"
    echo "   npm run dev"
    echo ""
    echo "4. 🌐 Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo ""
    echo "📚 For detailed setup instructions, see the README files:"
    echo "   - Backend: Brave-Bedemptive-Week-3-Backend/README.md"
    echo "   - Frontend: Brave-Bedemptive-Week-3-Frontend/README.md"
    echo ""
    echo "🔐 Security features implemented:"
    echo "   - JWT authentication with token rotation"
    echo "   - Role-based access control (RBAC)"
    echo "   - Input validation and sanitization"
    echo "   - Account lockout protection"
    echo "   - Secure token storage (memory-based)"
    echo "   - OWASP vulnerability mitigation"
    echo ""
    print_success "Happy coding! 🎉"
}

# Run main function
main "$@"
