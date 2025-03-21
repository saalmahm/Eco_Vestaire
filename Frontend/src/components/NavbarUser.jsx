import React from "react";

function NavbarUser(){
  return (
    <header className="bg-white py-3 pl-8 pr-8 border-b border-emerald-100">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Icon 1" className="h-6 w-6" />
          <span className="text-emerald-600 font-medium">EcoVestaire</span>
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
          <button className="text-sm text-gray-600">
            <img src="/panier.png" alt="Icon 4" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-full flex items-center justify-center">
              <img src="/notification-icon.png" alt="Icon 3" className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 rounded-full flex items-center justify-center">
              <img src="/profile.png" alt="Icon 4" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
export default NavbarUser;