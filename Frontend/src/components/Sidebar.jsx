import React, { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`fixed top-4 left-4 bg-green-800 text-white p-2 rounded-full z-50 transition-opacity ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        } md:hidden`}
        onClick={() => setIsOpen(true)}
      >
        <img src="/menu.png" alt="Menu" className="h-6 w-6" />
      </button>

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-green-800 text-white flex flex-col overflow-auto transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 border-b border-green-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img
                src="/shopping-bag.png"
                alt="Logo EcoVestiaire"
                className="h-8 w-8"
              />
            </div>
            <span className="font-medium">EcoVestiaire</span>
          </div>

          <button
            className="md:hidden bg-green-600 p-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <img src="/close.png" alt="Fermer" className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 flex-1">
          <ul className="space-y-4">
            <li>
              <a
                href="dashboard"
                className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              >
                <img src="/bar-chart.png" alt="Statistiques" className="h-5 w-6" />
                <span>Statistiques</span>
              </a>
            </li>
            <li>
              <a
                href="/manage-users"
                className="flex items-center gap-3 p-2 rounded bg-green-700 transition-colors"
              >
                <img src="/users.png" alt="Gestion Utilisateurs" className="h-5 w-6" />
                <span>Gestion Utilisateurs</span>
              </a>
            </li>
            <li>
              <a
                href="manage-articles"
                className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              >
                <img src="/shopping-bags.png" alt="Gestion Articles" className="h-5 w-6" />
                <span>Gestion Articles</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              >
                <img src="/message-squares.png" alt="Gestion Commentaires" className="h-5 w-6" />
                <span>Gestion Commentaires</span>
              </a>
            </li>
            <li>
              <a
                href="manage-categorie"
                className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              >
                <img src="/grid.png" alt="Gestion Catégories" className="h-5 w-6" />
                <span>Gestion Catégories</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
