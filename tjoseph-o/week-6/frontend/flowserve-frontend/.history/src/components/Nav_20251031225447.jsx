import React from 'react'

export default function Nav({ route, setRoute }) {
  return (
    <nav className="nav">
      <div className="logo">FlowServe</div>
      <div className="links">
        <button className={route === 'users' ? 'active' : ''} onClick={() => setRoute('users')}>Users</button>
        <button className={route === 'transactions' ? 'active' : ''} onClick={() => setRoute('transactions')}>Transactions</button>
      </div>
    </nav>
  )
}
