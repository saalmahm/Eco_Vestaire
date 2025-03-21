import React from "react";
import { useNavigate } from 'react-router-dom';

function NavbarVis() {
  const navigate = useNavigate();

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
          <img src="/logo.png" alt="Icon 1" className="h-6 w-6" />
          <span className="text-emerald-600 font-bold">EcoVestaire</span>
        </div>
        <div className="relative flex-1 mx-4 flex justify-center">
          <div className="relative w-[800px]">
            <input
              type="text"
              placeholder="Recherchez des articles ou des vendeur..."
              className="w-full h-[42px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-[#059669] cursor-pointer font-semibold" onClick={goToLogin}>Se Connecter</button>
          <button className="text-sm text-white bg-[#059669] px-4 py-2 rounded-md cursor-pointer font-semibold" onClick={goToSignup}>S'inscrire</button>
        </div>
      </div>
    </header>
  );
}

export default NavbarVis;