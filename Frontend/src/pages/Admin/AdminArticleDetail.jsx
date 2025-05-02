import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import Sidebar from '../../components/Sidebar';

function AdminArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);

    // Vérification de l'auth
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentification requise. Veuillez vous connecter.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        fetchArticleDetails();
    }, [id, navigate]);

    const fetchArticleDetails = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token d\'authentification non trouvé. Veuillez vous reconnecter.');
                setLoading(false);
                return;
            }

            //  détails de l'article
            const articleResponse = await axiosInstance.get(`/items/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setArticle(articleResponse.data.data);

            //  nombre de likes
            try {
                const likesResponse = await axiosInstance.get(`/items/${id}/likes-count`);
                setLikesCount(likesResponse.data.likes_count || 0);
            } catch (err) {
                console.error("Erreur lors de la récupération des likes:", err);
            }

            //  nombre de commentaires
            try {
                const commentsResponse = await axiosInstance.get(`/items/${id}/comments`);
                let commentData = [];
                if (commentsResponse.data.data) {
                    if (Array.isArray(commentsResponse.data.data)) {
                        commentData = commentsResponse.data.data;
                    } else if (commentsResponse.data.data.data && Array.isArray(commentsResponse.data.data.data)) {
                        commentData = commentsResponse.data.data.data;
                    }
                }
                setCommentsCount(commentData.length);
            } catch (err) {
                console.error("Erreur lors de la récupération des commentaires:", err);
            }

            setLoading(false);
        } catch (err) {
            console.error("Erreur:", err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Votre session a expiré. Veuillez vous reconnecter.');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError('Erreur lors du chargement de l\'article');
                }
            } else if (err.request) {
                setError('Aucune réponse du serveur. Vérifiez votre connexion internet.');
            } else {
                setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
            }

            setLoading(false);
        }
    };

    const handleDeleteArticle = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            await axiosInstance.delete(`/admin/items/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("Article supprimé avec succès");
            navigate('/admin/gestion-articles');
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            alert("Erreur lors de la suppression de l'article");
        }
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

    const renderStatus = (isSold) => {
        if (isSold) {
            return (
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white">
                    Vendu
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white">
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

    if (!article) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 ml-16 md:ml-64 p-4">
                    <div className="text-center p-8">Article non trouvé</div>
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
                            <h1 className="text-xl font-bold text-gray-900">Détails de l'Article</h1>
                            <p className="text-sm text-gray-600">Informations complètes sur l'article</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/admin/manage-articles')}
                                className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                                Retour
                            </button>
                            <button
                                onClick={handleDeleteArticle}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                Supprimer
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 p-4 flex justify-center">
                                <div className="relative w-full">
                                    <img
                                        src={getImageUrl(article.image)}
                                        alt={article.title}
                                        className="w-full h-auto object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.src = "/article-placeholder.png";
                                        }}
                                    />
                                    <div className="absolute top-4 right-4">
                                        {renderStatus(article.is_sold)}
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/2 p-6 bg-white">
                                <div className="mb-6">
                                    <div className="text-green-600 font-medium mb-1">
                                        {article.category?.name || 'Sans catégorie'}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {article.title}
                                    </h1>
                                    <div className="text-green-600 text-2xl font-bold mb-4">
                                        {article.price}€
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {article.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800 mb-2">État de l'article</h2>
                                    <p className="text-gray-600">
                                        {article.condition === 'new' && 'Neuf'}
                                        {article.condition === 'like_new' && 'Comme neuf'}
                                        {article.condition === 'good' && 'Bon état'}
                                        {article.condition === 'fair' && 'État moyen'}
                                        {article.condition === 'poor' && 'État médiocre'}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800 mb-2">Vendeur</h2>
                                    <div className="flex items-center">
                                        <img
                                            src={getProfileImageUrl(article.seller)}
                                            alt={article.seller?.first_name || 'Vendeur'}
                                            className="w-10 h-10 rounded-full mr-3"
                                            onError={(e) => {
                                                e.target.src = "/profile-placeholder.png";
                                            }}
                                        />
                                        <div>
                                            <div className="font-medium">
                                                {article.seller?.first_name || 'Anonyme'} {article.seller?.last_name || ''}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {article.seller?.id || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="font-semibold text-gray-800 mb-2">Informations</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Date de publication</p>
                                            <p className="font-medium">{formatDate(article.published_at || article.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Dernière modification</p>
                                            <p className="font-medium">{formatDate(article.updated_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Likes</p>
                                            <p className="font-medium">{likesCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Commentaires</p>
                                            <p className="font-medium">{commentsCount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">ID de l'article</p>
                                            <p className="font-medium">{article.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminArticleDetail;