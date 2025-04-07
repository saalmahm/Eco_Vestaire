import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function PublishArticle() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'new',
    category_id: '',
    image: null,
    previewImage: null
  });
  const [loading, setLoading] = useState({
    categories: true,
    submitting: false
  });
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data.data);
        setLoading(prev => ({ ...prev, categories: false }));
      } catch (err) {
        setError("Erreur de chargement des catégories");
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('image', formData.image);

      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.post('/items', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/article/${response.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la publication");
      console.error('Publication error:', err);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-12 px-4 mt-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Publier un Article</h1>
            <p className="text-gray-600">Ajoutez les détails de votre vêtement à vendre</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image de l'article
              </label>
              <label className="block border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
                {formData.previewImage ? (
                  <img 
                    src={formData.previewImage} 
                    alt="Preview" 
                    className="mx-auto h-40 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <img
                        src="/publish.png"
                        alt="Télécharger une image"
                        className="w-10 h-6"
                      />
                    </div>
                    <p className="text-[#059669] font-medium mb-1">Télécharger une image</p>
                    <p className="text-sm text-gray-500">PNG, JPG jusqu'à 2MB</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'article
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  État
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                  required
                >
                  <option value="new">Neuf avec étiquettes</option>
                  <option value="like_new">Comme neuf</option>
                  <option value="good">Très bon état</option>
                  <option value="fair">Bon état</option>
                  <option value="poor">État satisfaisant</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                required
                disabled={loading.categories}
              >
                <option value="">{loading.categories ? 'Chargement...' : 'Sélectionnez une catégorie'}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading.submitting || loading.categories}
              className={`w-full ${loading.submitting ? 'bg-gray-400' : 'bg-[#16A34A] hover:bg-[#15803D]'} text-white py-3 rounded-md transition-colors font-medium flex justify-center items-center`}
            >
              {loading.submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publication...
                </>
              ) : 'Publier l\'article'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PublishArticle;