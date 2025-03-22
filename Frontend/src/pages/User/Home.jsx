import React from "react";
import NavbarVis from "../../components/NavbarVisit";
import Footer from "../../components/Footer";

function Home() {
  return (
<div className="min-h-screen mt-12">      <NavbarVis />
      <main>
        {/* hero section */}
        <section className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] py-8 flex items-center justify-center">
          <div className="container mx-auto px- md:px-12 lg:px-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-5 md:text-left px-6">
            <h1 className="text-gray-800 font-bold text-4xl md:text-5xl leading-tight max-w-xl">
                Donnez une seconde vie à vos vêtements
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
                Achetez et vendez des vêtements d'occasion de qualité. Économisez et préservez.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <button className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-3 rounded-full transition-all">
                Commencer à vendre
                </button>
                <button className="border border-[#16A34A] text-[#16A34A] hover:bg-green-50 px-6 py-3 rounded-full transition-all">
                Explorer
                </button>
            </div>
            </div>

            <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
              <img
                src="/hero.png"
                alt="Clothes rack"
                className="rounded-lg w-full max-w-md md:max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Category section */}
        <section className="py-8">
        <div className="container mx-auto px-6">
            <h2 className="text-[30px] font-bold text-gray-800 mb-10 w-[339px] h-[36px] mx-auto text-center">
            Parcourir par catégorie
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 justify-center">

            <a href="/categories/haut" className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <img src="/category.png" alt="Haut" className="w-22 h-22 object-cover" />
                <p className="text-gray-700 mt-2 font-medium">Haut</p>
            </a>

            <a href="/categories/chaussures" className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <img src="/category.png" alt="Chaussures" className="w-22 h-22 object-cover" />
                <p className="text-gray-700 mt-2 font-medium">Chaussures</p>
            </a>

            <a href="/categories/accessoires" className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <img src="/category.png" alt="Accessoires" className="w-22 h-22 object-cover" />
                <p className="text-gray-700 mt-2 font-medium">Accessoires</p>
            </a>

            <a href="/categories/manteaux" className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-300">
                <img src="/category.png" alt="Manteaux" className="w-22 h-22 object-cover" />
                <p className="text-gray-700 mt-2 font-medium">Manteaux</p>
            </a>
            </div>
        </div>
        </section>

        {/* Trending Products */}
        <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="text-[30px] font-bold text-gray-800 w-[339px] h-[36px] mx-auto mb-8 text-center">
            Articles tendance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 justify-center">
            
            {/* Produit 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                <img src="/article.png" alt="T-shirt blanc basique" className="w-full h-[256px] object-cover" />
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                    5,00 €
                </span>
                </div>
                <div className="p-4">
                <div className="flex justify-between">
                    <p className="text-gray-800 font-bold">T-shirt blanc basique</p>
                    <p className="text-gray-600">Taille: M</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                    <img src="/profile.png" alt="Marie L." className="w-6 h-6 rounded-full" />
                    <p className="text-gray-600 text-sm">Zahra hm.</p>
                    </div>
                    <button className="flex items-center gap-1 cursor-pointer">
                    <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                    <span className="text-gray-500 text-sm">5</span>
                    </button>
                </div>
                </div>
            </div>

            {/* Produit 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                <img src="/article2.png" alt="Veste en cuir vintage" className="w-full h-[256px] object-cover" />
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                    75,00 €
                </span>
                </div>
                <div className="p-4">
                <div className="flex justify-between">
                    <p className="text-gray-800 font-semibold">Veste en cuir vintage</p>
                    <p className="text-gray-600">Taille: L</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                    <img src="/profile.png" alt="Thomas K." className="w-6 h-6 rounded-full" />
                    <p className="text-gray-600 text-sm">Naima bm.</p>
                    </div>
                    <button className="flex items-center gap-1 cursor-pointer">
                    <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                    <span className="text-gray-500 text-sm">8</span>
                    </button>
                </div>
                </div>
            </div>

            {/* Produit 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                <img src="/article3.png" alt="Sac à main designer" className="w-full h-[256px] object-cover" />
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                    95,00 €
                </span>
                </div>
                <div className="p-4">
                <div className="flex justify-between">
                    <p className="text-gray-800 font-semibold">Sac à main designer</p>
                    <p className="text-gray-600">Taille: Unique</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                    <img src="/profile.png" alt="Camille P." className="w-6 h-6 rounded-full" />
                    <p className="text-gray-600 text-sm">Ihsan fn.</p>
                    </div>
                    <button className="flex items-center gap-1 cursor-pointer">
                    <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                    <span className="text-gray-500 text-sm">12</span>
                    </button>
                </div>
                </div>
            </div>

            {/* Produit 4 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                <img src="/article4.png" alt="Jeans coupe régulière" className="w-full h-[256px] object-cover" />
                <span className="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full">
                    45,00 €
                </span>
                </div>
                <div className="p-4">
                <div className="flex justify-between">
                    <p className="text-gray-800 font-semibold">Jeans coupe régulière</p>
                    <p className="text-gray-600">Taille: 32</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                    <img src="/profile.png" alt="Lucas T." className="w-6 h-6 rounded-full" />
                    <p className="text-gray-600 text-sm">Salma hm.</p>
                    </div>
                    <button className="flex items-center gap-1 cursor-pointer">
                    <img src="/like-article-home.png" alt="Like" className="w-5 h-5" />
                    <span className="text-gray-500 text-sm">3</span>
                    </button>
                </div>
                </div>
            </div>

            </div>
        </div>
        </section>

        {/* How It Works */}
        <section className="py-12">
        <div className="container mx-auto px-4">
            <h2 className="text-[30px] font-bold text-gray-800 w-[339px] h-[36px] mx-auto mb-8 text-center">
            Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="flex flex-col items-center">
                <img src="/photo-icon.png" alt="Prenez en photo" className="w-22px h-22px object-cover mb-4" />
                <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Prenez en photo</h3>  {/* Taille et font ajustées */}
                <p className="text-gray-600 text-center">Photographiez vos vêtements et créez une annonce</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
                <img src="/price-icon.png" alt="Fixez votre prix" className="w-22px h-22px object-cover mb-4" />
                <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Fixez votre prix</h3>  {/* Taille et font ajustées */}
                <p className="text-gray-600 text-center">Définissez le prix pour lequel vous êtes prêt à vendre</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
                <img src="/sell-icon.png" alt="Vendez facilement" className="w-22px h-22px object-cover mb-4" />
                <h3 className="text-gray-800 font-bold text-[16px] mb-2 font-inter">Vendez facilement</h3>  {/* Taille et font ajustées */}
                <p className="text-gray-600 text-center">Recevez votre argent dès que l'acheteur valide</p>
            </div>

            </div>
        </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-[#16A34A] text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">Prêt à donner une seconde vie à vos vêtements ?</h2>
            <p className="mb-6 max-w-2xl mx-auto">Rejoignez notre communauté de vendeurs et acheteurs responsables.</p>
            <button className="bg-white text-[#16A34A] hover:bg-gray-100 px-6 py-2 rounded-full transition-colors font-inter">
            Créer un compte gratuitement   
            </button>
        </div>
        </section>

        {/* footer */}
       <Footer/>
      </main>
    </div>
  );
}

export default Home;