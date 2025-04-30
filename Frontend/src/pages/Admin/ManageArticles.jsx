import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';

function ManageArticles() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Vérification de l'authe
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentification requise. Veuillez vous connecter.');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [navigate]);
    const fetchItems = async () => {
        try {
            setLoading(true);

            let url = '/admin/items';
            const params = new URLSearchParams();

            if (statusFilter) {
                params.append('status', statusFilter);
            }

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
                setItems(response.data.data.data || []);
                setTotalPages(response.data.data.last_page || 1);
            } else {
                console.warn('Format de réponse API inattendu:', response.data);
                setItems([]);
                setTotalPages(1);
            }

            setLoading(false);
            setIsSearching(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching items:', err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Votre session a expiré. Veuillez vous reconnecter.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else if (err.response.status === 403) {
                    setError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
                } else {
                    setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
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
                fetchItems();
            }, 500);

            return () => clearTimeout(delaySearch);
        }
    }, [isSearching, searchTerm]);

    useEffect(() => {
        fetchItems();
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

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            setDeleteLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
                setDeleteLoading(false);
                setDeleteModal(false);
                return;
            }

            await axiosInstance.delete(`/admin/items/${itemToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDeleteModal(false);
            setItemToDelete(null);
            fetchItems();
        } catch (err) {
            console.error('Error deleting item:', err);

            if (err.response && err.response.status === 401) {
                setError('Votre session a expiré. Veuillez vous reconnecter.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('Impossible de supprimer l\'article. Veuillez réessayer.');
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const viewItem = (id) => {
        navigate(`/admin/article/${id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStatus = (isSold) => {
        if (isSold) {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Vendu
                </span>
            );
        } else {
            return (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Disponible              
                </span>
            );
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/article-placeholder.png";
        return `http://localhost:8000/storage/${imagePath}?t=${new Date().getTime()}`;
    };

    const getProfileImageUrl = (user) => {
        if (!user) return "/profile-placeholder.png";
        if (user.profile_photo) {
            return `http://localhost:8000/storage/${user.profile_photo}?t=${new Date().getTime()}`;
        }
        return "/profile-placeholder.png";
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className={`w-64 bg-white transition-all duration-300 ease-in-out sm:block ${sidebarOpen ? 'block' : 'hidden'} sm:block`}>
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

                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Gestion des Articles</h1>
                <p className="text-sm sm:text-base text-gray-600 font-semibold">Gérer tous les articles publiés</p>

                <div className="mt-4 relative">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <div className="pl-4 pr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher des articles par titre..."
                            className="w-full py-2 px-2 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch} />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchItems();
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
                        className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === '' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 border border-gray-300'
                            }`}>
                        Tous
                    </button>
                    <button
                        onClick={() => setStatusFilter('available')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'available' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 border border-gray-300'
                            }`}>
                        Disponible
                    </button>
                    <button
                        onClick={() => setStatusFilter('sold')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'sold' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 border border-gray-300'
                            }`}>
                        Sold
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

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="sm:hidden flex flex-col gap-6 mt-6">
                            {items.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm
                                        ? `No articles found for "${searchTerm}"`
                                        : "No articles found"}
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="bg-white shadow-md rounded-lg p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/article-placeholder.png";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    ${item.price ? parseFloat(item.price).toFixed(2) : '0.00'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Published: {formatDate(item.published_at || item.created_at)}
                                                </p>
                                                <div className="mt-1">
                                                    {renderStatus(item.is_sold)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => viewItem(item.id)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
                                                Voir
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(item)}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="hidden sm:block overflow-x-auto mt-6">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Article</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Vendeur</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Prix</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-500 tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {items.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    {searchTerm
                                                        ? `No articles found for "${searchTerm}"`
                                                        : "No articles found"}
                                                </td>
                                            </tr>
                                        ) : (
                                            items.map(item => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden mr-3">
                                                                <img
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.title}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = "/article-placeholder.png";
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{item.title}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.seller ? (
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                                                    <img
                                                                        src={getProfileImageUrl(item.seller)}
                                                                        alt={`${item.seller.first_name} ${item.seller.last_name}`}
                                                                        className="h-full w-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.src = "/profile-placeholder.png";
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="text-sm text-gray-900">
                                                                    {item.seller.first_name} {item.seller.last_name}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">Unknown</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${item.price ? parseFloat(item.price).toFixed(2) : '0.00'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(item.published_at || item.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {renderStatus(item.is_sold)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => viewItem(item.id)}
                                                                className="text-blue-400 hover:text-blue-600 cursor-pointer">
                                                                Voir
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(item)}
                                                                className="text-red-400 hover:text-red-600 cursor-pointer">
                                                                Delete
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
                                        className={`px-3 py-1 rounded-md ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}>
                                        Previous
                                    </button>

                                    {[...Array(totalPages).keys()].map(page => (
                                        <button
                                            key={page + 1}
                                            onClick={() => setCurrentPage(page + 1)}
                                            className={`px-3 py-1 rounded-md ${currentPage === page + 1
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                }`}>
                                            {page + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}>
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete the item <span className="font-semibold">"{itemToDelete?.title}"</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setDeleteModal(false);
                                    setItemToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                disabled={deleteLoading}>
                                Cancel
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
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageArticles;