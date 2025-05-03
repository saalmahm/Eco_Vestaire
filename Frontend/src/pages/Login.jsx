import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/login', formData);
      console.log('Login successful:', response.data);
      
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      
      switch(response.data.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'buyer_seller':
          navigate('/profile');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      setError(error.response?.data?.message || 'Échec de la connexion');
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  // Mobile Design
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Green header with specified height and color */}
        <div 
          className="rounded-b-3xl pt-12 pb-20 px-4"
          style={{ 
            backgroundColor: '#059669',
            height: '300px'
          }}
        >
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <img 
                src="/bg-auth.png" 
                alt="Background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-3xl font-bold mb-2">SecondHand</h1>
              <p className="text-sm">Achetez et vendez des vêtements d'occasion</p>
            </div>
          </div>
        </div>

        {/* White form card */}
        <div className="px-4 -mt-10">
          <div className="max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Connexion</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    ✉
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                  Mot de passe oublié?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Se connecter
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Pas encore de compte?{' '}
              <span 
                onClick={goToSignup}
                className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
              >
                S'inscrire
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Design (original)
  return (
    <div className="flex h-screen w-full bg-white border-2 border-gray-300">
      <div className="w-1/2 min-h-screen bg-cover bg-center relative bg-[url('/bg-auth.png')]">
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-10">
          <h2 className="text-3xl font-bold text-white">Welcome to EcoVestaire</h2>
          <p className="text-lg text-white mt-2">
            Donnez une seconde vie à vos vêtements et découvrez des trésors mode à prix abordables.
          </p>
        </div>
      </div>

      <div className="w-1/2 flex flex-col justify-center px-16">
        <div className="text-center mb-8">
          <img src="/logo-auth.png" alt="Logo auth" className="mx-auto w-10 h-10" />
          <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
          <p className="text-gray-600 text-base">Bienvenue sur notre plateforme de mode durable</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@mail.com"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Vous n'avez pas de compte ?
          <span 
            onClick={goToSignup} 
            className="text-emerald-600 font-medium cursor-pointer hover:underline ml-1">
            S'inscrire
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;