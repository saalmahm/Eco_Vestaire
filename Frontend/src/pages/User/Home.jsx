import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";
import axiosInstance from "../../../axiosConfig";

function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [trendingItems, setTrendingItems] = useState([]);
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState({
        categories: true,
        trendingItems: true,
        feedItems: true
    });
    const [likedItems, setLikedItems] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const categoriesPerPage = 4;
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase() !== 'uncategorized'
    );
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    // Charger les catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data.data);
            } catch (error) {
                // Ne rien faire en cas d'erreur
            } finally {
                setLoading(prev => ({ ...prev, categories: false }));
            }
        };

        fetchCategories();
    }, []);

    // Charger les articles tendance
    useEffect(() => {
        const fetchTrendingItems = async () => {
            try {
                const response = await axiosInstance.get('/items/trending');
                const items = response.data.data?.data || response.data.data || [];
                setTrendingItems(items.slice(0, 4));
                setLoading(prev => ({ ...prev, trendingItems: false }));

                // Vérifier les likes si l'utilisateur est connecté
                const token = localStorage.getItem('authToken');
                if (token) {
                    const likeStatuses = {};
                    for (const item of items.slice(0, 4)) {
                        try {
                            const likeResponse = await axiosInstance.get(`/items/${item.id}/like-status`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            likeStatuses[item.id] = likeResponse.data.liked;
                        } catch (error) {
                            likeStatuses[item.id] = false;
                        }
                    }
                    setLikedItems(prev => ({ ...prev, ...likeStatuses }));
                }
            } catch (error) {
                setLoading(prev => ({ ...prev, trendingItems: false }));
            }
        };

        fetchTrendingItems();
    }, []);

    // Charger le feed si l'utilisateur est connecté
    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(prev => ({ ...prev, feedItems: false }));
            return;
        }

        const fetchFeedItems = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axiosInstance.get('/feed/following-items', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const items = response.data.data?.data || response.data.data || [];
                setFeedItems(items);
                setLoading(prev => ({ ...prev, feedItems: false }));

                // Vérifier les statuts de like
                const likeStatuses = {};
                for (const item of items) {
                    try {
                        const likeResponse = await axiosInstance.get(`/items/${item.id}/like-status`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        likeStatuses[item.id] = likeResponse.data.liked;
                    } catch (error) {
                        likeStatuses[item.id] = false;
                    }
                }
                setLikedItems(prev => ({ ...prev, ...likeStatuses }));
            } catch (error) {
                setLoading(prev => ({ ...prev, feedItems: false }));
            }
        };

        fetchFeedItems();
    }, [isAuthenticated]);

    // Auto-scroll pour le carousel
    useEffect(() => {
        if (filteredCategories.length > 0) {
            const timer = setInterval(() => {
                setCurrentPage((prevPage) => {
                    const nextPage = prevPage + 1;
                    return nextPage >= totalPages ? 0 : nextPage;
                });
            }, 4000);

            return () => clearInterval(timer);
        }
    }, [filteredCategories.length, totalPages]);

    const handleStartSelling = () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            navigate('/publish-article');
        } else {
            navigate('/login');
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const handleLikeToggle = async (itemId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            if (likedItems[itemId]) {
                await axiosInstance.delete(`/items/${itemId}/like`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLikedItems(prev => ({ ...prev, [itemId]: false }));

                // Mettre à jour les compteurs
                setFeedItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, favorites_count: Math.max((item.favorites_count || 1) - 1, 0) } : item
                    )
                );

                setTrendingItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, favorites_count: Math.max((item.favorites_count || 1) - 1, 0) } : item
                    )
                );
            } else {
                await axiosInstance.post(`/items/${itemId}/like`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLikedItems(prev => ({ ...prev, [itemId]: true }));

                // Mettre à jour les compteurs
                setFeedItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, favorites_count: (item.favorites_count || 0) + 1 } : item
                    )
                );

                setTrendingItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, favorites_count: (item.favorites_count || 0) + 1 } : item
                    )
                );
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du like:", error);
        }
    };

    const handleCommentClick = (itemId) => {
        navigate(`/article/${itemId}#comments`);
    };

    const handleBuyClick = (itemId) => {
        navigate(`/article/${itemId}`);
    };

    const ArticleCard = ({ item }) => (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 flex items-center gap-3 border-b">
                <img
                    src={item.seller?.profile_photo ? `http://localhost:8000/storage/${item.seller.profile_photo}` : "/profile.png"}
                    alt={item.seller?.first_name || "Vendeur"}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${item.seller?.id}`);
                    }}
                />
                <div
                    className="flex-1 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user-profile/${item.seller?.id}`);
                    }}
                >
                    <p className="font-medium">{item.seller?.first_name} {item.seller?.last_name}</p>
                    <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                    {parseFloat(item.price).toFixed(2)} €
                </span>
            </div>

            <div
                className="relative cursor-pointer"
                onClick={() => navigate(`/article/${item.id}`)}
            >
                <img
                    src={item.image ? `http://localhost:8000/storage/${item.image}` : "/article.png"}
                    alt={item.title}
                    className="w-full h-[500px] object-cover"
                    onError={(e) => {
                        e.target.src = "/article.png";
                    }}
                />
            </div>

            <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                    <button
                        onClick={() => handleLikeToggle(item.id)}
                        className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                        <img
                            src="/like-article-home.png"
                            alt="Like"
                            className="w-6 h-6"
                        />
                        <span className="text-sm font-medium">{item.favorites_count || 0}</span>
                    </button>
                    <button
                        onClick={() => handleCommentClick(item.id)}
                        className="flex items-center gap-1 hover:scale-110 transition-transform"
                    >
                        <img
                            src="/message-icon.png"
                            alt="Comment"
                            className="w-6 h-6"
                        />
                        <span className="text-sm font-medium">{item.comments_count || 0}</span>
                    </button>
                    <div className="flex-1"></div>
                    <button
                        onClick={() => handleBuyClick(item.id)}
                        className="bg-[#16A34A] text-white px-4 py-1 rounded-full text-sm hover:bg-green-600 transition-colors"
                    >
                        Acheter
                    </button>
                </div>
                <div>
                    <h3 className="font-bold">{item.title}</h3>
                    {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen mt-12">
            <NavbarUser />
            <main>
                <section className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] py-8 flex items-center justify-center">
                    <div className="container mx-auto px- md:px-12 lg:px-20 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 space-y-5 md:text-left px-6">
                            <h1 className="text-gray-800 font-bold text-4xl md:text-5xl leading-tight max-w-xl">
                                Donnez une seconde vie à vos vêtements
                            </h1>
                            <p className="text-gray-600 text-lg max-w-md">
                                Achetez et vendez des vêtements d'occasion de qualité. Économisez et préservez.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                <button
                                    className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all"
                                    onClick={handleStartSelling}
                                >
                                    Commencer à vendre
                                </button>
                                <button
                                    className="border border-[#16A34A] text-[#16A34A] hover:bg-green-50 px-6 py-3 rounded-full transition-all"
                                    onClick={() => navigate('/search/items')}
                                >
                                    Explorer
                                </button>
                            </div>
                        </div>

                        <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
                            <img
                                src="/hero.png"
                                alt="Clothes rack"
                                className="rounded-lg w-full max-w-md md:max-w-lg"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container mx-auto px-6">
                        <h2 className="text-[30px] font-bold text-gray-800 mb-10 w-[339px] h-[36px] mx-auto text-center">
                            Parcourir par catégorie
                        </h2>

                        {loading.categories ? (
                            <div className="flex justify-center">
                                <p>Chargement des catégories...</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{ transform: `translateX(-${currentPage * 100}%)` }}
                                    >
                                        {filteredCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="w-full sm:w-1/2 md:w-1/4 flex-shrink-0 px-4"
                                            >
                                                <Link
                                                    to={`/categories/${category.id}`}
                                                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleCategoryClick(category.id);
                                                    }}
                                                >
                                                    <div className="w-22 h-22 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        <img
                                                            src={category.icon ? `http://localhost:8000/storage/${category.icon}` : "/category.png"}
                                                            alt={category.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "/category.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-gray-700 mt-2 font-medium">{category.name}</p>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-4 gap-2">
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <button
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-all ${currentPage === index ? 'bg-green-500 w-4' : 'bg-gray-300'
                                                    }`}
                                                onClick={() => goToPage(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-8 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-[30px] font-bold text-gray-800 w-[339px] h-[36px] mx-auto mb-8 text-center">
                            Articles tendance
                        </h2>
                        {loading.trendingItems ? (
                            <div className="flex justify-center">
                                <p>Chargement des articles tendance...</p>
                            </div>
                        ) : trendingItems && trendingItems.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 justify-center">
                                {trendingItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/article/${item.id}`)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={item.image ? `http://localhost:8000/storage/${item.image}` : "/article.png"}
                                                alt={item.title}
                                                className="w-full h-[256px] object-cover"
                                                onError={(e) => {
                                                    e.target.src = "/article.png";
                                                }}
                                            />
                                            <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                                                {parseFloat(item.price).toFixed(2)} €
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between">
                                                <p className="text-gray-800 font-bold">{item.title}</p>
                                                <p className="text-gray-600">Taille: {item.size || "M"}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={item.seller?.profile_photo ? `http://localhost:8000/storage/${item.seller.profile_photo}` : "/profile.png"}
                                                        alt={item.seller?.first_name || "Vendeur"}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/profile.png";
                                                        }}
                                                    />
                                                    <p className="text-gray-600 text-sm">
                                                        {item.seller?.first_name || "Utilisateur"} {item.seller?.last_name ? item.seller.last_name.substring(0, 1) + "." : ""}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLikeToggle(item.id);
                                                    }}
                                                    className="flex items-center gap-1 hover:scale-110 transition-transform"
                                                >
                                                    <img
                                                        src="/like-article-home.png"
                                                        alt="Like"
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-gray-500 text-sm">{item.favorites_count || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Aucun article tendance pour le moment</p>
                            </div>
                        )}
                    </div>
                </section>

                {isAuthenticated && (
                    <section className="py-8 bg-gray-100">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Publications récentes</h2>

                            {loading.feedItems ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                </div>
                            ) : feedItems && feedItems.length > 0 ? (
                                <div className="max-w-2xl mx-auto">
                                    {feedItems.map(item => (
                                        <ArticleCard key={item.id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                    <p className="text-gray-500 mb-4">Aucune publication pour le moment</p>
                                    <button
                                        onClick={() => navigate('/search/users')}
                                        className="bg-[#16A34A] text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                                    >
                                        Trouver des personnes à suivre
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}
                {!isAuthenticated && (
                    <>
                        <section className="py-12">
                            <div className="container mx-auto px-4">
                                <h2 className="text-[30px] font-bold text-gray-800 w-[339px] h-[36px] mx-auto mb-8 text-center">
                                    Comment ça marche ?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center">
                                        <img src="/photo-icon.png" alt="Prenez en photo" className="w-22px h-22px object-cover mb-4" />
                                        <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Prenez en photo</h3>
                                        <p className="text-gray-600 text-center">Photographiez vos vêtements et créez une annonce</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <img src="/price-icon.png" alt="Fixez votre prix" className="w-22px h-22px object-cover mb-4" />
                                        <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Fixez votre prix</h3>
                                        <p className="text-gray-600 text-center">Définissez le prix pour lequel vous êtes prêt à vendre</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <img src="/sell-icon.png" alt="Vendez facilement" className="w-22px h-22px object-cover mb-4" />
                                        <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Vendez facilement</h3>
                                        <p className="text-gray-600 text-center">Recevez votre argent dès que l'acheteur valide</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="py-12 bg-[#16A34A] text-white">
                            <div className="container mx-auto px-4 text-center">
                                <h2 className="text-2xl font-bold mb-3">Prêt à donner une seconde vie à vos vêtements ?</h2>
                                <p className="mb-6 max-w-2xl mx-auto">Rejoignez notre communauté de vendeurs et acheteurs responsables.</p>
                                <button
                                    className="bg-white text-[#16A34A] hover:bg-gray-100 px-6 py-2 rounded-full transition-colors font-inter"
                                    onClick={() => navigate('/signup')}
                                >
                                    Créer un compte gratuitement
                                </button>
                            </div>
                        </section>
                    </>
                )}
                <Footer />
            </main>
        </div>
    );
}

export default Home;