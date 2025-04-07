import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";
const getProfileImageUrl = (path) => {
  if (!path) return '/profile.png'; // Image par défaut
  if (path.startsWith('http')) return path; // Si URL complète déjà
  return `/storage/${path}`; // Chemin relatif vers le storage Laravel
};
function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [loading, setLoading] = useState({
        profile: true,
        items: true
    });
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        profile_photo: null,
        previewImage: null
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch profile data
                const profileResponse = await axiosInstance.get('/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserData(profileResponse.data.data);
                setFormData({
                    first_name: profileResponse.data.data.first_name,
                    last_name: profileResponse.data.data.last_name,
                    email: profileResponse.data.data.email,
                    profile_photo: null,
                    previewImage: profileResponse.data.data.profile_photo 
                        ? `/storage/${profileResponse.data.data.profile_photo}` 
                        : null
                });

                // Fetch user items
                const itemsResponse = await axiosInstance.get('/profile/items', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserItems(itemsResponse.data.data);
                
                setLoading({ profile: false, items: false });
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch data');
                console.error('Error:', err);
                setLoading({ profile: false, items: false });
            }
        };

        fetchData();
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                profile_photo: file,
                previewImage: URL.createObjectURL(file)
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('first_name', formData.first_name);
            formDataToSend.append('last_name', formData.last_name);
            formDataToSend.append('email', formData.email);
            if (formData.profile_photo) {
                formDataToSend.append('profile_photo', formData.profile_photo);
            }

            const response = await axiosInstance.post('/profile', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUserData(response.data.data);
            setEditMode(false);
            setFormData({
                ...formData,
                previewImage: response.data.data.profile_photo 
                    ? `/storage/${response.data.data.profile_photo}` 
                    : null
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update failed');
            console.error('Update error:', err);
        }
    };

    if (loading.profile) {
        return (
            <>
                <NavbarUser />
                <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-14 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavbarUser />
                <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-14 flex justify-center items-center">
                    <div className="text-red-500 text-center max-w-md bg-white p-6 rounded-lg shadow">
                        <p className="font-bold text-lg mb-2">Error</p>
                        <p className="mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-14">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative">
                            <img
                              src={userData.profile_photo 
                                ? `http://localhost:8000/storage/${userData.profile_photo}`
                                : '/profile.png'
                              }
                              alt={`${userData.first_name} ${userData.last_name}`}
                              className="w-24 h-24 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = '/profile.png'; // Fallback si l'image ne charge pas
                                console.error("Erreur de chargement de l'image:", e.target.src);
                              }}
                            />
                                {editMode && (
                                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </label>
                                )}
                            </div>

                            <div className="flex-1">
                                {editMode ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    required
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                type="submit" 
                                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                            >
                                                Save Changes
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => setEditMode(false)}
                                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                            <h1 className="text-xl font-bold">
                                                {userData.first_name} {userData.last_name}
                                            </h1>
                                            <button 
                                                onClick={() => setEditMode(true)}
                                                className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-md hover:bg-green-600 cursor-pointer transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                        <p className="text-gray-600 mb-4">{userData.email}</p>
                                        <div className="flex justify-center sm:justify-start gap-6">
                                            <div className="text-center">
                                                <div className="font-bold">{userData.items_count || 0}</div>
                                                <div className="text-sm text-gray-500">Items</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold">{userData.followers_count || 0}</div>
                                                <div className="text-sm text-gray-500">Followers</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold">{userData.following_count || 0}</div>
                                                <div className="text-sm text-gray-500">Following</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Items Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">My Items</h2>
                        <button 
                            onClick={() => navigate('/items/create')}
                            className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-md hover:bg-green-600 cursor-pointer hover:scale-105 transform transition-all duration-300"
                        >
                            + Add New Item
                        </button>
                    </div>

                    {loading.items ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : userItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userItems.map(item => (
                                <div key={item.id} 
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    onClick={() => navigate(`/items/${item.id}`)}
                                >
                                    <div className="relative h-48">
                                    <img
                                      src={formData.previewImage 
                                          ? (typeof formData.previewImage === 'string' 
                                              ? `${axiosInstance.defaults.baseURL}/storage/${formData.previewImage}`
                                              : URL.createObjectURL(formData.previewImage))
                                          : '/profile.png'
                                      }
                                      alt={`${formData.first_name} ${formData.last_name}`}
                                      className="w-24 h-24 rounded-full object-cover"
                                  />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                item.condition === 'new' ? 'bg-green-100 text-green-800' :
                                                item.condition === 'used' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.condition}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <span className="text-emerald-600 font-bold">{item.price}€</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span>{item.favorites_count || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    <span>{item.comments_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
                            <button 
                                onClick={() => navigate('/items/create')}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                            >
                                List Your First Item
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;