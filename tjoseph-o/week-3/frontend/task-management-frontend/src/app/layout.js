import './globals.css'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Secure Task Manager',
  description: 'A secure task management application with JWT authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}