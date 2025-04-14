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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axiosInstance.get(`/users/${id}`);
        setUser(userResponse.data.data);

        const itemsResponse = await axiosInstance.get(`/items/user/${id}`);
        setItems(itemsResponse.data.data);

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
                  <button className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-full hover:bg-green-600 transition-colors">
                    Follow
                  </button>
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
                        e.target.src = "/placeholder-item.png"; // Fallback if image fails to load
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