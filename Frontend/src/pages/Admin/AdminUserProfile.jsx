import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import Sidebar from '../../components/Sidebar';

function AdminUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Vérification de l'auth
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentification requise. Veuillez vous connecter.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        try {
          const userResponse = await axiosInstance.get(`/users/${id}`, config);
          setUser(userResponse.data.data);
          
          const itemsResponse = await axiosInstance.get(`/items/user/${id}`, config);
          setItems(itemsResponse.data.data || []);
          
          try {
            const ordersResponse = await axiosInstance.get(`/admin/orders?user_id=${id}`, config);
            setOrders(ordersResponse.data.data?.data || []);
          } catch (orderErr) {
            console.log("Error fetching orders:", orderErr);
            setOrders([]);
          }
        } catch (apiErr) {
          console.error("Error using standard API:", apiErr);
          throw apiErr; 
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError('Votre session a expiré. Veuillez vous reconnecter.');
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else if (err.response.status === 403) {
            setError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
          } else if (err.response.status === 405) {
            setError('Problème de configuration API : les routes nécessaires ne sont pas disponibles. Contactez l\'administrateur système.');
            console.error('API route issue (405 Method Not Allowed):', err.response.data?.message);
          } else {
            setError('Impossible de charger les données de l\'utilisateur. Veuillez réessayer plus tard.');
          }
        } else if (err.request) {
          setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
        } else {
          setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
        
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Date inconnue';
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

  const viewItem = (itemId) => {
    navigate(`/admin/article/${itemId}`);
  };

  const viewOrder = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Informations du compte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Nom complet</p>
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Date d'inscription</p>
                <p className="font-medium">{formatDate(user?.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Rôle</p>
                <p className="font-medium capitalize">{user?.role || 'Utilisateur'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Statut</p>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.is_active ? 'Actif' : 'Inactif'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Dernière connexion</p>
                <p className="font-medium">{user?.last_login ? formatDateTime(user.last_login) : 'Jamais connecté'}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Statistiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Abonnés</p>
                  <p className="text-xl font-bold mt-1">{user?.followers_count || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Abonnements</p>
                  <p className="text-xl font-bold mt-1">{user?.following_count || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Articles publiés</p>
                  <p className="text-xl font-bold mt-1">{items.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Commandes</p>
                  <p className="text-xl font-bold mt-1">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'articles':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Articles publiés</h2>
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Cet utilisateur n'a pas encore publié d'articles.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">ID</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Article</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Prix</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">État</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map(item => (
                      <tr key={item.id} onClick={() => viewItem(item.id)} className="cursor-pointer hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                              <img
                                src={item.image ? `http://localhost:8000/storage/${item.image}` : "/placeholder-item.png"}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/placeholder-item.png";
                                }}
                              />
                            </div>
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.condition}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(item.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.is_available ? 'Disponible' : 'Vendu'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Commandes</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Cet utilisateur n'a pas encore effectué ou reçu de commandes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">ID</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Article</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Rôle</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Paiement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id} onClick={() => viewOrder(order.id)} className="cursor-pointer hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.item ? (
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                  src={order.item.image ? `http://localhost:8000/storage/${order.item.image}` : "/placeholder-item.png"}
                                  alt={order.item.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-item.png";
                                  }}
                                />
                              </div>
                              <div className="font-medium text-gray-900">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.seller && order.seller.id === parseInt(id) ? "Vendeur" : "Acheteur"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(order.created_at)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className={`w-64 bg-green-800 text-white transition-all duration-300 ease-in-out sm:block ${
          sidebarOpen ? 'block' : 'hidden'} sm:block`}>
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className={`w-64 bg-green-800 text-white transition-all duration-300 ease-in-out sm:block ${
          sidebarOpen ? 'block' : 'hidden'} sm:block`}>
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className={`w-64 bg-green-800 text-white transition-all duration-300 ease-in-out sm:block ${
          sidebarOpen ? 'block' : 'hidden'} sm:block`}>
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
          <div className="text-center mt-8">
            <p>Utilisateur non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`w-64 bg-green-800 text-white transition-all duration-300 ease-in-out sm:block ${
        sidebarOpen ? 'block' : 'hidden'} sm:block`}>
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden text-gray-800 focus:outline-none p-2">
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Profil Utilisateur</h1>
            <p className="text-sm sm:text-base text-gray-600">Consulter les détails et l'activité de l'utilisateur</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {user.profile_photo ? (
              <img
                src={`http://localhost:8000/storage/${user.profile_photo}`}
                alt={`${user.first_name || ''} ${user.last_name || ''}`}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/profile-placeholder.png";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-600">
                  {user.first_name ? user.first_name.charAt(0) : ''}
                  {user.last_name ? user.last_name.charAt(0) : ''}
                </span>
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-3">
                <h1 className="text-xl font-bold">{user.first_name} {user.last_name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex justify-center sm:justify-start gap-6 mb-4">
                <div className="text-center">
                  <div className="font-bold">{items.length}</div>
                  <div className="text-sm text-gray-500">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{user.followers_count || 0}</div>
                  <div className="text-sm text-gray-500">Abonnés</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{user.following_count || 0}</div>
                  <div className="text-sm text-gray-500">Abonnements</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{orders.length}</div>
                  <div className="text-sm text-gray-500">Commandes</div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Actif' : 'Inactif'}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                  {user.role || 'Utilisateur'}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                  Inscrit le {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Profil
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Articles ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                Commandes ({orders.length})
              </button>
            </nav>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminUserProfile;