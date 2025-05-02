import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let url = '/admin/users';
      const params = new URLSearchParams();
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      params.append('page', currentPage);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentification requise.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axiosInstance.get(url, config);
      
      setUsers(response.data.data.data);
      setTotalPages(Math.ceil(response.data.data.total / response.data.data.per_page));
      setLoading(false);
      setIsSearching(false);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Impossible de charger les utilisateurs. Veuillez réessayer plus tard.');
      setLoading(false);
      setIsSearching(false);
      
      if (err.response && err.response.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  useEffect(() => {
    if (isSearching) {
      const delaySearch = setTimeout(() => {
        fetchUsers();
      }, 500);  
      
      return () => clearTimeout(delaySearch);
    }
  }, [isSearching, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const resetFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.put(`/admin/users/${userId}/status`, 
        { status: newStatus },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut. Veuillez réessayer.');
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/admin/users/${userToDelete.id}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      setError('Impossible de supprimer l\'utilisateur. Veuillez réessayer.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const getProfileImageUrl = (user) => {
    if (!user) return '/profile.png';
    
    if (user.profile_photo) {
      return `http://localhost:8000/storage/${user.profile_photo}`;
    }
    
    return '/profile.png';
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 p-4">
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 ml-0 md:ml-64 overflow-auto transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-2 left-2 z-30 text-gray-800 focus:outline-none p-2 bg-white rounded-md shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 ml-16 md:ml-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-sm text-gray-600">Gérer tous les utilisateurs</p>
          </div>

          <div className="mt-4 relative">
            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
              <div className="pl-4 pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un utilisateur par nom..."
                className="w-full py-2 px-2 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch} />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchUsers();
                  }}
                  className="pr-4 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === '' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Tous
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Actifs
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              En attente
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Suspendus
            </button>
            
            {(statusFilter || searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Réinitialiser
              </button>
            )}
          </div>

          <div className="md:hidden flex flex-col gap-6 mt-6">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm 
                  ? `Aucun utilisateur trouvé pour "${searchTerm}"` 
                  : "Aucun utilisateur trouvé"}
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col items-start">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img 
                          src={getProfileImageUrl(user)} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/profile.png";
                          }} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">{user.name}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Inscrit le {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status === 'active' 
                        ? 'Actif' 
                        : user.status === 'pending' 
                          ? 'En attente' 
                          : 'Suspendu'
                      }
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <p>Articles: {user.items_count}</p>
                    <p>Ventes: {user.selling_orders_count}</p>
                    <p>Achats: {user.buying_orders_count}</p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3 w-full justify-end">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => updateUserStatus(user.id, 'suspended')}
                        className="px-4 py-2 text-sm font-semibold rounded-md border bg-white text-red-600 border-red-600">
                        Suspendre
                      </button>
                    ) : user.status === 'suspended' ? (
                      <button
                        onClick={() => updateUserStatus(user.id, 'active')}
                        className="px-4 py-2 text-sm font-semibold rounded-md border bg-white text-green-600 border-green-600">
                        Réactiver
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="px-4 py-2 text-sm font-semibold rounded-md border bg-white text-green-600 border-green-600">
                          Approuver
                        </button>
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="px-4 py-2 text-sm font-semibold rounded-md border bg-white text-red-600 border-red-600">
                          Refuser
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="px-4 py-2 text-sm font-semibold rounded-md border bg-white text-gray-700 border-gray-300">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="hidden md:block overflow-x-auto mt-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Email</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Articles</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Ventes/Achats</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date d'inscription</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm 
                          ? `Aucun utilisateur trouvé pour "${searchTerm}"` 
                          : "Aucun utilisateur trouvé"}
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
                              <img
                                src={getProfileImageUrl(user)}
                                alt={user.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/profile.png";
                                }} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.items_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.selling_orders_count} / {user.buying_orders_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : user.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                            {user.status === 'active' 
                              ? 'Actif' 
                              : user.status === 'pending' 
                                ? 'En attente' 
                                : 'Suspendu'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            {user.status === 'active' ? (
                              <button 
                                onClick={() => updateUserStatus(user.id, 'suspended')}
                                className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                                title="Suspendre">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            ) : user.status === 'suspended' ? (
                              <button 
                                onClick={() => updateUserStatus(user.id, 'active')}
                                className="text-green-400 hover:text-green-600 cursor-pointer p-1"
                                title="Réactiver">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => updateUserStatus(user.id, 'active')}
                                  className="text-green-400 hover:text-green-600 cursor-pointer p-1"
                                  title="Approuver">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => updateUserStatus(user.id, 'suspended')}
                                  className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                                  title="Refuser">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            <button 
                              onClick={() => openDeleteModal(user)}
                              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                              title="Supprimer">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}>
                  Précédent
                </button>
                
                {[...Array(totalPages).keys()].map(page => (
                  <button
                    key={page + 1}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page + 1
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}>
                    {page + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}>
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{userToDelete?.name}</span> ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={deleteLoading}>
                Annuler
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={deleteLoading}>
                {deleteLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;