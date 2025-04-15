import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function NotificationAbonnées() {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axiosInstance.get('/followers', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                let followersData = [];
                if (response.data.data) {
                    followersData = response.data.data.data || response.data.data;
                }
                
                setFollowers(Array.isArray(followersData) ? followersData : []);
                setError(null);
            } catch (err) {
                console.error("Error fetching followers:", err);
                setError("Erreur lors du chargement des abonnés.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, []);
    
    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const followDate = new Date(createdAt);
        const diffTime = Math.abs(now - followDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `Abonné(e) depuis ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
            }
            return `Abonné(e) depuis ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `Abonné(e) depuis ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `Abonné(e) depuis ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `Abonné(e) depuis ${months} mois`;
        }
    };

    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-14">
                <div className="max-w-4xl mx-auto">
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>

                        <div className="flex border-b border-gray-300 mb-6">
                            <Link to="/notifications-achats" className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900">
                                Demandes d'achats
                            </Link>
                            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
                                Nouveaux abonnés
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                                {error}
                            </div>
                        ) : followers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Vous n'avez pas encore d'abonnés.
                            </div>
                        ) : (
                            <div>
                                {Array(Math.ceil(followers.length / 2)).fill().map((_, rowIndex) => (
                                    <div key={rowIndex} className="py-4 flex flex-col sm:flex-row sm:gap-4">
                                        {followers.slice(rowIndex * 2, rowIndex * 2 + 2).map((follower, index) => {
                                            const followerId = follower.id;
                                            const firstName = follower.first_name;
                                            const lastName = follower.last_name;
                                            const profilePhoto = follower.profile_photo;
                                            const createdAt = follower.pivot?.created_at || follower.created_at;
                                            
                                            return (
                                                <div key={followerId} className={`flex items-center bg-white p-4 rounded-lg shadow-md sm:w-1/2 w-full ${
                                                    rowIndex * 2 + index < followers.length - 1 && index === 0 ? "mb-4 sm:mb-0" : ""
                                                }`}>
                                                    <Link to={`/user-profile/${followerId}`}>
                                                        {profilePhoto ? (
                                                            <img
                                                                src={`http://localhost:8000/storage/${profilePhoto}`}
                                                                alt={`${firstName} ${lastName}`}
                                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/profile.png';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/profile.png"
                                                                alt={`${firstName} ${lastName}`}
                                                                className="w-10 h-10 rounded-full object-cover mr-3"
                                                            />
                                                        )}
                                                    </Link>
                                                    <div>
                                                        <Link to={`/user-profile/${followerId}`} className="font-medium hover:text-green-500 transition-colors">
                                                            {firstName} {lastName}
                                                        </Link>
                                                        <div className="text-sm text-gray-500">
                                                            {getTimeAgo(createdAt)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-auto flex items-center text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Abonné
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {rowIndex * 2 + 1 >= followers.length && (
                                            <div className="sm:w-1/2 hidden sm:block"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationAbonnées;