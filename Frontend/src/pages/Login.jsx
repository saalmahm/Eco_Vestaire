import React from "react";

function Login() {
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

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="votre@mail.com" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" placeholder="••••••••" className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg cursor-pointer">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Vous n'avez pas de compte ? <span className="text-emerald-600 font-medium cursor-pointer">S'inscrire</span>
        </p>
      </div>
    </div>
  );
}

export default Login;