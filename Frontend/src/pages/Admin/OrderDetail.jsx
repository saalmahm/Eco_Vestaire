import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vérification de l'auth
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentification requise. Veuillez vous connecter.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        fetchOrderDetails();
    }, [id, navigate]);


    const fetchOrderDetails = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
                setLoading(false);
                return;
            }

            const response = await axiosInstance.get(`/admin/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data && response.data.data) {
                setOrder(response.data.data);
            } else {
                setError('Format de réponse inattendu.');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching order details:', err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Votre session a expiré. Veuillez vous reconnecter.');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (err.response.status === 404) {
                    setError('Cette commande n\'existe pas.');
                } else {
                    setError('Erreur lors du chargement des détails de la commande.');
                }
            } else if (err.request) {
                setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
            } else {
                setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
            }

            setLoading(false);
        }
    };

    const viewItem = (id) => {
        navigate(`/admin/article/${id}`);
    };

    const viewUser = (id) => {
        navigate(`/admin/user/${id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
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
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => navigate('/admin/gestion-commandes')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Retour à la liste des commandes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 ml-16 md:ml-64 p-4">
                    <div className="text-center mt-8">
                        <p>Commande non trouvée</p>
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
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Détails de la Commande #{order.id}</h1>
                            <p className="text-sm text-gray-600">
                                Créée le {formatDate(order.created_at)}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/gestion-commandes')}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                            Retour à la liste
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informations générales */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Informations de la commande</h2>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <span className={`px-3 py-1 text-sm rounded-full ${getPaymentStatusClass(order.payment_status)}`}>
                                            {getPaymentStatusLabel(order.payment_status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">ID de la commande</h3>
                                        <p className="text-gray-900">{order.id}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Date de création</h3>
                                        <p className="text-gray-900">{formatDate(order.created_at)}</p>
                                    </div>
                                    {order.accepted_at && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Date d'acceptation</h3>
                                            <p className="text-gray-900">{formatDate(order.accepted_at)}</p>
                                        </div>
                                    )}
                                    {order.completed_at && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Date de finalisation</h3>
                                            <p className="text-gray-900">{formatDate(order.completed_at)}</p>
                                        </div>
                                    )}
                                    {order.cancelled_at && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Date d'annulation</h3>
                                            <p className="text-gray-900">{formatDate(order.cancelled_at)}</p>
                                        </div>
                                    )}
                                    {order.payment_date && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Date de paiement</h3>
                                            <p className="text-gray-900">{formatDate(order.payment_date)}</p>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Montant</h3>
                                        <p className="text-gray-900 font-medium">
                                            {formatPrice(order.amount_paid || (order.item && order.item.price))}
                                        </p>
                                    </div>
                                    {order.payment_method && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">Méthode de paiement</h3>
                                            <p className="text-gray-900">{order.payment_method}</p>
                                        </div>
                                    )}
                                    {order.transaction_id && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-2">ID de transaction</h3>
                                            <p className="text-gray-900">{order.transaction_id}</p>
                                        </div>
                                    )}
                                </div>

                                {order.notes && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                                        <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{order.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Article concerné */}
                            {order.item && (
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Article</h2>
                                    <div className="flex items-start gap-4">
                                        <div className="h-24 w-24 bg-gray-100 rounded overflow-hidden">
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
                                            <h3
                                                className="text-lg font-medium text-gray-900 hover:text-green-600 cursor-pointer mb-1"
                                                onClick={() => viewItem(order.item.id)}
                                            >
                                                {order.item.title}
                                            </h3>
                                            <p className="text-gray-500 mb-2">
                                                {order.item.category ? order.item.category.name : 'Sans catégorie'} •
                                                Condition: {
                                                    order.item.condition === 'new' ? 'Neuf' :
                                                        order.item.condition === 'like_new' ? 'Comme neuf' :
                                                            order.item.condition === 'good' ? 'Bon état' :
                                                                order.item.condition === 'fair' ? 'État moyen' :
                                                                    order.item.condition === 'poor' ? 'État médiocre' :
                                                                        order.item.condition
                                                }
                                            </p>
                                            <p className="text-gray-700 mb-3">{order.item.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-green-600 font-bold text-lg">
                                                    {formatPrice(order.item.price)}
                                                </span>
                                                <button
                                                    onClick={() => viewItem(order.item.id)}
                                                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                                >
                                                    Voir l'article
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar avec infos utilisateur */}
                        <div className="lg:col-span-1">
                            {/* Vendeur */}
                            {order.seller && (
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Vendeur</h2>
                                    <div className="flex items-center mb-4">
                                        <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
                                            <img
                                                src={getProfileImageUrl(order.seller)}
                                                alt={`${order.seller.first_name} ${order.seller.last_name}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/profile-placeholder.png";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                                                onClick={() => viewUser(order.seller.id)}
                                            >
                                                {order.seller.first_name} {order.seller.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{order.seller.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => viewUser(order.seller.id)}
                                            className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                                        >
                                            Voir le profil
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Acheteur */}
                            {order.buyer && (
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Acheteur</h2>
                                    <div className="flex items-center mb-4">
                                        <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
                                            <img
                                                src={getProfileImageUrl(order.buyer)}
                                                alt={`${order.buyer.first_name} ${order.buyer.last_name}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/profile-placeholder.png";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h3
                                                className="font-medium text-gray-900 hover:text-green-600 cursor-pointer"
                                                onClick={() => viewUser(order.buyer.id)}
                                            >
                                                {order.buyer.first_name} {order.buyer.last_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{order.buyer.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => viewUser(order.buyer.id)}
                                            className="w-full py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                                        >
                                            Voir le profil
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Chronologie des événements */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Chronologie</h2>
                                <div className="relative pl-8 pb-2">
                                    <div className="absolute top-0 left-3 h-full w-px bg-gray-200"></div>

                                    <div className="relative mb-6">
                                        <div className="absolute left-[-28px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium">Commande créée</h3>
                                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    {order.accepted_at && (
                                        <div className="relative mb-6">
                                            <div className="absolute left-[-28px] top-0 h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">Commande acceptée par le vendeur</h3>
                                                <p className="text-xs text-gray-500">{formatDate(order.accepted_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {order.payment_date && (
                                        <div className="relative mb-6">
                                            <div className="absolute left-[-28px] top-0 h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">Paiement effectué</h3>
                                                <p className="text-xs text-gray-500">{formatDate(order.payment_date)}</p>
                                                {order.payment_method && <p className="text-xs text-gray-500">Méthode: {order.payment_method}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {order.completed_at && (
                                        <div className="relative mb-6">
                                            <div className="absolute left-[-28px] top-0 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">Commande finalisée</h3>
                                                <p className="text-xs text-gray-500">{formatDate(order.completed_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {order.cancelled_at && (
                                        <div className="relative mb-6">
                                            <div className="absolute left-[-28px] top-0 h-6 w-6 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium">Commande annulée</h3>
                                                <p className="text-xs text-gray-500">{formatDate(order.cancelled_at)}</p>
                                                {order.cancellation_reason && (
                                                    <p className="text-xs text-gray-700 mt-1">Raison: {order.cancellation_reason}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;