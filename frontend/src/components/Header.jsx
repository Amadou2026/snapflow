// src/components/Header.jsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Snapflow</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
