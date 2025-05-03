import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function Profile() {
    const navigate = useNavigate();

    const getItemImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-item.png';

        if (imagePath.startsWith('http')) return imagePath;

        const cleanPath = imagePath.replace(/^\/?storage\//, '');

        return `http://localhost:8000/storage/${cleanPath}`;
    };

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
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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
                        ? `${axiosInstance.defaults.baseURL}/storage/${profileResponse.data.data.profile_photo}`
                        : '/profile.png'
                });

                const itemsResponse = await axiosInstance.get('/profile/items', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                let itemsData = itemsResponse.data.data;

                if (!itemsData && itemsResponse.data) {
                    itemsData = itemsResponse.data;
                }

                if (itemsData && itemsData.data) {
                    itemsData = itemsData.data;
                }

                setUserItems(Array.isArray(itemsData) ? itemsData : []);

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

    // Navigation pour followers/following
    const navigateToFollowers = () => {
        navigate('/followers');
    };

    const navigateToFollowing = () => {
        navigate('/following');
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
                                        e.target.src = '/profile.png';
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
                                            <div
                                                className="text-center cursor-pointer hover:text-[#16A34A] transition-colors"
                                                onClick={navigateToFollowers}
                                            >
                                                <div className="font-bold">{userData.followers_count || 0}</div>
                                                <div className="text-sm text-gray-500">Followers</div>
                                            </div>
                                            <div
                                                className="text-center cursor-pointer hover:text-[#16A34A] transition-colors"
                                                onClick={navigateToFollowing}
                                            >
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
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Mes articles</h2>
                            <button
                                onClick={() => navigate('/publish-article')}
                                className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-md hover:bg-green-600 cursor-pointer hover:scale-105 transform transition-all duration-300"
                            >
                                + Publier un article
                            </button>
                        </div>

                        {loading.items ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {userItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                        onClick={() => navigate(`/article/${item.id}`)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={getItemImageUrl(item.image)}
                                                alt={item.title}
                                                width={400}
                                                height={400}
                                                className="w-full h-64 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder-item.png';
                                                }}
                                            />
                                            <div className="absolute top-2 left-2 flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/edit-article/${item.id}`);
                                                    }}
                                                    className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                                                >
                                                    <img src="/edit-icon.png" alt="Edit" className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setItemToDelete(item.id);
                                                        setShowDeleteAlert(true);
                                                    }}
                                                    className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                                                >
                                                    <img src="/trash-icon.png" alt="Delete" className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="absolute top-2 right-2">
                                                <span className={`bg-green-100 text-xs px-2 py-1 rounded-full ${item.condition === 'new' ? 'bg-green-100 text-green-800' :
                                                    item.condition === 'like_new' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.condition === 'new' ? 'Neuf' :
                                                        item.condition === 'like_new' ? 'Comme neuf' :
                                                            item.condition === 'good' ? 'Bon état' :
                                                                'Occasion'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium">{item.title}</h3>
                                                <span className="text-green-600 font-bold">{item.price}€</span>
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-1">
                                                    <img
                                                        src="/heart-icon.png"
                                                        alt="Like"
                                                        className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer"
                                                    />
                                                    <span className="text-xs text-gray-500">{item.favorites_count || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <img
                                                        src="/message-icon.png"
                                                        alt="Comments"
                                                        className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                                                    />
                                                    <span className="text-xs text-gray-500">{item.comments_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Alert */}
                {showDeleteAlert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
                        <div
                            id="alert-additional-content-2"
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
                                Êtes-vous sûr de vouloir supprimer cet article ? <br />
                                Cette action est irréversible.
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('authToken');
                                            await axiosInstance.delete(`/items/${itemToDelete}`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            });

                                            window.location.href = '/profile';

                                        } catch (err) {
                                            setError(err.response?.data?.message || err.message || 'Échec de la suppression');
                                            setShowDeleteAlert(false);
                                            setItemToDelete(null);
                                        }
                                    }}
                                >
                                    <svg className="me-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 14">
                                        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                    </svg>
                                    Confirmer
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-red-700 border border-red-500 rounded-lg hover:bg-red-100"
                                    onClick={() => {
                                        setShowDeleteAlert(false);
                                        setItemToDelete(null);
                                    }}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;