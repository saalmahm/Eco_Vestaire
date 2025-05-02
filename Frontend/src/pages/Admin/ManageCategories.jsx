import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axiosInstance from '../../../axiosConfig';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: new Date().getTime() }
      });
      setCategories(response.data.data);
    } catch (err) {
      setError('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setFormData({ name: '', description: '', icon: null });
    setPreviewImage(null);
    setModalType('add');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: null
    });
    
    if (category.icon) {
      setPreviewImage(`http://localhost:8000/storage/${category.icon}`);
    }
    
    setCategoryToEdit(category);
    setModalType('edit');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'icon' && files?.[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, icon: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (formData.icon) {
        formDataToSend.append('icon', formData.icon);
      }
      
      if (modalType === 'add') {
        await axiosInstance.post('/categories', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axiosInstance.post(`/categories/${categoryToEdit.id}?_method=PUT`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axiosInstance.delete(`/categories/${categoryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeleteModal(false);
      fetchCategories();
    } catch (err) {
      setError('Impossible de supprimer la catégorie');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  if (error && !categories.length) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-16 md:ml-64 p-4">
          <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>
      
      <div className="flex-1 ml-0 md:ml-64 overflow-auto transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-2 left-2 z-30 text-gray-800 focus:outline-none p-2 bg-white rounded-md shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 ml-16 md:ml-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Catégories</h1>
              <p className="text-sm text-gray-600">Gérez toutes vos catégories de vêtements</p>
            </div>
            <button 
              onClick={openAddModal}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md"
            >
              Nouvelle Catégorie
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Aucune catégorie trouvée
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-5 relative">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => openEditModal(category)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L16.586 7a2 2 0 01-2.828 0l-2.829-2.828a2 2 0 010-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => openDeleteModal(category)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {category.icon ? (
                        <img 
                          src={`http://localhost:8000/storage/${category.icon}?t=${new Date().getTime()}`}
                          alt={category.name}
                          className="h-full w-full object-cover"
                          onError={(e) => e.target.src = "/category.png"}
                        />
                      ) : (
                        <img 
                          src="/category.png"
                          alt={category.name}
                          className="h-full w-full object-contain p-1"
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                  </div>
                  {category.description && (
                    <div className="text-sm text-gray-600 mb-3">{category.description}</div>
                  )}
                  <div className="text-sm text-gray-500 mb-3">
                    {category.items_count || 0} articles
                  </div>
                  <div>
                    <span className="px-2 py-1 inline-flex text-xs rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalType === 'add' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icône (Image)
                </label>
                <input
                  type="file"
                  name="icon"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Aperçu" 
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  {modalType === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold">{categoryToDelete?.name}</span> ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;