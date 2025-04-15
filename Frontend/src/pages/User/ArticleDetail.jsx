import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    if (token) {
      refreshUserProfile();
    }
  }, []);

  const refreshUserProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const response = await axiosInstance.get('/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = response.data.data;
      setCurrentUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (err) {
      console.error("Erreur lors du rafraîchissement du profil:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setCurrentUser(parsedUserData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      }
    } else if (token) {
      const fetchUserProfile = async () => {
        try {
          const response = await axiosInstance.get('/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setCurrentUser(response.data.data);
          localStorage.setItem('userData', JSON.stringify(response.data.data));
        } catch (err) {
          console.error("Erreur lors de la récupération du profil:", err);
        }
      };
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleResponse = await axiosInstance.get(`/items/${id}`);
        setArticle(articleResponse.data.data);
        
        const likesResponse = await axiosInstance.get(`/items/${id}/likes-count`);
        setLikesCount(likesResponse.data.likes_count || 0);
        
        const token = localStorage.getItem('authToken');
        if (token) {
          const statusResponse = await axiosInstance.get(`/items/${id}/like-status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setIsLiked(statusResponse.data.liked);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError('Erreur lors du chargement de l\'article');
        setLoading(false);
      }
    };

    fetchData();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await axiosInstance.get(`/items/${id}/comments`);
      
      let commentData = [];
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          commentData = response.data.data;
        } 
        else if (response.data.data.data && Array.isArray(response.data.data.data)) {
          commentData = response.data.data.data;
        }
      }
      
      setComments(commentData);
      setCommentsLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setCommentsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('authToken');

    try {
      if (isLiked) {
        await axiosInstance.delete(`/items/${id}/like`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await axiosInstance.post(`/items/${id}/like`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Erreur lors du like/unlike:', err);
    }
  };

  const handleAddToFavorites = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!isLiked) {
      handleLikeToggle();
    }
    
    navigate('/favorites');
  };
  
  const navigateToSellerProfile = () => {
    if (article && article.seller && article.seller.id) {
      navigate(`/user-profile/${article.seller.id}`);
    }
  };
  
  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
      await axiosInstance.post(`/items/${id}/comments`, 
        { comment: newComment },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire:', err);
    }
  };
  
  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
      await axiosInstance.put(`/comments/${commentId}`, 
        { comment: editCommentText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setEditingCommentId(null);
      setEditCommentText('');
      fetchComments();
    } catch (err) {
      console.error('Erreur lors de la modification du commentaire:', err);
    }
  };
  
  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteAlert(true);
  };
  
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
      await axiosInstance.delete(`/comments/${commentToDelete}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setShowDeleteAlert(false);
      setCommentToDelete(null);
      fetchComments();
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
    }
  };
  
  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.comment);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);
    
    if (diffSeconds < 60) {
      return "À l'instant";
    } else if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const isUserCommentAuthor = (comment) => {
    if (!currentUser || !comment) {
      return false;
    }
    
    const userId = String(currentUser.id);
    const directUserId = comment.user_id !== undefined ? String(comment.user_id) : undefined;
    const nestedUserId = comment.user && comment.user.id !== undefined ? String(comment.user.id) : undefined;
    
    return userId === directUserId || userId === nestedUserId;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavbarUser />
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavbarUser />
        <div className="text-red-500 text-center p-8">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <NavbarUser />
        <div className="text-center p-8">Article non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarUser />
      <div className="bg-gray-50 py-8 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row">
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

                <div 
                  className="flex items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" 
                  onClick={navigateToSellerProfile}
                >
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
                    <div className="font-medium hover:text-green-600">
                      {article.seller?.first_name || 'Anonyme'} {article.seller?.last_name || ''}
                    </div>
                    <div className="text-sm text-gray-500">
                      Publié le {new Date(article.published_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {article.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md flex-1 transition-colors"
                    onClick={() => navigate(`/checkout/${article.id}`)}
                    disabled={article.is_sold}
                  >
                    Acheter maintenant
                  </button>
                  <button 
                    className="border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 py-3 px-4 rounded-md flex-1 transition-colors"
                    onClick={handleAddToFavorites}
                  >
                    Ajouter aux favoris
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center gap-1.5 cursor-pointer"
                    onClick={handleLikeToggle}
                  >
                    <img
                      src="/heart-icon.png"
                      alt="Likes"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">
                      {likesCount} likes
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/message-icon.png"
                      alt="Commentaires"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">{comments.length} commentaires</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Commentaires</h2>
            
            {isLoggedIn ? (
              <div className="flex gap-3 mb-8">
                <img 
                  src={currentUser?.profile_photo ? 
                    `http://localhost:8000/storage/${currentUser.profile_photo}` : 
                    '/profile.png'} 
                  alt="Votre avatar" 
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.src = '/profile.png';
                  }}
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  />
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                    onClick={handleCommentSubmit}
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center mb-8 py-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Connectez-vous pour laisser un commentaire</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Se connecter
                </button>
              </div>
            )}

            {commentsLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => {
                  const isMyComment = isUserCommentAuthor(comment);
                  
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <img
                        src={comment.user?.profile_photo ? 
                          `http://localhost:8000/storage/${comment.user.profile_photo}` : 
                          '/profile.png'}
                        alt={comment.user?.first_name || 'Utilisateur'}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.target.src = '/profile.png';
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-1">
                          <div>
                            <span className="font-medium">
                              {comment.user?.first_name || 'Anonyme'} {comment.user?.last_name || ''}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              {formatDate(comment.created_at)}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              {comment.created_at ? new Date(comment.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}
                            </span>
                          </div>
                          
                          {isMyComment && (
                            <div className="flex gap-2">
                              {editingCommentId === comment.id ? (
                                <>
                                  <button 
                                    className="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                                    onClick={() => handleEditComment(comment.id)}
                                  >
                                    Sauvegarder
                                  </button>
                                  <button 
                                    className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                                    onClick={() => {
                                      setEditingCommentId(null);
                                      setEditCommentText('');
                                    }}
                                  >
                                    Annuler
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
                                    onClick={() => startEditingComment(comment)}
                                  >
                                    Modifier
                                  </button>
                                  <button 
                                    className="text-red-600 text-sm hover:text-red-800 transition-colors"
                                    onClick={() => confirmDeleteComment(comment.id)}
                                  >
                                    Supprimer
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <div className="mt-1">
                            <input 
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleEditComment(comment.id)}
                            />
                          </div>
                        ) : (
                          <p className="text-gray-700">{comment.comment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
          <div 
            className="p-6 w-full max-w-md bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-300"
            role="alert"
          >
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <h3 className="text-lg font-semibold">Confirmation de suppression</h3>
            </div>
            <p className="text-sm mb-5">
              Êtes-vous sûr de vouloir supprimer ce commentaire ? <br />
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                onClick={handleDeleteComment}
              >
                <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 14">
                  <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                Confirmer
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-red-700 border border-red-500 rounded-lg hover:bg-red-100 transition-all duration-200"
                onClick={() => {
                  setShowDeleteAlert(false);
                  setCommentToDelete(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;