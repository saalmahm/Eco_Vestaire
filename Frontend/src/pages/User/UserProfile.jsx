import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import Navbar from "../../components/NavbarUser";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const userPromise = axiosInstance.get(`/users/${id}`);
        const itemsPromise = axiosInstance.get(`/items/user/${id}`);

        const [userResponse, itemsResponse] = await Promise.all([userPromise, itemsPromise]);

        setUser(userResponse.data.data);
        setItems(itemsResponse.data.data);

        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const followResponse = await axiosInstance.get(`/users/${id}/follow-status`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setIsFollowing(followResponse.data.following);
          } catch (followErr) {
            console.log("Follow status check failed - user likely not logged in");
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.message || "Une erreur est survenue lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);

      const token = localStorage.getItem('authToken');

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      if (isFollowing) {
        await axiosInstance.delete(`/users/${id}/follow`, config);
        setIsFollowing(false);
        if (user && user.followers_count !== undefined) {
          setUser({ ...user, followers_count: user.followers_count - 1 });
        }
      } else {
        await axiosInstance.post(`/users/${id}/follow`, {}, config);
        setIsFollowing(true);
        if (user && user.followers_count !== undefined) {
          setUser({ ...user, followers_count: user.followers_count + 1 });
        }
      }
    } catch (err) {
      console.error("Follow action failed:", err);
      if (err.response?.status === 401) {
        alert("Veuillez vous connecter pour suivre cet utilisateur");
      }
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mt-8 mx-auto max-w-md">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-14">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {user.profile_photo ? (
                <img
                  src={`http://localhost:8000/storage/${user.profile_photo}`}
                  alt={`${user.first_name || ''} ${user.last_name || ''}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {user.first_name ? user.first_name.charAt(0) : ''}
                    {user.last_name ? user.last_name.charAt(0) : ''}
                  </span>
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-xl font-bold">{user.first_name} {user.last_name}</h1>
                  {isLoggedIn ? (
                    <button
                      className={`${isFollowing
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-[#16A34A] hover:bg-green-600 text-white"
                        } text-sm px-4 py-1 rounded-full transition-colors flex items-center`}
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                    >
                      {followLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></span>
                      ) : null}
                      {isFollowing ? "Abonné" : "S'abonner"}
                    </button>
                  ) : (
                    <button
                      className="bg-gray-200 text-gray-600 text-sm px-4 py-1 rounded-full"
                      onClick={() => window.location.href = '/login'}
                    >
                      Se connecter pour suivre
                    </button>
                  )}
                </div>
                <div className="flex justify-center sm:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{items.length}</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{user.followers_count || 0}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{user.following_count || 0}</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={item.image
                        ? `http://localhost:8000/storage/${item.image}`
                        : "/placeholder-item.png"}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-item.png";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {item.condition}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <span className="text-green-600 font-bold">{item.price}€</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description.substring(0, 60)}...
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1">
                        <img src="/heart-icon.png" alt="Like" className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300" />
                        <span className="text-xs text-gray-500">{item.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <img src="/message-icon.png" alt="Comments" className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors duration-300" />
                        <span className="text-xs text-gray-500">{item.comments_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500">Cet utilisateur n'a pas encore publié d'articles.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;