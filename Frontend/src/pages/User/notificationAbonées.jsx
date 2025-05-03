import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function NotificationAbonnées() {
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

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
    }, [navigate]);
    
    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
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

    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-10">
                <div className="max-w-full mx-auto">
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>

                        <div className="flex border-b border-gray-300 mb-4">
                            <button
                                className="pb-4 px-6 font-medium border-b-2 text-gray-600 border-transparent hover:text-gray-900"
                                onClick={() => navigate('/notifications-achats')}
                            >
                                Demandes d'achats
                            </button>
                            <button
                                className="pb-4 px-6 font-medium border-b-2 text-green-500 border-green-500"
                            >
                                Nouveaux abonnés
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 md:mx-8 mb-4">
                                    {error}
                                </div>
                            )}

                            {followers.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm mx-4 md:mx-8">
                                    <p className="text-gray-600">Vous n'avez pas encore d'abonnés.</p>
                                </div>
                            ) : (
                                followers.map(follower => (
                                    <div key={follower.id} className="bg-white rounded-lg shadow-sm p-4 my-4 mx-4 md:mx-8">
                                        <div className="flex items-start">
                                            <img
                                                src={follower.profile_photo ?
                                                    `http://localhost:8000/storage/${follower.profile_photo}` :
                                                    '/profile.png'}
                                                alt={`${follower.first_name || ''} ${follower.last_name || ''}`}
                                                className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer"
                                                onClick={() => navigate(`/user-profile/${follower.id}`)}
                                                onError={(e) => {
                                                    e.target.src = '/profile.png';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div 
                                                            className="font-medium cursor-pointer hover:text-green-600"
                                                            onClick={() => navigate(`/user-profile/${follower.id}`)}
                                                        >
                                                            {follower.first_name || ''} {follower.last_name || ''}
                                                        </div>
                                                        <div className="text-sm text-gray-500">a commencé à vous suivre</div>
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {formatTimeAgo(follower.pivot?.created_at || follower.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <div className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Abonné
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default NotificationAbonnées;