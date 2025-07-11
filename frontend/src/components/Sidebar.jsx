import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: '/projets', label: 'Projets', icon: 'M9.75 3v1.5m0 15v1.5m-6-6h1.5m15 0h1.5m-14.4-5.4l1.05 1.05M16.65 16.65l1.05 1.05M3 12a9 9 0 1018 0 9 9 0 10-18 0z' },
    { to: '/axes', label: 'Axes', icon: 'M4 6h16M4 12h16M4 18h16' },
    { to: '/sous-axes', label: 'Sous-Axes', icon: 'M3 7h18M3 12h18M3 17h18' },
    { to: '/tests', label: 'Tests', icon: 'M5 13l4 4L19 7' },
    { to: '/executions', label: 'Exécutions', icon: 'M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/rapports', label: 'Rapports', icon: 'M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z' },
    // { to: '/utilisateurs', label: 'Utilisateurs', icon: 'M5.121 17.804A11.953 11.953 0 0112 15c2.5 0 4.847.765 6.879 2.072M15 10a3 3 0 11-6 0 3 3 0 016 0z' },
    // { to: '/roles', label: 'Rôles', icon: 'M3 7h18M3 12h18M3 17h18' }
  ];

  return (
    <aside className="w-64 min-w-[16rem] bg-white shadow-md h-screen">
      <div className="py-6 px-4">
        <h2 className="text-xl font-bold text-indigo-600"></h2>
      </div>
      <nav className="px-2 space-y-1">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            active={location.pathname === link.to}
          >
            {link.label}
          </SidebarLink>
        ))}
      </nav>
    </aside>
  );
};

const SidebarLink = ({ to, icon, active, children }) => (
  <Link
    to={to}
    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
      active
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
    }`}
  >
    <svg
      className="mr-3 h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
    {children}
  </Link>
);

export default Sidebar;
