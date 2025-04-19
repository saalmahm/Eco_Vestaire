import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";
import axiosInstance from '../../../axiosConfig';

function CategoryItems() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const pathSegments = location.pathname.split('/');
  const categoryIdFromPath = pathSegments[pathSegments.length - 1];
  const categoryId = params.categoryId || categoryIdFromPath;
  
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesData, setLikesData] = useState({});

  useEffect(() => {
    if (!categoryId) {
      setError("ID de catégorie non valide");
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${categoryId}`);
        
        if (response.data && response.data.data) {
          setCategory(response.data.data);
          fetchCategoryItems();
        } else {
          setError("Format de réponse API non reconnu");
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur catégorie:", err);
        setError("Impossible de charger la catégorie");
        setLoading(false);
      }
    };

    const fetchCategoryItems = async () => {
      try {
        const response = await axiosInstance.get(`/items/category/${categoryId}`);
        
        let itemsData = [];
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            itemsData = response.data.data;
          } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
            itemsData = response.data.data.data;
          }
        }
        
        setItems(itemsData);
        fetchLikesForItems(itemsData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur articles:", err);
        setError("Impossible de charger les articles");
        setLoading(false);
      }
    };

    const fetchLikesForItems = async (items) => {
      try {
        const likesPromises = items.map(item => 
          axiosInstance.get(`/items/${item.id}/likes-count`)
        );
        
        const likesResponses = await Promise.all(likesPromises);
        
        const newLikesData = {};
        items.forEach((item, index) => {
          newLikesData[item.id] = likesResponses[index].data.likes_count || 0;
        });
        
        setLikesData(newLikesData);
      } catch (err) {
        console.error("Erreur lors de la récupération des likes:", err);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const navigateToItemDetail = (itemId) => {
    navigate(`/article/${itemId}`);
  };

  return (
    <div className="min-h-screen">
      <NavbarUser />
      <main className="py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {category ? category.name : 'Catégorie'}
            </h1>
            <p className="mt-2 text-gray-600">
              {category?.description || 'Découvrez tous les articles de cette catégorie'}
            </p>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6 text-center">
              {error}
            </div>
          )}

          {/* Items Grid */}
          {!loading && !error && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">Aucun article trouvé dans cette catégorie</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-all"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigateToItemDetail(item.id)}
                    >
                      <div className="relative">
                        <img 
                          src={item.image ? `http://localhost:8000/storage/${item.image}` : "/placeholder-item.png"} 
                          alt={item.title} 
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-item.png";
                          }} 
                        />
                        <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                          {parseFloat(item.price).toFixed(2)} €
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <p className="text-gray-800 font-semibold">{item.title}</p>
                          <p className="text-gray-600 text-sm">
                            {item.condition === 'new' ? 'Neuf' : 
                             item.condition === 'like_new' ? 'Comme neuf' :
                             item.condition === 'good' ? 'Très bon état' :
                             item.condition === 'fair' ? 'Bon état' : 'État satisfaisant'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={item.seller?.avatar ? `http://localhost:8000/storage/${item.seller.avatar}` : "/profile.png"} 
                              alt={`${item.seller?.first_name || 'Utilisateur'}`} 
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/profile.png";
                              }}
                            />
                            <p className="text-gray-600 text-sm">
                              {item.seller?.first_name} {item.seller?.last_name ? item.seller.last_name.charAt(0) + '.' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                            <span className="text-gray-500 text-sm">
                              {likesData[item.id] !== undefined ? likesData[item.id] : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CategoryItems;