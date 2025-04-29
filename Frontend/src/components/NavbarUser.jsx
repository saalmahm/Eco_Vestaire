import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

function NavbarUser() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [recentFollowers, setRecentFollowers] = useState([]);
  const [hasNewFollowers, setHasNewFollowers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profilePopupRef = useRef(null);
  const notificationPopupRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile();
      fetchRecentFollowers();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserProfile(response.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const fetchRecentFollowers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/followers', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          recent: true,
          per_page: 5
        }
      });

      let followerData = response.data.data || [];
      let followers = followerData.data || followerData;

      // Date pour filtrer les abonnés récents (une semaine)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      let recent = followers.map(follow => {
        return {
          id: follow.follower ? follow.follower.id : follow.id,
          first_name: follow.follower ? follow.follower.first_name : follow.first_name,
          last_name: follow.follower ? follow.follower.last_name : follow.last_name,
          profile_photo: follow.follower ? follow.follower.profile_photo : follow.profile_photo,
          created_at: follow.created_at
        };
      }).filter(follower => {
        const followDate = new Date(follower.created_at);
        return followDate > oneWeekAgo;
      });

      setRecentFollowers(recent);
      setHasNewFollowers(recent.length > 0);
    } catch (error) {
      console.error("Erreur lors du chargement des followers récents:", error);
    }
  };

  const dismissFollowerNotification = (followerId) => {
    setRecentFollowers(prev => prev.filter(follower => follower.id !== followerId));
    if (recentFollowers.length <= 1) {
      setHasNewFollowers(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        setProfilePopupOpen(false);
      }
      if (notificationPopupRef.current && !notificationPopupRef.current.contains(event.target)) {
        setNotificationPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setProfilePopupOpen(false);
    navigate('/login');
  };

  const toggleProfilePopup = () => {
    setProfilePopupOpen(!profilePopupOpen);
    setNotificationPopupOpen(false);
  };

  const toggleNotificationPopup = () => {
    setNotificationPopupOpen(!notificationPopupOpen);
    setProfilePopupOpen(false);
  };

  const handleSalesHistory = () => {
    navigate('/mes-ventes');
    setProfilePopupOpen(false);
  };

  const handlePurchaseHistory = () => {
    navigate('/mes-achats');
    setProfilePopupOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.startsWith('@')) {
      navigate(`/search/users?query=${encodeURIComponent(searchQuery.substring(1))}`);
    } else {
      navigate(`/search/items?query=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery('');
  };

  const handleProfile = () => {
    navigate('/profile');
    setProfilePopupOpen(false);
  };

  const handleNotificationsPage = (type) => {
    if (type === 'followers') {
      navigate('/notifications-abonnes');
    } else {
      navigate('/notifications-achats');
    }
    setNotificationPopupOpen(false);
  };

  const renderProfileImage = (size = 5) => {
    if (userProfile?.profile_photo) {
      return (
        <img
          src={`http://localhost:8000/storage/${userProfile.profile_photo}`}
          alt="Profile"
          className={`h-${size} w-${size} rounded-full object-cover`}
        />
      );
    }
    return (
      <div className={`h-${size} w-${size} rounded-full bg-emerald-100 flex items-center justify-center`}>
        <span className="text-emerald-600 text-xs font-medium">
          {userProfile?.first_name?.charAt(0)}{userProfile?.last_name?.charAt(0)}
        </span>
      </div>
    );
  };

  const renderFollowerImage = (follower, size = 8) => {
    if (follower?.profile_photo) {
      return (
        <img
          src={`http://localhost:8000/storage/${follower.profile_photo}`}
          alt={`${follower.first_name} ${follower.last_name}`}
          className={`h-${size} w-${size} rounded-full object-cover`}
        />
      );
    }
    return (
      <div className={`h-${size} w-${size} rounded-full bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-600 text-xs">
          {follower.first_name?.charAt(0)}{follower.last_name?.charAt(0)}
        </span>
      </div>
    );
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const date = new Date(createdAt);
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `il y a ${diffMinutes} min`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `il y a ${hours}h`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `il y a ${days}j`;
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-white py-3 pl-8 pr-8 border-b border-emerald-100 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={navigateToHome}
        >
          <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          <span className="text-emerald-600 font-bold">EcoVestaire</span>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-emerald-600 focus:outline-none">
            <img src={menuOpen ? "/close.png" : "/menu.png"} alt="Menu" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative w-[800px]">
            <input
              type="text"
              placeholder="Recherchez des articles ou @utilisateurs..."
              className="w-full h-[42px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <button type="submit" className="hidden">Search</button>
          </form>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 relative">
                <button
                  className="h-10 w-10 rounded-full flex items-center justify-center relative cursor-pointer"
                  onClick={toggleNotificationPopup}
                >
                  <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5" />
                  {hasNewFollowers && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {recentFollowers.length}
                    </span>
                  )}
                </button>

                {notificationPopupOpen && (
                  <div
                    ref={notificationPopupRef}
                    className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-2 w-80 border border-gray-200 z-50"
                  >
                    <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <div className="flex gap-4">
                        <button
                          className="text-sm text-emerald-600 hover:underline"
                          onClick={() => handleNotificationsPage('followers')}
                        >
                          Abonnés
                        </button>
                        <button
                          className="text-sm text-gray-600 hover:underline"
                          onClick={() => handleNotificationsPage('purchases')}
                        >
                          Achats
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {recentFollowers.length > 0 ? (
                        recentFollowers.map(follower => (
                          <div key={follower.id} className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              {renderFollowerImage(follower)}
                              <div>
                                <p className="text-sm font-medium">{follower.first_name} {follower.last_name}</p>
                                <p className="text-xs text-gray-500">
                                  a commencé à vous suivre {getTimeAgo(follower.created_at)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => dismissFollowerNotification(follower.id)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          AbonnésAchats
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className="text-sm text-gray-600 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => navigate('/favorites')}
                >
                  <img src="/panier.png" alt="Panier Icon" className="h-5 w-5" />
                </button>

                <button
                  className="h-10 w-10 rounded-full flex items-center justify-center relative cursor-pointer"
                  onClick={toggleProfilePopup}
                >
                  {renderProfileImage(10)}
                </button>

                {profilePopupOpen && (
                  <div
                    ref={profilePopupRef}
                    className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-2 w-48 border border-gray-200 z-50"
                  >
                    <button
                      className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2 cursor-pointer"
                      onClick={handleProfile}
                    >
                      {renderProfileImage(5)}
                      Profil
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={handleSalesHistory}
                    >
                      Mes Ventes
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={handlePurchaseHistory}
                    >
                      Mes Achats
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="text-sm text-[#059669] cursor-pointer font-semibold"
                onClick={handleLogin}
              >
                Se Connecter
              </button>
              <button
                className="text-sm text-white bg-[#059669] px-4 py-2 rounded-md cursor-pointer font-semibold"
                onClick={handleSignup}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-white shadow-lg rounded-lg p-4 w-64 flex flex-col items-center gap-3">
          <form onSubmit={handleSearch} className="relative w-full px-4">
            <input
              type="text"
              placeholder="Rechercher articles ou @utilisateurs..."
              className="w-full h-[38px] py-1.5 pl-10 pr-5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src="/search.png" alt="Search Icon" className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <button type="submit" className="hidden">Search</button>
          </form>

          {isLoggedIn ? (
            <>
              <button
                className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2 relative cursor-pointer"
                onClick={() => handleNotificationsPage('followers')}
              >
                <img src="/notification-icon.png" alt="Notification Icon" className="h-5 w-5" />
                Notifications
                {hasNewFollowers && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {recentFollowers.length}
                  </span>
                )}
              </button>
              <button
                className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2"
                onClick={() => navigate('/favorites')}
              >
                <img src="/panier.png" alt="Panier Icon" className="h-5 w-5" />
                Favoris
              </button>
              <button
                className="text-sm text-gray-600 w-full py-2 border border-gray-200 rounded-md flex items-center justify-center gap-2"
                onClick={handleProfile}
              >
                {renderProfileImage(5)}
                Profil
              </button>

              <div className="w-full bg-gray-50 rounded-md p-2">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={handleSalesHistory}
                >
                  Mes Ventes
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={handlePurchaseHistory}
                >
                  Mes Achats
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="text-sm text-[#059669] font-semibold w-full py-2 border border-[#059669] rounded-md"
                onClick={handleLogin}
              >
                Se Connecter
              </button>
              <button
                className="text-sm text-white bg-[#059669] w-full py-2 rounded-md font-semibold"
                onClick={handleSignup}
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default NavbarUser;