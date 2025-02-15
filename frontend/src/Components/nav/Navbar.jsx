// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import './Navbar.scss'; // Import SCSS for styling
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ username, role, loggedIn ,setLoggedIn}) => {
  const navigate=useNavigate();
  const [isSeller, setIsSeller] = useState(false);      // Track if the user is a seller
  const [isPopoverVisible, setIsPopoverVisible] = useState(false); // Track visibility of popover

  // Check if the user is a seller upon initial render
  useEffect(() => {
    if (role === "seller") {
      setIsSeller(true);
    }
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('Auth');
    setIsSeller(false);
    setIsPopoverVisible(false);
    setLoggedIn(!loggedIn);
    navigate('/');
  };
  
  const togglePopover = () => {
    setIsPopoverVisible(!isPopoverVisible);
  };

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to={'/'}>
          <img src="/images/logo.jpg" alt="Logo" className="logo-image" />
          <span className="website-name">Trendfactory</span>
        </Link>
      </div>

      {/* Right Side of Navbar */}
      <div className="navbar-right">
        {loggedIn ? (
          <>
            
            <h4>{username}</h4>
            {/* Profile Icon & Popover */}
            <div className="profile-containerr">
              <FaUserCircle 
                className="profile-icon" 
                onClick={togglePopover} 
                size={30} 
              />
              {isPopoverVisible && (
                <div className="profile-popover">
                  <Link to={`/profile`}>
                    <button className="popover-btn">Profile</button>
                  </Link>
                  <button className="popover-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* Seller Dashboard Button */}
            {isSeller && (
              <Link to={'/company'}>
                <button className="seller-btn">
                  Seller 
                </button>
              </Link>
            )}

            {/* Cart Icon */}
            <Link to={'/cart'}> {/* Adjust to the correct route for the cart */}
              <FaShoppingCart className="cart-icon" size={30} />
            </Link>
          </>
        ) : (
          <Link to={'/login'}>
            <button className="login-btn">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
