import NavbarUser from "../../components/NavbarUser";

function Favorites() {
  return (
    <>
      <NavbarUser/>
      <div className="bg-gray-50 min-h-screen py-8 px-8 md:px-16 w-full">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Favoris</h1>
            <p className="text-sm text-gray-500">2 articles</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-5 w-full">
              <div className="flex items-center">
                <div className="w-28 h-28 bg-gray-100 rounded overflow-hidden mr-6">
                  <img
                    src="/sneakers.png"
                    alt="Veste en Jean Vintage"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Veste en Jean Vintage
                      </h3>
                      <p className="text-sm text-green-600 mb-1">Très bon état</p>
                      <p className="font-bold text-gray-900 mb-2">45,00 €</p>
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-green-500">Disponible</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <button className="text-red-500 hover:text-red-600 mb-2 self-end">
                        <img src="/trash-icon.png" alt="Supprimer" className="w-5 h-5" />
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-md transition block w-full text-center mt-8">
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 w-full">
              <div className="flex items-center">
                <div className="w-28 h-28 bg-gray-100 rounded overflow-hidden mr-6">
                  <img
                    src="/evening-dress.png"
                    alt="Sneakers Blanches"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Sneakers Blanches
                      </h3>
                      <p className="text-sm text-green-600 mb-1">Bon état</p>
                      <p className="font-bold text-gray-900 mb-2">35,00 €</p>
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm text-yellow-500">Réservé</span>
                        </div>
                    </div>

               <div className="flex flex-col items-center">
                      <button className="text-red-500 hover:text-red-600 mb-2 self-end">
                        <img src="/trash-icon.png" alt="Supprimer" className="w-5 h-5" />
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-md transition block w-full text-center mt-8">
                        Acheter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Favorites;
