import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'new',
    category_id: '',
    image: null,
    previewImage: null,
    original_image: null
  });
  const [loading, setLoading] = useState({
    initial: true,
    submitting: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`/items/${id}`),
          axiosInstance.get('/categories')
        ]);

        const articleData = articleRes.data.data || articleRes.data;
        
        setFormData({
          title: articleData.title,
          description: articleData.description,
          price: articleData.price,
          condition: articleData.condition,
          category_id: articleData.category_id,
          image: null,
          previewImage: articleData.image ? 
            `http://localhost:8000/storage/${articleData.image}` : 
            null,
          original_image: articleData.image
        });

        setCategories(categoriesRes.data.data || categoriesRes.data || []);
        setLoading(prev => ({ ...prev, initial: false }));
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de chargement des données");
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchData();
  }, [id]);

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
      formDataToSend.append('_method', 'PUT'); 
      
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
        formDataToSend.append('image_changed', 'true');
      } else {
        formDataToSend.append('image_changed', 'false');
      }
  
      const token = localStorage.getItem('authToken');
      await axiosInstance.post(`/items/${id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem('article_updated', JSON.stringify({
        id: id,
        timestamp: Date.now(),
        image_changed: formData.image instanceof File
      }));
      
      window.location.href = `/article/${id}?updated=true`;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la modification");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (loading.initial) {
    return (
      <>
        <NavbarUser />
        <div className="bg-gray-50 min-h-screen py-12 px-4 mt-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-12 px-4 mt-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Modifier l'article</h1>
            <p className="text-gray-600">Mettez à jour les détails de votre vêtement</p>
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
                        alt="Changer l'image"
                        className="w-10 h-6"
                      />
                    </div>
                    <p className="text-[#059669] font-medium mb-1">Changer l'image</p>
                    <p className="text-sm text-gray-500">PNG, JPG jusqu'à 2MB</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
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
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading.submitting}
                className={`flex-1 ${loading.submitting ? 'bg-gray-400' : 'bg-[#16A34A] hover:bg-[#15803D]'} text-white py-3 rounded-md transition-colors font-medium flex justify-center items-center`}
              >
                {loading.submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : 'Enregistrer les modifications'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/article/${id}`)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditArticle;