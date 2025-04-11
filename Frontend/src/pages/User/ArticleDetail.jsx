import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function ArticleDetail() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/items/${id}`);
        setArticle(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavbarVis />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavbarVis />
        <div className="text-red-500 text-center p-8">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <NavbarVis />
        <div className="text-center p-8">Article non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarVis />
      <div className="bg-gray-50 py-8 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Partie gauche - Image */}
              <div className="md:w-1/2 relative mb-6 md:mb-0">
                <img
                  src={article.image ? `http://localhost:8000/storage/${article.image}` : '/placeholder-item.png'}
                  alt={article.title}
                  className="w-full h-auto object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-item.png';
                  }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    article.is_sold ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {article.is_sold ? 'Vendu' : 'Disponible'}
                  </span>
                </div>
              </div>

              {/* Partie droite - Détails */}
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="text-green-600 font-medium mb-1">
                  {article.category?.name || 'Sans catégorie'}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h1>
                <div className="text-green-600 text-2xl font-bold mb-4">
                  {article.price}€
                </div>

                {/* Vendeur */}
                <div className="flex items-center mb-4">
                  <img
                    src={article.seller?.profile_photo ? 
                      `http://localhost:8000/storage/${article.seller.profile_photo}` : 
                      '/profile.png'}
                    alt={article.seller?.first_name || 'Vendeur'}
                    className="w-10 h-10 rounded-full mr-3"
                    onError={(e) => {
                      e.target.src = '/profile.png';
                    }}
                  />
                  <div>
                    <div className="font-medium">
                      {article.seller?.first_name || 'Anonyme'} {article.seller?.last_name || ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      Publié le {new Date(article.published_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {article.description}
                </p>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md flex-1 transition-colors"
                    onClick={() => navigate(`/checkout/${article.id}`)}
                  >
                    Acheter maintenant
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 py-3 px-4 rounded-md flex-1 transition-colors">
                    Ajouter aux favoris
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/heart-icon.png"
                      alt="Likes"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">{article.favorites_count || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/message-icon.png"
                      alt="Commentaires"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">{article.comments_count || 0} commentaires</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Commentaires */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Commentaires</h2>
            
            {/* Ajout de commentaire */}
            <div className="flex gap-3 mb-8">
              <img 
                src="/profile.png" 
                alt="Votre avatar" 
                className="w-10 h-10 rounded-full" 
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Envoyer
                </button>
              </div>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-6">
              <div className="flex gap-3">
                <img
                  src="/profile.png"
                  alt="Utilisateur"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">Alex Thompson</span>
                    <span className="text-sm text-gray-500">1 jour</span>
                  </div>
                  <p className="text-gray-700">Super article !</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;