import React, { useState } from 'react'
import Nav from './components/Nav'
import Users from './pages/Users'
import Transactions from './pages/Transactions'

export default function App() {
  const [route, setRoute] = useState('users')

  return (
    <div className="app">
      <Nav route={route} setRoute={setRoute} />
      <main className="main">
        {route === 'users' && <Users />}
        {route === 'transactions' && <Transactions />}
      </main>
    </div>
  )
}
