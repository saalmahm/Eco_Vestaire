import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function Followers() {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get('/profile/followers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("Followers response:", response.data);

        let followersData = [];
        
        if (response.data && response.data.data && response.data.data.data) {

          followersData = response.data.data.data;
        } else if (response.data && response.data.data) {

          followersData = response.data.data;
        } else if (response.data) {

          followersData = response.data;
        }
        

        if (!Array.isArray(followersData)) {
          console.warn("Les données de followers ne sont pas dans un format attendu", response.data);
          followersData = [];
        }
        
        setFollowers(followersData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des abonnés:", err);
        setError("Une erreur est survenue lors du chargement de vos abonnés.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [navigate]);

  const handleRemoveFollower = async (followerId) => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }
  
      await axiosInstance.delete(`/users/${followerId}/follower`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Mise à jour de l'état local pour retirer l'utilisateur de la liste
      setFollowers(followers.filter(follower => follower.id !== followerId));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'abonné:", err);
      setError("Une erreur est survenue lors de la suppression de l'abonné.");
    }
  };

  const navigateToFollowing = () => {
    navigate('/following');
  };

  const filteredFollowers = followers.filter(follower => {
    if (!follower) return false;
    const fullName = `${follower.first_name || ''} ${follower.last_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <>
        <NavbarUser />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarUser />

      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex border-b border-gray-300 mb-6">
            <button 
              className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900"
              onClick={navigateToFollowing}
            >
              Following
            </button>
            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
              Followers
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Followers</h1>
            <p className="text-gray-600">You have {followers.length} followers</p>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search followers"
              className="w-full py-2.5 px-4 pr-10 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          )}

          {filteredFollowers.length === 0 ? (
            <div className="text-center py-8">
              {searchTerm ? (
                <p className="text-gray-600">No followers match your search.</p>
              ) : (
                <p className="text-gray-600">You don't have any followers yet.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 ml-16 mr-16">
              {filteredFollowers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={follower.profile_photo 
                        ? `http://localhost:8000/storage/${follower.profile_photo}` 
                        : "/profile.png"}
                      alt={`${follower.first_name || ''} ${follower.last_name || ''}`}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/profile.png";
                      }}
                    />
                    <div>
                      <div className="font-medium">{follower.first_name || ''} {follower.last_name || ''}</div>
                      <div className="text-sm text-gray-500">
                        {follower.items_count || 0} items • {follower.followers_count || 0} followers
                      </div>
                    </div>
                  </div>
                  <button
                    className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold"
                    onClick={() => handleRemoveFollower(follower.id)}
                  >
                    Remove follower
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Followers;