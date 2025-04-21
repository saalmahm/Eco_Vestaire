function Footer(){
    return(
<>
<footer className="bg-[#1F2937] text-white py-10">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8  ml-12">
            <div>
                <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="EcoVestaire" className="h-8 w-8" />
                <span className="text-[#16A34A] font-bold">EcoVestaire</span>
                </div>
                <p className="text-[#D1D5DB] text-sm font-inter">
                La plateforme de mode durable et <br />
                <span className="font-inter font-medium">responsable</span>
                </p>
            </div>
            <div>
                <h3 className="font-semibold mb-3 text-white text-2xl">Liens rapides</h3>
                <ul className="space-y-2 text-sm text-emerald-100">
                <li><a href="/about" className="hover:text-white">À propos</a></li>
                <li><a href="/how-it-works" className="hover:text-white">Comment ça marche</a></li>
                <li><a href="/community" className="hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="/blog" className="hover:text-white">Politique de confidentialité</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold mb-3 text-white text-2xl">Catégories</h3>
                <ul className="space-y-2 text-sm text-emerald-100">
                <li><a href="/women" className="hover:text-white">Femmes</a></li>
                <li><a href="/men" className="hover:text-white">Hommes</a></li>
                <li><a href="/kids" className="hover:text-white">Enfants</a></li>
                <li><a href="/accessories" className="hover:text-white">Accessoires</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-semibold mb-3 text-white text-2xl">Suivez-nous</h3>
                <div className="flex gap-3">
                <img src="/facebook-icon.png" alt="Facebook" className="h-6 w-6 cursor-pointer" />
                <img src="/instagram-icon.png" alt="Instagram" className="h-6 w-6 cursor-pointer" />
                <img src="/twitter-icon.png" alt="Twitter" className="h-6 w-6 cursor-pointer" />
                <img src="/youtube-icon.png" alt="YouTube" className="h-6 w-6 cursor-pointer" />
                </div>
            </div>
            </div>
            <div className="pt-6 border-t border-[#374151] text-sm text-emerald-100 text-center">
            © 2023 EcoVestaire. Tous droits réservés.
            </div>
        </div>
        </footer>

</>
    )
}
export default Footer;