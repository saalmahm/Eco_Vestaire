import NavbarUser from "../../components/NavbarUser";

function Followers() {
  return (
    <>
      <NavbarUser />

      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex border-b border-gray-300 mb-6">
            <button className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900">
              Following
            </button>
            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
              Followers
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Following</h1>
            <p className="text-gray-600">You're following 245 people</p>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search following"
              className="w-full py-2.5 px-4 pr-10 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="space-y-4 mr-25 ml-25">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/profile.png"
                  alt="Sarah Williams"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Sarah Williams</div>
                  <div className="text-sm text-gray-500">24 items • 1.2k followers</div>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold">
                Remove follower
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/seller-avatar.png"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Michael Chen</div>
                  <div className="text-sm text-gray-500">58 items • 2.8k followers</div>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold">
                Remove follower
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/alex-avatar.png"
                  alt="Emma Davis"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Emma Davis</div>
                  <div className="text-sm text-gray-500">89 items • 5.6k followers</div>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold">
                Remove follower
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/seller-avatar.png"
                  alt="Alex Thompson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Alex Thompson</div>
                  <div className="text-sm text-gray-500">32 items • 2.8k followers</div>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold">
                Remove follower
              </button>
            </div>

            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <img
                  src="/profile.png"
                  alt="Sophie Martin"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Sophie Martin</div>
                  <div className="text-sm text-gray-500">45 items • 4.1k followers</div>
                </div>
              </div>
              <button className="border border-red-500 text-red-500 text-sm px-4 py-1.5 rounded-md transition-colors cursor-pointer font-semibold">
                Remove follower
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Followers;
