import NavbarUser from "../../components/NavbarUser";

function Profile() {
  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src="/profile.png"
                alt="Salma Hamdi"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover"
              />

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-xl font-bold">Salma Hamdi</h1>
                  <button className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-md hover:bg-green-600 cursor-pointer transition-colors">
                    Modifier le profil
                  </button>
                </div>

                <div className="flex justify-center sm:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold">245</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">1.2k</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">584</div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>

                <p className="text-gray-700">
                  Passionate about sustainable fashion. Selling pre-loved clothes in great condition.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Mes articles</h2>
            <button className="bg-[#16A34A] text-white text-sm px-4 py-1 rounded-md hover:bg-green-600 cursor-pointer hover:scale-105 transform transition-all duration-300">
              + Publier un article
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Card Article 1 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
              <div className="relative">
                <img
                  src="/denim-jacket.png"
                  alt="Vintage Denim Jacket"
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                {/* Icons in the top left */}
                <div className="absolute top-2 left-2 flex gap-2">
                  <img
                    src="/edit-icon.png"
                    alt="Edit"
                    className="h-5 w-5 cursor-pointer"
                  />
                  <img
                    src="/trashs.png"
                    alt="Delete"
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Vintage Denim Jacket</h3>
                  <span className="text-green-600 font-bold">45€</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Classic denim jacket, size M, barely worn. Perfect for spring!
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <img src="/heart-icon.png" alt="Like" className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">124</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/message-icon.png" alt="Comments" className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">18</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Article 2 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
              <div className="relative">
                <img
                  src="/evening-dress.png"
                  alt="Evening Dress"
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                {/* Icons in the top left */}
                <div className="absolute top-2 left-2 flex gap-2">
                  <img
                    src="/edit-icon.png"
                    alt="Edit"
                    className="h-5 w-5 cursor-pointer"
                  />
                  <img
                    src="/trashs.png"
                    alt="Delete"
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Evening Dress</h3>
                  <span className="text-green-600 font-bold">75€</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Elegant black dress, perfect for special occasions. Size S.
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <img src="/heart-icon.png" alt="Like" className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">89</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/message-icon.png" alt="Comments" className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">12</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Article 3 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
              <div className="relative">
                <img
                  src="/sneakers.png"
                  alt="Sneakers"
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                {/* Icons in the top left */}
                <div className="absolute top-2 left-2 flex gap-2">
                  <img
                    src="/edit-icon.png"  
                    alt="Edit"
                    className="h-5 w-5 cursor-pointer"
                  />
                  <img
                    src="/trashs.png"   
                    alt="Delete"
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Sneakers</h3>
                  <span className="text-green-600 font-bold">35€</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Comfortable sneakers, size 39, worn only twice.
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <img src="/heart-icon.png" alt="Like" className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">156</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src="/message-icon.png" alt="Comments" className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors duration-300 cursor-pointer" />
                    <span className="text-xs text-gray-500">24</span>
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

export default Profile;
