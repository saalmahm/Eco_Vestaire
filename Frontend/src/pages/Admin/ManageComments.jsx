import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

function ManageComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Vérification de l'auth
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentification requise. Veuillez vous connecter.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      let url = '/admin/comments';
      const params = new URLSearchParams();
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      params.append('page', currentPage);
      params.append('t', new Date().getTime()); 
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }
      
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.data) {
        setComments(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      } else {
        console.warn('Format de réponse API inattendu:', response.data);
        setComments([]);
        setTotalPages(1);
      }
      
      setLoading(false);
      setIsSearching(false);
      setError(null); 
    } catch (err) {
      console.error('Error fetching comments:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('Votre session a expiré. Veuillez vous reconnecter.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (err.response.status === 403) {
          setError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
        } else {
          setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.');
        }
      } else if (err.request) {
        setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
      } else {
        setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
      
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isSearching) {
      const delaySearch = setTimeout(() => {
        fetchComments();
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [isSearching, searchTerm]);

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
        setDeleteLoading(false);
        setDeleteModal(false);
        return;
      }
      
      await axiosInstance.delete(`/admin/comments/${commentToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDeleteModal(false);
      setCommentToDelete(null);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Impossible de supprimer le commentaire. Veuillez réessayer.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setDeleteModal(true);
  };

  const viewItem = (id) => {
    navigate(`/admin/article/${id}`);
  };

  const viewUser = (id) => {
    navigate(`/admin/user/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // tronquer le texte s'il est trop long
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 
  const getProfileImageUrl = (user) => {
    if (!user) return "/profile-placeholder.png";
    if (user.profile_photo) {
      return `http://localhost:8000/storage/${user.profile_photo}?t=${new Date().getTime()}`;
    }
    return "/profile-placeholder.png";
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
            <h1 className="text-xl font-bold text-gray-900">Gestion des Commentaires</h1>
            <p className="text-sm text-gray-600">Modérez tous les commentaires des utilisateurs</p>
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
                placeholder="Rechercher par contenu du commentaire..."
                className="w-full py-2 px-2 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch} />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchComments();
                  }}
                  className="pr-4 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-6 mt-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm 
                  ? `Aucun commentaire trouvé pour "${searchTerm}"` 
                  : "Aucun commentaire trouvé"}
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="h-10 w-10 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => comment.user && viewUser(comment.user.id)}
                    >
                      <img
                        src={getProfileImageUrl(comment.user)}
                        alt={comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : "Utilisateur"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/profile-placeholder.png";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div 
                            className="font-medium text-gray-900 cursor-pointer hover:underline"
                            onClick={() => comment.user && viewUser(comment.user.id)}
                          >
                            {comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : "Utilisateur inconnu"}
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                        {comment.item && (
                          <div className="flex flex-col items-end">
                            <div 
                              className="text-sm text-blue-600 cursor-pointer hover:underline"
                              onClick={() => viewItem(comment.item.id)}
                            >
                              Article: {truncateText(comment.item.title, 30)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => openDeleteModal(comment)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200">
                          Supprimer
                        </button>
                      </div>
                    </div>
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
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Commentaire</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Article</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm 
                          ? `Aucun commentaire trouvé pour "${searchTerm}"` 
                          : "Aucun commentaire trouvé"}
                      </td>
                    </tr>
                  ) : (
                    comments.map(comment => (
                      <tr key={comment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                              <img
                                src={getProfileImageUrl(comment.user)}
                                alt={comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : "Utilisateur"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/profile-placeholder.png";
                                }}
                              />
                            </div>
                            <div className="cursor-pointer hover:text-green-600" onClick={() => comment.user && viewUser(comment.user.id)}>
                              <div className="font-medium text-gray-900">
                                {comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : "Utilisateur inconnu"}
                              </div>
                              {comment.user && (
                                <div className="text-xs text-gray-500">
                                  ID: {comment.user.id}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md text-sm text-gray-900">
                            {truncateText(comment.comment, 150)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {comment.item ? (
                            <div 
                              className="text-sm text-blue-600 cursor-pointer hover:underline"
                              onClick={() => viewItem(comment.item.id)}
                            >
                              {truncateText(comment.item.title, 30)}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Article supprimé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(comment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => openDeleteModal(comment)}
                            className="text-red-600 hover:text-red-800 font-medium">
                            Supprimer
                          </button>
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

      {/* Modal de confirmation de suppression */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action ne peut pas être annulée.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-sm text-gray-700 italic">
                "{truncateText(commentToDelete?.comment, 200)}"
              </p>
              <p className="text-xs text-gray-500 mt-2">
                - {commentToDelete?.user ? `${commentToDelete.user.first_name} ${commentToDelete.user.last_name}` : "Utilisateur inconnu"}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setCommentToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={deleteLoading}>
                Annuler
              </button>
              <button
                onClick={handleDelete}
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

export default ManageComments;