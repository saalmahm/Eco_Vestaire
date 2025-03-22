import React from 'react';
import Sidebar from '../../components/Sidebar';

function ManageUsers ()  {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar /> 

      <div className="flex-1 overflow-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-600 font-semibold">Manage all users</p>
        </div>

        <div className="p-6">
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img
                          src="/profile.png"
                          alt="Sophie Martin"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sophie Martin</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sophie.m@exemple.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Jan 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Actif
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

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img
                          src="/seller-avatar.png"
                          alt="Lucas Dubois"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Lucas Dubois</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">lucas.d@exemple.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 Jan 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Suspendu
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
