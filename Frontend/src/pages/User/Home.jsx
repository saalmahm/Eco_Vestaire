import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";
import axiosInstance from "../../../axiosConfig";

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    trendingItems: true
  });

  // Récupération des catégories et des articles tendance depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        console.log('Réponse des catégories:', response.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        console.error('Détails:', error.response?.data || error.message);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    const fetchTrendingItems = async () => {
      try {
        const response = await axiosInstance.get('/items/trending');
        console.log('Réponse des articles tendance:', response.data);
        // Prendre au plus 4 articles
        setTrendingItems(response.data.data.data ? response.data.data.data.slice(0, 4) : []);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles tendance:', error);
        console.error('Détails:', error.response?.data || error.message);
      } finally {
        setLoading(prev => ({ ...prev, trendingItems: false }));
      }
    };

    fetchCategories();
    fetchTrendingItems();
  }, []);

  const handleStartSelling = () => {
    const authToken = localStorage.getItem('authToken');
    
    // Check if the user is logged in
    if (authToken) {
      navigate('/publish-article');
    } else {
      navigate('/login');
    }
  };

  const handleCategoryClick = (categoryId) => {
    // Utilisation de navigate au lieu des liens <a>
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen mt-12">
      <NavbarUser />
      <main>
        {/* hero section */}
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

        {/* Category section - DYNAMIQUE */}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 justify-center">
                {categories && categories.length > 0 ? (
                  categories.slice(0, 4).map((category) => (
                    // Remplacer <a> par <Link> de React Router
                    <Link 
                      key={category.id}
                      to={`/categories/${category.id}`}
                      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={(e) => {
                        // Empêcher le comportement par défaut et utiliser navigate
                        e.preventDefault();
                        handleCategoryClick(category.id);
                      }}
                    >
                      <img 
                        src={category.icon || "/category.png"}
                        alt={category.name} 
                        className="w-22 h-22 object-cover" 
                      />
                      <p className="text-gray-700 mt-2 font-medium">{category.name}</p>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-4 text-center text-gray-500">Aucune catégorie disponible</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Reste du code inchangé... */}
        
        {/* Trending Products */}
        <section className="py-8 bg-gray-50">
          {/* Contenu inchangé */}
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
                        src={item.image ? `/storage/${item.image}` : "/article.png"} 
                        alt={item.title} 
                        className="w-full h-[256px] object-cover" 
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
                            src={item.seller?.avatar || "/profile.png"} 
                            alt={item.seller?.first_name || "Vendeur"} 
                            className="w-6 h-6 rounded-full" 
                          />
                          <p className="text-gray-600 text-sm">
                            {item.seller?.first_name || "Utilisateur"} {item.seller?.last_name ? item.seller.last_name.substring(0, 1) + "." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                          <span className="text-gray-500 text-sm">{item.favorites_count || 0}</span>
                        </div>
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

        {/* Sections inchangées... */}
        <Footer/>
      </main>
    </div>
  );
}

export default Home;