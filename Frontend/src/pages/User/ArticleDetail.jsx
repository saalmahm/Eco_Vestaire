import NavbarVis from "../../components/NavbarVisit";

function ArticleDetail() {
  return (
    <div className="min-h-screen">
      <NavbarVis />
      <div className="bg-gray-50 py-8 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative mb-6 md:mb-0">
                <img
                  src="/denim-jacket.png"
                  alt="Vintage Levi's Denim Jacket"
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#16A34A] text-white text-sm px-3 py-1 rounded-full">
                    Available
                  </span>
                </div>
              </div>

              <div className="md:w-1/2 p-6 md:p-8">
                <div className="text-[#16A34A] font-medium mb-1">Vintage Collection</div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Vintage Levi's Denim Jacket
                </h1>
                <div className="text-[#16A34A] text-2xl font-bold mb-4">$89.99</div>

                <div className="flex items-center mb-4">
                  <img
                    src="/seller-avatar.png"
                    alt="Monir Khan"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">Monir Khan</div>
                    <div className="text-sm text-gray-500">Posted 2 days ago</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  Authentic vintage Levi's denim jacket from the 90s. In excellent condition with minimal wear.
                  Perfect for any casual outfit. Size M, slightly oversized fit.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button className="bg-[#16A34A] hover:bg-[#16A34A] text-white py-3 px-4 rounded-md flex-1 transition-colors">
                    Buy Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 hover:border-[#16A34A] hover:text-[#16A34A] py-3 px-4 rounded-md flex-1 transition-colors">
                    Add to Favorites
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/heart-icon.png"
                      alt="Heart Icon"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">245 likes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/message-icon.png"
                      alt="Message Icon"
                      className="h-5 w-5 text-gray-500"
                    />
                    <span className="text-gray-600">18 comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Comments</h2>

            <div className="flex gap-3 mb-8">
              <img src="/profile.png" alt="Your avatar" width={40} height={40} className="w-10 h-10 rounded-full" />
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:border-[#16A34A]"
              />
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <img
                  src="/alex-avatar.png"
                  alt="Alex Thompson"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">Alex Thompson</span>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                  <p className="text-gray-700">Is this still available? Love the vintage look!</p>
                </div>
              </div>

              <div className="flex gap-3">
                <img
                  src="/emma-avatar.png"
                  alt="Emma Wilson"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">Emma Wilson</span>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-gray-700">Could you provide measurements for the chest and length?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
