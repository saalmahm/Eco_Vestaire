import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get('/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Réponse API:", response.data);
      
      // Laravel retourne parfois des données imbriquées avec pagination
      let items = [];
      
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response.data.data.data && Array.isArray(response.data.data.data)) {
          items = response.data.data.data;
        }
      }
      
      const formattedItems = items.map(fav => {
        const item = fav.item || fav;
        return {
          id: fav.id,
          item_id: item.id, 
          title: item.title,
          condition: item.condition,
          price: item.price,
          image: item.image,
          is_sold: item.is_sold
        };
      });

      setFavorites(formattedItems);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
      setError("Impossible de charger vos favoris");
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axiosInstance.delete(`/items/${itemId}/like`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Mise à jour locale après suppression réussie
      if (response.status === 200) {
        setFavorites(prevFavorites => 
          prevFavorites.filter(fav => fav.item_id !== itemId)
        );
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Échec de la suppression. Veuillez réessayer.");
    }
  };

  const handleBuyItem = (itemId) => {
    navigate(`/checkout/${itemId}`);
  };

  const handleViewItem = (itemId) => {
    navigate(`/article/${itemId}`);
  };

  if (loading) {
    return (
      <>
        <NavbarUser />
        <div className="bg-gray-50 min-h-screen py-8 px-8 md:px-16 w-full mt-12">
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarUser />
        <div className="bg-gray-50 min-h-screen py-8 px-8 md:px-16 w-full mt-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-8 px-8 md:px-16 w-full mt-12">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Favoris</h1>
            <p className="text-sm text-gray-500">{favorites.length} articles</p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Vous n'avez pas encore d'articles favoris.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-md transition"
              >
                Explorer les articles
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {favorites.map((favorite) => (
                <div 
                  key={favorite.id} 
                  className="bg-white rounded-lg shadow-md p-5 w-full md:flex md:items-center md:space-x-6"
                >
                  <div 
                    className="w-28 h-28 bg-gray-100 rounded overflow-hidden mb-4 md:mb-0 cursor-pointer"
                    onClick={() => handleViewItem(favorite.item_id)}
                  >
                    <img
                      src={favorite.image 
                        ? `http://localhost:8000/storage/${favorite.image}` 
                        : "/placeholder-item.png"}
                      alt={favorite.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-item.png";
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 
                          className="font-semibold text-lg mb-1 cursor-pointer hover:text-green-600"
                          onClick={() => handleViewItem(favorite.item_id)}
                        >
                          {favorite.title}
                        </h3>
                        <p className="text-sm text-green-600 mb-1">{favorite.condition}</p>
                        <p className="font-bold text-gray-900 mb-2">{favorite.price} €</p>
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${favorite.is_sold ? 'bg-yellow-500' : 'bg-green-500'} mr-2`}></div>
                          <span className={`text-sm ${favorite.is_sold ? 'text-yellow-500' : 'text-green-500'}`}>
                            {favorite.is_sold ? 'Vendu' : 'Disponible'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <button 
                          className="text-red-500 hover:text-red-600 mb-2 self-end"
                          onClick={() => handleRemoveFavorite(favorite.item_id)}
                        >
                          <img src="/trash-icon.png" alt="Supprimer" className="w-5 h-5" />
                        </button>
                        <button 
                          className={`${favorite.is_sold 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'} text-white text-sm px-5 py-2 rounded-md transition block w-full text-center mt-8`}
                          onClick={() => handleBuyItem(favorite.item_id)}
                          disabled={favorite.is_sold}
                        >
                          {favorite.is_sold ? 'Vendu' : 'Acheter'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Favorites;