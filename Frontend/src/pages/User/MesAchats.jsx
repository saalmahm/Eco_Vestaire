import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function MesAchats() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [showCancelModal, setShowCancelModal] = useState(false); 
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axiosInstance.get('/profile/purchases', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Orders response:", response.data);

            let ordersData = [];

            if (response.data && response.data.data && response.data.data.data) {
                ordersData = response.data.data.data;
            } else if (response.data && response.data.data) {
                ordersData = response.data.data;
            } else if (response.data) {
                ordersData = response.data;
            }

            // S'assurer que ordersData est un tableau
            if (!Array.isArray(ordersData)) {
                console.warn("Les données de commandes ne sont pas dans un format attendu", response.data);
                ordersData = [];
            }

            setOrders(ordersData);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des commandes:", err);
            setError("Une erreur est survenue lors du chargement de vos commandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [navigate]);

    const handleCancelOrder = async () => {
        if (!orderToCancel) return;

        try {
            setCancelLoading(true);
            const token = localStorage.getItem('authToken');
            
            const response = await axiosInstance.post(`/orders/${orderToCancel.id}/cancel`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Mettre à jour l'état local pour refléter le changement
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderToCancel.id 
                            ? { ...order, status: 'cancelled' } 
                            : order
                    )
                );
                
                // Fermer la modale
                setShowCancelModal(false);
                setOrderToCancel(null);
                
                // Optionnel: rafraîchir la liste pour avoir toutes les données à jour
                fetchOrders();
            }
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error);
            setError("Impossible d'annuler cette commande. Veuillez réessayer.");
        } finally {
            setCancelLoading(false);
        }
    };

    const openCancelModal = (order) => {
        setOrderToCancel(order);
        setShowCancelModal(true);
    };

    const handleProceedToPayment = (orderId) => {
        navigate(`/payment/${orderId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const getPendingOrders = () => {
        return orders.filter(order => order.status === 'accepted' && order.payment_status !== 'paid');
    };

    const getCompletedOrders = () => {
        return orders.filter(order =>
            order.payment_status === 'paid' ||
            order.status === 'completed' ||
            order.status === 'shipped'
        );
    };

    const getCancelledOrders = () => {
        return orders.filter(order =>
            order.status === 'cancelled' ||
            order.status === 'declined'
        );
    };

    const getWaitingOrders = () => {
        return orders.filter(order => order.status === 'pending');
    };

    const getStatusBadge = (order) => {
        if (order.status === 'pending') {
            return (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                    En attente
                </span>
            );
        } else if (order.status === 'accepted' && order.payment_status !== 'paid') {
            return (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    À payer
                </span>
            );
        } else if (order.payment_status === 'paid' && order.status !== 'completed') {
            return (
                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    Payé
                </span>
            );
        } else if (order.status === 'completed') {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    Complété
                </span>
            );
        } else if (order.status === 'cancelled') {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Annulé
                </span>
            );
        } else if (order.status === 'declined') {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Refusé
                </span>
            );
        }
        return null;
    };

    const renderOrderList = (ordersList) => {
        if (ordersList.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-600">Aucune commande dans cette catégorie.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {ordersList.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="font-medium">Commande #{order.id}</div>
                                <div className="text-sm text-gray-500">
                                    Commandé le {formatDate(order.ordered_at)}
                                </div>
                            </div>
                            {getStatusBadge(order)}
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                    src={order.item?.image ?
                                        `http://localhost:8000/storage/${order.item.image}` :
                                        '/placeholder-item.png'}
                                    alt={order.item?.title || "Article"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-item.png';
                                    }}
                                />
                            </div>
                            <div>
                                <div className="font-medium">{order.item?.title}</div>
                                <div className="text-green-600 font-medium">{order.item?.price} USD</div>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="text-sm mr-4">
                                <span className="text-gray-500">Vendeur: </span>
                                <span className="font-medium">
                                    {order.seller?.first_name} {order.seller?.last_name}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            {order.status === 'pending' && (
                                <button
                                    onClick={() => openCancelModal(order)}
                                    className="border border-red-500 text-red-500 hover:bg-red-50 py-2 px-4 rounded transition-colors"
                                >
                                    Annuler la commande
                                </button>
                            )}
                            
                            {order.status === 'accepted' && order.payment_status !== 'paid' && (
                                <button
                                    onClick={() => handleProceedToPayment(order.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                                >
                                    Procéder au paiement
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <NavbarUser />

            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">Mes Achats</h1>
                        <p className="text-gray-600">Gérez vos commandes et suivez vos achats</p>
                    </div>

                    <div className="flex border-b border-gray-300 mb-6">
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'pending'
                                    ? 'text-green-500 border-green-500'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('pending')}
                        >
                            À payer ({loading ? 0 : getPendingOrders().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'waiting'
                                    ? 'text-green-500 border-green-500'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('waiting')}
                        >
                            En attente ({loading ? 0 : getWaitingOrders().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'completed'
                                    ? 'text-green-500 border-green-500'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Complétés ({loading ? 0 : getCompletedOrders().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'cancelled'
                                    ? 'text-green-500 border-green-500'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            Annulés ({loading ? 0 : getCancelledOrders().length})
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                                    {error}
                                </div>
                            )}

                            {activeTab === 'pending' && renderOrderList(getPendingOrders())}
                            {activeTab === 'waiting' && renderOrderList(getWaitingOrders())}
                            {activeTab === 'completed' && renderOrderList(getCompletedOrders())}
                            {activeTab === 'cancelled' && renderOrderList(getCancelledOrders())}
                        </>
                    )}
                </div>
            </div>

            {/* Modale de confirmation d'annulation */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Confirmer l'annulation</h3>
                        <p className="mb-6">
                            Êtes-vous sûr de vouloir annuler cette commande ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={cancelLoading}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Traitement...
                                    </span>
                                ) : "Confirmer l'annulation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MesAchats;