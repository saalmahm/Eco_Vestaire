import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function SalesHistory() {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
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

            console.log("Sales response:", response.data);

            let salesData = [];

            if (response.data && response.data.data && response.data.data.data) {
                salesData = response.data.data.data;
            } else if (response.data && response.data.data) {
                salesData = response.data.data;
            } else if (response.data) {
                salesData = response.data;
            }

            // S'assurer que salesData est un tableau
            if (!Array.isArray(salesData)) {
                console.warn("Les données de ventes ne sont pas dans un format attendu", response.data);
                salesData = [];
            }

            setSales(salesData);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des ventes:", err);
            setError("Une erreur est survenue lors du chargement de votre historique de ventes.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('authToken');

            await axiosInstance.post(`/orders/${orderId}/complete`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Rafraîchir la liste après l'action
            fetchSales();
        } catch (error) {
            console.error("Erreur lors de la finalisation de la vente:", error);
            setError("Impossible de finaliser cette vente. Veuillez réessayer.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const getPendingSales = () => {
        return sales.filter(sale =>
            sale.status === 'accepted' && sale.payment_status !== 'paid'
        );
    };

    const getPaidSales = () => {
        return sales.filter(sale =>
            sale.payment_status === 'paid' && sale.status !== 'completed'
        );
    };

    const getCompletedSales = () => {
        return sales.filter(sale =>
            sale.status === 'completed'
        );
    };

    const getCancelledSales = () => {
        return sales.filter(sale =>
            sale.status === 'cancelled' || sale.status === 'declined'
        );
    };

    const getStatusBadge = (sale) => {
        if (sale.status === 'pending') {
            return (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                    En attente
                </span>
            );
        } else if (sale.status === 'accepted' && sale.payment_status !== 'paid') {
            return (
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    Accepté
                </span>
            );
        } else if (sale.payment_status === 'paid' && sale.status !== 'completed') {
            return (
                <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    Payé
                </span>
            );
        } else if (sale.status === 'completed') {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    Complété
                </span>
            );
        } else if (sale.status === 'cancelled') {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Annulé
                </span>
            );
        } else if (sale.status === 'declined') {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Refusé
                </span>
            );
        }
        return null;
    };

    const renderSalesList = (salesList) => {
        if (salesList.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-600">Aucune vente dans cette catégorie.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {salesList.map((sale) => (
                    <div key={sale.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="font-medium">Vente #{sale.id}</div>
                                <div className="text-sm text-gray-500">
                                    Commandé le {formatDate(sale.ordered_at)}
                                </div>
                                {sale.paid_at && (
                                    <div className="text-sm text-gray-500">
                                        Payé le {formatDate(sale.paid_at)}
                                    </div>
                                )}
                            </div>
                            {getStatusBadge(sale)}
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                    src={sale.item?.image ?
                                        `http://localhost:8000/storage/${sale.item.image}` :
                                        '/placeholder-item.png'}
                                    alt={sale.item?.title || "Article"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-item.png';
                                    }}
                                />
                            </div>
                            <div>
                                <div className="font-medium">{sale.item?.title}</div>
                                <div className="text-green-600 font-medium">{sale.item?.price} MAD</div>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="text-sm mr-4">
                                <span className="text-gray-500">Acheteur: </span>
                                <span className="font-medium">
                                    {sale.buyer?.first_name} {sale.buyer?.last_name}
                                </span>
                            </div>
                        </div>

                        {sale.payment_status === 'paid' && sale.status !== 'completed' && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleCompleteOrder(sale.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                                >
                                    Finaliser la vente
                                </button>
                            </div>
                        )}
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
                        <h1 className="text-xl font-bold text-gray-900 mb-1">Mes Ventes</h1>
                        <p className="text-gray-600">Gérez vos ventes et suivez leurs statuts</p>
                    </div>

                    <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'pending'
                                ? 'text-green-500 border-green-500'
                                : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('pending')}
                        >
                            En attente de paiement ({loading ? 0 : getPendingSales().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'paid'
                                ? 'text-green-500 border-green-500'
                                : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('paid')}
                        >
                            Payés ({loading ? 0 : getPaidSales().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'completed'
                                ? 'text-green-500 border-green-500'
                                : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Complétés ({loading ? 0 : getCompletedSales().length})
                        </button>
                        <button
                            className={`pb-4 px-6 font-medium border-b-2 transition-colors ${activeTab === 'cancelled'
                                ? 'text-green-500 border-green-500'
                                : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            Annulés ({loading ? 0 : getCancelledSales().length})
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

                            {activeTab === 'pending' && renderSalesList(getPendingSales())}
                            {activeTab === 'paid' && renderSalesList(getPaidSales())}
                            {activeTab === 'completed' && renderSalesList(getCompletedSales())}
                            {activeTab === 'cancelled' && renderSalesList(getCancelledSales())}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default SalesHistory;