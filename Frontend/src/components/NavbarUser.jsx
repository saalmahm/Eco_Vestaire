import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const profilePopupRef = useRef(null);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Fermer la popup 
  useEffect(() => {
    function handleClickOutside(event) {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        setProfilePopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setProfilePopupOpen(false);
    navigate('/');
  };

  const toggleProfilePopup = () => {
    setProfilePopupOpen(!profilePopupOpen);
  };

  const handleSalesHistory = () => {
    navigate('/sales-history');
    setProfilePopupOpen(false);
  };

  const handlePurchaseHistory = () => {
    navigate('/purchase-history');
    setProfilePopupOpen(false);
  };

  return (
    <header className="bg-white py-3 pl-8 pr-8 border-b border-emerald-100 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          <span className="text-emerald-600 font-bold">EcoVestaire</span>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-emerald-600 focus:outline-none">
            <img src={menuOpen ? "/close.png" : "/menu.png"} alt="Menu" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative w-[800px]">
            <input
              type="text"
              placeholder="Recherchez des articles ou des vendeurs..."
              className="w-full h-[42px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          </div>

          {isLoggedIn ? (
            <>
              <button className="text-sm text-gray-600">
                <img src="/panier.png" alt="Panier Icon" className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 relative">
                <button className="h-10 w-10 rounded-full flex items-center justify-center">
                  <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5" />
                </button>
                <button 
                  className="h-10 w-10 rounded-full flex items-center justify-center relative"
                  onClick={toggleProfilePopup}
                >
                  <img src="/profile.png" alt="Profile Icon" className="h-5 w-5" />
                </button>
                
                {/* Profile Popup */}
                {profilePopupOpen && (
                  <div 
                    ref={profilePopupRef}
                    className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-2 w-48 border border-gray-200 z-50"
                  >
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={handleSalesHistory}
                    >
                      Sales History
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={handlePurchaseHistory}
                    >
                      Purchase History
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button 
                className="text-sm text-[#059669] cursor-pointer font-semibold" 
                onClick={handleLogin}
              >
                Se Connecter
              </button>
              <button 
                className="text-sm text-white bg-[#059669] px-4 py-2 rounded-md cursor-pointer font-semibold" 
                onClick={handleSignup}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-white shadow-lg rounded-lg p-4 w-64 flex flex-col items-center gap-3">
          <div className="relative w-full px-4">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-[38px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          </div>

          {isLoggedIn ? (
            <>
              <button className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2">
                <img src="/panier.png" alt="Panier Icon" className="h-5 w-5" />
                Panier
              </button>
              <button className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2">
                <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5" />
                Notifications
              </button>
              <button 
                className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2"
                onClick={toggleProfilePopup}
              >
                <img src="/profile.png" alt="Profile Icon" className="h-5 w-5" />
                Profil
              </button>
              
              {/* Mobile Profile Popup */}
              {profilePopupOpen && (
                <div className="w-full bg-gray-50 rounded-md p-2">
                  <button 
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={handleSalesHistory}
                  >
                    Sales History
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={handlePurchaseHistory}
                  >
                    Purchase History
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button 
                className="text-sm text-[#059669] font-semibold w-full py-2 border border-[#059669] rounded-md"
                onClick={handleLogin}
              >
                Se Connecter
              </button>
              <button 
                className="text-sm text-white bg-[#059669] w-full py-2 rounded-md font-semibold"
                onClick={handleSignup}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;