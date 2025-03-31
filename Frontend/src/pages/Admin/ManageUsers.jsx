import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const users = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.m@exemple.com',
    status: 'active',
    image: '/profile.png',
    signupDate: '15 Jan 2023',
  },
  {
    id: 2,
    name: 'Lucas Dubois',
    email: 'lucas.d@exemple.com',
    status: 'suspended',
    image: '/seller-avatar.png',
    signupDate: '10 Jan 2023',
  },
];

function ManageUsers() {
  // State pour gérer l'ouverture/fermeture de la Sidebar sur mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`w-64 bg-white transition-all duration-300 ease-in-out sm:block ${
          sidebarOpen ? 'block' : 'hidden'
        } sm:block`} // Masque la sidebar en mobile (sm:hidden), et l'affiche sur desktop (sm:block)
      >
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
        {/* Bouton d'ouverture de la Sidebar sur mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden text-gray-800 focus:outline-none p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <p className="text-sm sm:text-base text-gray-600 font-semibold">Manage all users</p>

        {/* Affichage sous forme de cartes en mobile */}
        <div className="sm:hidden flex flex-col gap-6 mt-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {user.status === 'active' ? 'Active' : 'Suspendu'}
                </span>
              </div>

              {/* Ligne des boutons */}
              <div className="flex flex-wrap gap-3 mt-3 w-full justify-end">
                <button
                  className={`px-4 py-2 text-sm font-semibold rounded-md border ${
                    user.status === 'active'
                      ? 'bg-white text-green-600 border-green-600'
                      : 'bg-white text-yellow-600 border-yellow-600'
                  }`}
                >
                  {user.status === 'active' ? 'Suspendre' : 'Activer'}
                </button>
                <button className="px-4 py-2 text-sm font-semibold rounded-md border text-red-600 border-red-600 bg-pink-100">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Affichage en tableau sur desktop */}
        <div className="hidden sm:block overflow-x-auto mt-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date d&apos;inscription</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.signupDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <img src="/block.png" alt="block" className="h-5 w-5" />
                        </button>
                        <button className="text-blue-400 hover:text-blue-600 cursor-pointer">
                          <img src="/active.png" alt="activer" className="h-5 w-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 cursor-pointer">
                          <img src="/trashs.png" alt="Supprimer" className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
