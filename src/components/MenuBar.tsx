// MenuBar.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Use Link if you're using React Router
import { Flex, Text, Button } from '@radix-ui/themes';

const MenuBar = ({ isLoggedIn, username }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex justify-between items-center w-full p-4">
      <div className="flex items-center space-x-4">
        <div className="group relative"></div>
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          // Display Account Menu when logged in
          <div className="group relative" ref={accountMenuRef}>
            <Button
              onClick={toggleAccountMenu}
              className="text-white group-hover:text-gray-300 focus:outline-none"
            >
              {username}'s Account
            </Button>
            {/* Account Dropdown Content */}
            {isAccountMenuOpen && (
              <div className="absolute bg-gray-700 p-2 mt-2">
                {/* Dropdown items go here */}
                <div className="text-white">Profile</div>
                <div className="text-white">Logout</div>
              </div>
            )}
          </div>
        ) : (
          // Display Login button when not logged in
          <Button className="text-white hover:text-gray-300">Login</Button>
        )}
      </div>
    </nav>
  );
};

export default MenuBar;
