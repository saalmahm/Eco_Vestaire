import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function NotificationAchats() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('purchase_requests');

    useEffect(() => {
        fetchSalesOrders();
    }, []);

    const fetchSalesOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axiosInstance.get('/profile/sales', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let ordersData = [];

            if (response.data && response.data.data && response.data.data.data) {
                ordersData = response.data.data.data;
            } else if (response.data && response.data.data) {
                ordersData = response.data.data;
            } else if (response.data) {
                ordersData = response.data;
            }

            if (!Array.isArray(ordersData)) {
                console.warn("Les données de commandes ne sont pas dans un format attendu", response.data);
                ordersData = [];
            }

            setOrders(ordersData);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des commandes:", err);
            setError("Une erreur est survenue lors du chargement des demandes d'achat.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('authToken');

            await axiosInstance.put(`/orders/${orderId}`,
                { status: 'accepted' },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Mettre à jour la liste des commandes
            fetchSalesOrders();
        } catch (err) {
            console.error("Erreur lors de l'acceptation de la commande:", err);
            alert("Une erreur est survenue lors de l'acceptation de la demande.");
        }
    };

    const handleDeclineOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('authToken');

            await axiosInstance.put(`/orders/${orderId}`,
                { status: 'declined' },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            // Mettre a jour la liste des commandes
            fetchSalesOrders();
        } catch (err) {
            console.error("Erreur lors du refus de la commande:", err);
            alert("Une erreur est survenue lors du refus de la demande.");
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return `il y a ${diffMinutes} min`;
        } else if (diffMinutes < 1440) {
            const hours = Math.floor(diffMinutes / 60);
            return `il y a ${hours}h`;
        } else {
            const days = Math.floor(diffMinutes / 1440);
            return `il y a ${days}j`;
        }
    };

    const getPendingOrders = () => {
        return orders.filter(order => order.status === 'pending');
    };

    if (loading) {
        return (
            <>
                <NavbarUser />
                <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-10">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-10">
                <div className="max-w-full mx-auto">
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>

                        <div className="flex border-b border-gray-300 mb-4">
                            <button
                                className={`pb-4 px-6 font-medium border-b-2 ${activeTab === 'purchase_requests'
                                        ? 'text-green-500 border-green-500'
                                        : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                                onClick={() => setActiveTab('purchase_requests')}
                            >
                                Demandes d'achats
                            </button>
                            <button
                                className={`pb-4 px-6 font-medium border-b-2 ${activeTab === 'followers'
                                        ? 'text-green-500 border-green-500'
                                        : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                                onClick={() => navigate('/notifications-abonnes')}
                            >
                                Nouveaux abonnés
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 md:mx-8 mb-4">
                            {error}
                        </div>
                    )}

                    {getPendingOrders().length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm mx-4 md:mx-8">
                            <p className="text-gray-600">Aucune demande d'achat en attente.</p>
                        </div>
                    ) : (
                        getPendingOrders().map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 my-4 mx-4 md:mx-8">
                                <div className="flex items-start mb-4">
                                    <img
                                        src={order.buyer?.profile_photo ?
                                            `http://localhost:8000/storage/${order.buyer.profile_photo}` :
                                            '/profile.png'}
                                        alt={`${order.buyer?.first_name || 'Acheteur'} ${order.buyer?.last_name || ''}`}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/profile.png';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">
                                                    {order.buyer?.first_name || 'Acheteur'} {order.buyer?.last_name || ''}
                                                </div>
                                                <div className="text-sm text-gray-500">souhaite acheter votre article</div>
                                            </div>
                                            <div className="text-sm text-gray-400">{formatTimeAgo(order.ordered_at)}</div>
                                        </div>
                                    </div>
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
                                        <div className="text-green-600 font-medium">{order.item?.price} MAD</div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="w-1/2 bg-[#16A34A] hover:bg-green-600 text-white py-2 rounded transition-colors"
                                        onClick={() => handleAcceptOrder(order.id)}
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        className="w-1/2 border border-red-300 text-red-500 hover:bg-red-50 py-2 rounded transition-colors"
                                        onClick={() => handleDeclineOrder(order.id)}
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default NotificationAchats;