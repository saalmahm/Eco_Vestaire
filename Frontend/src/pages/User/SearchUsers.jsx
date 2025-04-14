import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";

function SearchUsers() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/items/search/by-seller`, {
          params: {
            username: searchQuery
          }
        });
        
        if (response.data && response.data.success) {
          setUsers(response.data.data);
          setError(null);
        } else {
          setError(response.data?.message || "Aucun utilisateur trouvé");
        }
      } catch (err) {
        console.error("Error fetching users data:", err);
        setError(err.response?.data?.message || "Une erreur est survenue lors de la recherche d'utilisateurs.");
      } finally {
        setLoading(false);
      }
    };
  
    if (searchQuery) {
      fetchUsers();
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [searchQuery]);

  const renderProfileImage = (user) => {
    if (user?.profile_photo) {
      return (
        <img 
          src={`http://localhost:8000/storage/${user.profile_photo}`} 
          alt={`${user.first_name} ${user.last_name}`} 
          className="h-12 w-12 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-green-600 text-sm font-medium">
          {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarUser />
      
      <div className="container mx-auto px-4 mt-24 mb-10 flex-grow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Résultats de recherche pour: <span className="text-green-600">@{searchQuery}</span>
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Utilisateurs trouvés ({users.length})</h2>
            
            <div className="space-y-4">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/user-profile/${user.id}`)}
                  >
                  {renderProfileImage(user)}
                  <div className="ml-4">
                    <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                    <p className="text-gray-500 text-sm">@{user.first_name.toLowerCase()}{user.last_name.toLowerCase()}</p>
                  </div>
                  <div className="ml-auto">
                    <button 
                      className="text-green-600 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profil/${user.id}`);
                      }}
                    >
                      Voir le profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-10 rounded relative text-center">
            <p className="text-lg">Aucun utilisateur trouvé pour "@{searchQuery}"</p>
            <p className="mt-2 text-gray-600">Vérifiez l'orthographe ou essayez avec un autre nom d'utilisateur.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default SearchUsers;