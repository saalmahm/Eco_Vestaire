import React, { useState } from "react";

function NavbarUser() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white py-3 pl-8 pr-8 border-b border-emerald-100 fixed top-0 left-0 right-0 z-50 w-full mb-12">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Icon 1" className="h-6 w-6" />
          <span className="text-emerald-600 font-medium">EcoVestaire</span>
        </div>

        <div className="relative flex-1 mx-4 flex justify-center hidden md:flex">
          <div className="relative w-[800px]">
            <input
              type="text"
              placeholder="Recherchez des articles ou des vendeurs..."
              className="w-full h-[42px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-emerald-600 focus:outline-none">
            <img src={menuOpen ? "/close.png" : "/menu.png"} alt="Menu" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-gray-600">
            <img src="/panier.png" alt="Panier Icon" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-full flex items-center justify-center">
              <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-full flex items-center justify-center">
              <img src="/profile.png" alt="Profile Icon" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 w-52 flex flex-col items-start gap-3">
          <button className="w-full text-gray-600 flex items-center justify-start py-2">
            <img src="/panier.png" alt="Panier Icon" className="h-5 w-5 mr-2" />
            Notifications
          </button>
          <button className="w-full text-gray-600 flex items-center justify-start py-2">
            <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5 mr-2" />
            Favorit
          </button>
          <button className="w-full text-gray-600 flex items-center justify-start py-2">
            <img src="/profile.png" alt="Profile Icon" className="h-5 w-5 mr-2" />
            Profil
          </button>
        </div>
      )}
    </header>
  );
}

export default NavbarUser;
