import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import logo from '../assets/snapflow.png'; // Ajuste le chemin selon l'emplacement réel du logo

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Nom */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-semibold text-indigo-600"></h1>
          </div>

          {/* Actions (Notifications + Déconnexion) */}
          <div className="flex items-center">
            

            <div className="ml-3 relative">
              <button
                onClick={handleLogout}
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none space-x-2"
              >
                <span className="text-indigo-600 font-medium">Déconnexion</span>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {/* Icône logout SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
