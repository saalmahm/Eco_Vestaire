import React from "react";
import NavbarVis from "../../components/NavbarVisit";

function Home() {
  return (
    <div className="min-h-screen">
      <NavbarVis />
      {/* hero section */}
      <main>
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
      </main>
    </div>
  );
}

export default Home;
