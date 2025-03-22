import NavbarUser from "../../components/NavbarUser";

function PublishArticle() {
  return (
    <>
      <NavbarUser />

      <div className="bg-gray-50 min-h-screen py-12 px-4 mt-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Publier un Article</h1>
            <p className="text-gray-600">Ajoutez les détails de votre vêtement à vendre</p>
          </div>

          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <img
                    src="/publish.png"
                    alt="Télécharger une image"
                    className="w-10 h-6"
                  />
                </div>
                <p className="text-[#059669] font-medium mb-1">Télécharger une image</p>
                <p className="text-sm text-gray-500">PNG, JPG jusqu&apos;à 5MB</p>
              </div>
            </div>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;article
              </label>
              <input
                type="text"
                id="itemName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  État
                </label>
                <select
                  id="condition"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                >
                  <option value="" disabled selected>
                    Sélectionnez l&apos;état
                  </option>
                  <option value="neuf">Neuf avec étiquettes</option>
                  <option value="comme-neuf">Comme neuf</option>
                  <option value="tres-bon">Très bon état</option>
                  <option value="bon">Bon état</option>
                  <option value="satisfaisant">État satisfaisant</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="" disabled selected>
                  Sélectionnez une catégorie
                </option>
                <option value="hauts">Hauts</option>
                <option value="bas">Bas</option>
                <option value="robes">Robes</option>
                <option value="vestes">Vestes et manteaux</option>
                <option value="chaussures">Chaussures</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-3 rounded-md transition-colors font-medium"
            >
              Publier l&apos;article
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PublishArticle;
