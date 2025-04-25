import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [stats, setStats] = useState({
        users: {
            total: 0,
            active: 0,
            new_today: 0
        },
        items: {
            total: 0,
            sold: 0,
            new_today: 0
        },
        orders: {
            total: 0,
            completed: 0,
            revenue: 0
        },
        popular_categories: []
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Authentification requise.');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
                
                const response = await axiosInstance.get('/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data && response.data.data) {
                    setStats(response.data.data);
                } else {
                    setError('Format de réponse inattendu.');
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement des statistiques:', err);
                setError('Impossible de charger les statistiques.');
                setLoading(false);
                
                if (err.response && err.response.status === 401) {
                    setTimeout(() => navigate('/login'), 2000);
                }
            }
        };
        
        fetchStats();
    }, [navigate]);
    
    // Formater les montants en euros
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
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

                <div className="w-full">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Tableau de Bord</h1>
                        <p className="text-sm text-gray-600">Vue d'ensemble des statistiques</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Utilisateurs Actifs</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.users.active}</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">
                                        {stats.users.new_today} nouveaux aujourd'hui
                                    </div>
                                </div>
                                <img src="/users-icon.png" alt="Utilisateurs Actifs" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Articles Publiés</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.items.total}</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">
                                        {stats.items.new_today} nouveaux aujourd'hui
                                    </div>
                                </div>
                                <img src="/bags-icon.png" alt="Articles Publiés" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Ventes Réalisées</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.items.sold}</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">
                                        {formatCurrency(stats.orders.revenue)} de revenus
                                    </div>
                                </div>
                                <img src="/carts-icon.png" alt="Ventes Réalisées" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Commandes Complètes</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.orders.completed}</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">
                                        Sur un total de {stats.orders.total}
                                    </div>
                                </div>
                                <img src="/comments-icon.png" alt="Commandes" className="h-10 w-10" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Résumé des Utilisateurs</h3>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Total des utilisateurs</span>
                                <span className="font-bold">{stats.users.total}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Utilisateurs actifs</span>
                                <span className="font-bold">{stats.users.active}</span>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <span className="text-gray-600">Nouveaux aujourd'hui</span>
                                <span className="font-bold">{stats.users.new_today}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Résumé des Articles</h3>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Total des articles</span>
                                <span className="font-bold">{stats.items.total}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Articles vendus</span>
                                <span className="font-bold">{stats.items.sold}</span>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <span className="text-gray-600">Taux de conversion</span>
                                <span className="font-bold">
                                    {stats.items.total ? Math.round((stats.items.sold / stats.items.total) * 100) : 0}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Catégories Populaires</h3>
                            {stats.popular_categories && stats.popular_categories.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.popular_categories.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border-b">
                                            <span className="text-gray-600">
                                                {category.name || `Catégorie #${category.category_id}`}
                                            </span>
                                            <span className="font-bold">{category.total} articles</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 text-gray-500">
                                    Aucune donnée disponible
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Résumé des Commandes</h3>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Total des commandes</span>
                                <span className="font-bold">{stats.orders.total}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-gray-600">Commandes complétées</span>
                                <span className="font-bold">{stats.orders.completed}</span>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <span className="text-gray-600">Revenu total</span>
                                <span className="font-bold text-green-600">{formatCurrency(stats.orders.revenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;