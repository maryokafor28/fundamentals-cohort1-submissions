import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import './Header.css';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  cartItemCount: number;
}

const Header = ({ user, onLogout, cartItemCount }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Brave E-commerce</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart size={20} />
            Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </nav>

        <div className="user-section">
          <div className="user-info">
            <UserIcon size={20} />
            <span>{user.username}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
