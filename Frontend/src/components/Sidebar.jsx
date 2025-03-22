import React from 'react';

function Sidebar() {
  return (
    <div className="w-64 h-screen flex flex-col bg-green-800 text-white overflow-auto">
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <img
              src="/shopping-bag.png"
              alt="Logo EcoVestiaire"
              className="h-8 w-8 text-green-800"
            />
          </div>
          <span className="font-medium">EcoVestiaire</span>
        </div>
      </div>

      <nav className="p-4 flex-1">
        <ul className="space-y-4">
          <li>
            <a href="dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors">
              <img src="/bar-chart.png" alt="Statistiques" className="h-5 w-6" />
              <span>Statistiques</span>
            </a>
          </li>
          <li>
            <a href="/manage-users" className="flex items-center gap-3 p-2 rounded bg-green-700 transition-colors">
              <img src="/users.png" alt="Gestion Utilisateurs" className="h-5 w-6" />
              <span>Gestion Utilisateurs</span>
            </a>
          </li>
          <li>
            <a href="manage-articles" className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors">
              <img src="/shopping-bags.png" alt="Gestion Articles" className="h-5 w-6" />
              <span>Gestion Articles</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors">
              <img src="/message-squares.png" alt="Gestion Commentaires" className="h-5 w-6" />
              <span>Gestion Commentaires</span>
            </a>
          </li>
          <li>
            <a href="manage-categorie" className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition-colors">
              <img src="/grid.png" alt="Gestion Catégories" className="h-5 w-6" />
              <span>Gestion Catégories</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
