import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-white border-2 border-gray-300">
      <div className="w-1/2 flex flex-col justify-center px-16">
        <div className="text-center mb-8">
          <img src="/logo-auth.png" alt="Logo auth" className="mx-auto w-10 h-10" />
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-gray-600 text-base">Start your sustainable fashion journey today</p>
        </div>

        <form className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" placeholder="Salma" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" placeholder="Hamdi" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" placeholder="••••••••" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <img src="/upload-icon.png" alt="Upload Icon" className="w-10" />
              </div>
              <button type="button" className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700 cursor-pointer">
                Upload Image
              </button>
              <input type="file" style={{ display: 'none' }} accept="image/*" />
            </div>
          </div>


          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg cursor-pointer">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? 
          <span 
            onClick={goToLogin} 
            className="text-emerald-600 font-medium cursor-pointer">
            Sign in
          </span>
        </p>
      </div>

      <div className="w-1/2 min-h-screen bg-cover bg-center relative bg-[url('/bg-auth.png')]">
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-10">
          <h2 className="text-3xl font-bold text-white">Welcome to EcoVestaire</h2>
          <p className="text-lg text-white mt-2">
            Donnez une seconde vie à vos vêtements et découvrez des trésors mode à prix abordables.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;