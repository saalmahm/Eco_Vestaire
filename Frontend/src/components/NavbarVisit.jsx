import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function NavbarVis() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <header className="bg-white py-3 pl-8 pr-8 border-b border-emerald-100">
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
          <button className="text-sm text-[#059669] cursor-pointer font-semibold" onClick={goToLogin}>Se Connecter</button>
          <button className="text-sm text-white bg-[#059669] px-4 py-2 rounded-md cursor-pointer font-semibold" onClick={goToSignup}>S'inscrire</button>
        </div>
      </div>

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
          <button className="text-sm text-[#059669] font-semibold w-full py-2 border border-[#059669] rounded-md" onClick={goToLogin}>Se Connecter</button>
          <button className="text-sm text-white bg-[#059669] w-full py-2 rounded-md font-semibold" onClick={goToSignup}>S'inscrire</button>
        </div>
      )}
    </header>
  );
}

export default NavbarVis;