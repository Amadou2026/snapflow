// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-center text-sm text-gray-500 py-4 shadow-inner">
      © {new Date().getFullYear()} Snapflow. Tous droits réservés.
    </footer>
  );
};

export default Footer;
