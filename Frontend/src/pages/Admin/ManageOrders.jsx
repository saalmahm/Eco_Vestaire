import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      let url = '/admin/orders';
      const params = new URLSearchParams();
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      
      params.append('page', currentPage);
      params.append('t', new Date().getTime()); // Ajouter un timestamp pour éviter le cache
      
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
      
      // Vérifier si la réponse a la structure attendue
      if (response.data && response.data.data) {
        setOrders(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      } else {
        console.warn('Format de réponse API inattendu:', response.data);
        setOrders([]);
        setTotalPages(1);
      }
      
      setLoading(false);
      setIsSearching(false);
      setError(null); // Effacer les erreurs précédentes
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('Votre session a expiré. Veuillez vous reconnecter.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (err.response.status === 403) {
          setError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
        } else {
          setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
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
        fetchOrders();
      }, 500);
      
      return () => clearTimeout(delaySearch);
    }
  }, [isSearching, searchTerm]);

  useEffect(() => {
    fetchOrders();
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

  const viewItem = (id) => {
    navigate(`/admin/article/${id}`);
  };

  const viewUser = (id) => {
    navigate(`/admin/user/${id}`);
  };

  const viewOrder = (id) => {
    navigate(`/admin/order/${id}`);
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

  const formatPrice = (price) => {
    if (!price) return '0,00 €';
    return parseFloat(price).toFixed(2).replace('.', ',') + ' €';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status || 'Non payé';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/article-placeholder.png";
    return `http://localhost:8000/storage/${imagePath}?t=${new Date().getTime()}`;
  };
  
  const getProfileImageUrl = (user) => {
    if (!user || !user.profile_photo) return "/profile-placeholder.png";
    return `http://localhost:8000/storage/${user.profile_photo}?t=${new Date().getTime()}`;
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
            <h1 className="text-xl font-bold text-gray-900">Gestion des Commandes</h1>
            <p className="text-sm text-gray-600">Suivez toutes les transactions sur la plateforme</p>
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
                placeholder="Rechercher par ID ou article..."
                className="w-full py-2 px-2 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch} />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchOrders();
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
              Toutes
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              En attente
            </button>
            <button
              onClick={() => setStatusFilter('accepted')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Acceptées
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'completed' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Terminées
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
              Annulées
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
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm 
                  ? `Aucune commande trouvée pour "${searchTerm}"` 
                  : "Aucune commande trouvée"}
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium text-gray-900">Commande #{order.id}</div>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusClass(order.payment_status)}`}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </div>
                  </div>
                  
                  {order.item && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="h-14 w-14 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={getImageUrl(order.item.image)}
                          alt={order.item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "/article-placeholder.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div 
                          className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                          onClick={() => viewItem(order.item.id)}
                        >
                          {order.item.title}
                        </div>
                        <p className="text-sm text-gray-500">
                          Prix: {formatPrice(order.amount_paid || order.item.price)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Vendeur</p>
                      {order.seller ? (
                        <div className="flex items-center mt-1 cursor-pointer" onClick={() => viewUser(order.seller.id)}>
                          <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                            <img
                              src={getProfileImageUrl(order.seller)}
                              alt={`${order.seller.first_name} ${order.seller.last_name}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/profile-placeholder.png";
                              }}
                            />
                          </div>
                          <span className="text-sm">{order.seller.first_name} {order.seller.last_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm">Inconnu</span>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Acheteur</p>
                      {order.buyer ? (
                        <div className="flex items-center mt-1 cursor-pointer" onClick={() => viewUser(order.buyer.id)}>
                          <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                            <img
                              src={getProfileImageUrl(order.buyer)}
                              alt={`${order.buyer.first_name} ${order.buyer.last_name}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/profile-placeholder.png";
                              }}
                            />
                          </div>
                          <span className="text-sm">{order.buyer.first_name} {order.buyer.last_name}</span>
                        </div>
                      ) : (
                        <span className="text-sm">Inconnu</span>
                      )}
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
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Article</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Vendeur</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Acheteur</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm 
                          ? `Aucune commande trouvée pour "${searchTerm}"` 
                          : "Aucune commande trouvée"}
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td onClick={() => viewOrder(order.id)}
                         className="px-6 py-4 cursor-pointer whitespace-nowrap text-sm text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.item ? (
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                  src={getImageUrl(order.item.image)}
                                  alt={order.item.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/article-placeholder.png";
                                  }}
                                />
                              </div>
                              <div 
                                className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                                onClick={() => viewItem(order.item.id)}
                              >
                                {order.item.title}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Article supprimé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {formatPrice(order.amount_paid || (order.item && order.item.price))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.seller ? (
                            <div 
                              className="flex items-center cursor-pointer hover:text-green-600"
                              onClick={() => viewUser(order.seller.id)}
                            >
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                <img
                                  src={getProfileImageUrl(order.seller)}
                                  alt={`${order.seller.first_name} ${order.seller.last_name}`}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/profile-placeholder.png";
                                  }}
                                />
                              </div>
                              <div className="text-sm text-gray-900">
                                {order.seller.first_name} {order.seller.last_name}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Inconnu</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.buyer ? (
                            <div 
                              className="flex items-center cursor-pointer hover:text-green-600"
                              onClick={() => viewUser(order.buyer.id)}
                            >
                              <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                <img
                                  src={getProfileImageUrl(order.buyer)}
                                  alt={`${order.buyer.first_name} ${order.buyer.last_name}`}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/profile-placeholder.png";
                                  }}
                                />
                              </div>
                              <div className="text-sm text-gray-900">
                                {order.buyer.first_name} {order.buyer.last_name}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Inconnu</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusClass(order.payment_status)}`}>
                            {getPaymentStatusLabel(order.payment_status)}
                          </span>
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
    </div>
  );
}

export default ManageOrders;