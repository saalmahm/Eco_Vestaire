import Sidebar from '../../components/Sidebar';

function ManageCategories() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="bg-gray-50 min-h-screen w-full p-6">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion des Catégories</h1>
              <p className="text-sm text-gray-600">Gérez toutes vos catégories de vêtements</p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors">
              <span>Nouvelle Catégorie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="bg-white rounded-lg shadow-sm p-5 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <img src="/edit-icon.png" alt="Edit" className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <img src="/trash-icon.png" alt="Delete" className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">T-Shirts</h3>
              </div>
              <div className="text-sm text-gray-500 mb-3">124 articles</div>
              <div>
                <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <img src="/edit-icon.png" alt="Edit" className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <img src="/trash-icon.png" alt="Delete" className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Chaussettes</h3>
              </div>
              <div className="text-sm text-gray-500 mb-3">57 articles</div>
              <div>
                <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <img src="/edit-icon.png" alt="Edit" className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <img src="/trash-icon.png" alt="Delete" className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Chapeaux</h3>
              </div>
              <div className="text-sm text-gray-500 mb-3">89 articles</div>
              <div>
                <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <img src="/edit-icon.png" alt="Edit" className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <img src="/trash-icon.png" alt="Delete" className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Chaussures</h3>
              </div>
              <div className="text-sm text-gray-500 mb-3">231 articles</div>
              <div>
                <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <img src="/edit-icon.png" alt="Edit" className="h-5 w-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <img src="/trash-icon.png" alt="Delete" className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Accessoires</h3>
              </div>
              <div className="text-sm text-gray-500 mb-3">167 articles</div>
              <div>
                <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
