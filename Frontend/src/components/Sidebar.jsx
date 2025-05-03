import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      
      localStorage.removeItem('authToken');
      
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen bg-green-800 text-white flex flex-col z-40 w-16 md:w-64 transition-all duration-300">
      {/* Logo - réduit sur mobile, étendu sur desktop */}
      <div className="p-4 border-b border-green-700 flex items-center justify-center md:justify-start">
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <img src="/shopping-bag.png" alt="Logo EcoVestiaire" className="h-8 w-8" />
        </div>
        <span className="font-medium hidden md:block ml-2">EcoVestiaire</span>
      </div>
      
      <nav className="p-2 flex-1">
        <ul className="space-y-4">
          <li>
            <Link 
              to="/admin/dashboard" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Statistiques"
            >
              <img src="/bar-chart.png" alt="Statistiques" className="h-5 w-6" />
              <span className="hidden md:block">Statistiques</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-users" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Utilisateurs"
            >
              <img src="/users.png" alt="Gestion Utilisateurs" className="h-5 w-6" />
              <span className="hidden md:block">Gestion Utilisateurs</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-articles" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Articles"
            >
              <img src="/shopping-bags.png" alt="Gestion Articles" className="h-5 w-6" />
              <span className="hidden md:block">Gestion Articles</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/gestion-commentaires" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Commentaires"
            >
              <img src="/message-squares.png" alt="Gestion Commentaires" className="h-5 w-6" />
              <span className="hidden md:block">Gestion Commentaires</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/gestion-commandes" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Commandes"
            >
              <img src="/shopping-cart.png" alt="Gestion Commandes" className="h-5 w-6" />
              <span className="hidden md:block">Gestion Commandes</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-categorie" 
              className="flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors"
              title="Catégories"
            >
              <img src="/grid.png" alt="Gestion Catégories" className="h-5 w-6" />
              <span className="hidden md:block">Gestion Catégories</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center md:justify-start gap-3 p-2 rounded hover:bg-green-700 transition-colors text-left"
          title="Déconnexion"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          <span className="hidden md:block">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;