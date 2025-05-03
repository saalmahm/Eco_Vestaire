import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function Following() {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get('/profile/following', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Following response:", response.data);

        let followingData = [];
        
        if (response.data && response.data.data && response.data.data.data) {
          followingData = response.data.data.data;
        } else if (response.data && response.data.data) {
          followingData = response.data.data;
        } else if (response.data) {
          followingData = response.data;
        }
        
        if (!Array.isArray(followingData)) {
          console.warn("Les données de following ne sont pas dans un format attendu", response.data);
          followingData = [];
        }
        
        setFollowing(followingData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des abonnements:", err);
        setError("Une erreur est survenue lors du chargement de vos abonnements.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [navigate]);

  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      await axiosInstance.delete(`/users/${userId}/follow`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setFollowing(following.filter(user => user.id !== userId));
    } catch (err) {
      console.error("Erreur lors du désabonnement:", err);
      setError("Une erreur est survenue lors du désabonnement.");
    }
  };

  const navigateToFollowers = () => {
    navigate('/followers');
  };

  // Filtrer les abonnements selon le terme de recherche
  const filteredFollowing = following.filter(user => {
    if (!user) return false;
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <NavbarUser />

      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex border-b border-gray-300 mb-6">
            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
              Following
            </button>
            <button 
              className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900"
              onClick={navigateToFollowers}
            >
              Followers
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Following</h1>
            <p className="text-gray-600">
              {loading ? 'Chargement...' : `You're following ${following.length} people`}
            </p>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search following"
              className="w-full py-2.5 px-4 pr-10 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  {error}
                </div>
              )}

              {filteredFollowing.length === 0 ? (
                <div className="text-center py-8">
                  {searchTerm ? (
                    <p className="text-gray-600">No users match your search.</p>
                  ) : (
                    <p className="text-gray-600">You aren't following anyone yet.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 ml-16 mr-16">
                  {filteredFollowing.map((user) => (
                    <div key={user.id} className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.profile_photo 
                            ? `http://localhost:8000/storage/${user.profile_photo}` 
                            : "/profile.png"}
                          alt={`${user.first_name || ''} ${user.last_name || ''}`}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/profile.png";
                          }}
                        />
                        <div>
                          <div className="font-medium">{user.first_name || ''} {user.last_name || ''}</div>
                          <div className="text-sm text-gray-500">
                            {user.items_count || 0} items • {user.followers_count || 0} followers
                          </div>
                        </div>
                      </div>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer"
                        onClick={() => handleUnfollow(user.id)}
                      >
                        Following
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Following;