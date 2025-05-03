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

  const handleBuyItem = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      // Créer une nouvelle commande (demande d'achat)
      const response = await axiosInstance.post('/orders',
        { item_id: itemId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
  
      // Créer un div pour alerte 
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
      alertDiv.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-center mb-2">Demande envoyée !</h3>
          <p class="text-gray-600 text-center mb-4">
            Votre demande d'achat a été envoyée au vendeur. Vous serez notifié lorsqu'il acceptera ou refusera votre demande.
          </p>
          <button class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onclick="this.closest('.fixed').remove(); window.location.href='/mes-achats';">
            D'accord
          </button>
        </div>
      `;
      
      document.body.appendChild(alertDiv);
  
    } catch (err) {
      console.error('Erreur lors de la demande d\'achat:', err);
      alert("Une erreur est survenue lors de la demande d'achat.");
    }
  };

  const handleViewItem = (itemId) => {
    navigate(`/article/${itemId}`);
  };

  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-8 px-8 md:px-16 w-full mt-12">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Favoris</h1>
            <p className="text-sm text-gray-500">
              {loading ? 'Chargement...' : `${favorites.length} articles`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-red-500 font-bold mb-2">Erreur</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              >
                Rafraîchir la page
              </button>
            </div>
          ) : favorites.length === 0 ? (
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