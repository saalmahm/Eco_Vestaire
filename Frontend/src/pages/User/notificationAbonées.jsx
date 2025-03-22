import NavbarUser from "../../components/NavbarUser";

function NotificationAbonnées() {
    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-10">
                <div className="max-w-full mx-auto">
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>

                        <div className="flex border-b border-gray-300 mb-4">
                            <button className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900">
                                Demandes d&apos;achats
                            </button>
                            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
                                Nouveaux abonnés
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div>
                            <div className="py-4 flex flex-col sm:flex-row sm:gap-4">
                                <div className="flex items-center bg-white p-4 rounded-lg shadow-md sm:w-1/2 w-full mb-4 sm:mb-0">
                                    <img
                                        src="/profile.png"
                                        alt="Sophie Bernard"
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <div className="font-medium">Sophie Bernard</div>
                                        <div className="text-sm text-gray-500">Abonnée depuis 2 mois</div>
                                    </div>
                                    <button className="ml-auto flex items-center text-gray-600 text-sm hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                        <img
                                            src="abonee.png"
                                            alt="Icon"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Abonné
                                    </button>
                                </div>

                                <div className="flex items-center bg-white p-4 rounded-lg shadow-md sm:w-1/2 w-full">
                                    <img
                                        src="/profile.png"
                                        alt="Emma Dubois"
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <div className="font-medium">Emma Dubois</div>
                                        <div className="text-sm text-gray-500">Abonnée depuis 5 mois</div>
                                    </div>
                                    <button className="ml-auto flex items-center text-gray-600 text-sm hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                        <img
                                            src="abonee.png"
                                            alt="Icon"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Abonné
                                    </button>
                                </div>
                            </div>

                            <div className="py-4 flex flex-col sm:flex-row sm:gap-4">
                                <div className="flex items-center bg-white p-4 rounded-lg shadow-md sm:w-1/2 w-full mb-4 sm:mb-0">
                                    <img
                                        src="/profile.png"
                                        alt="Lucas Petit"
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <div className="font-medium">Lucas Petit</div>
                                        <div className="text-sm text-gray-500">Abonné depuis 1 semaine</div>
                                    </div>
                                    <button className="ml-auto flex items-center text-gray-600 text-sm hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                        <img
                                            src="abonee.png"
                                            alt="Icon"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Abonné
                                    </button>
                                </div>

                                <div className="flex items-center bg-white p-4 rounded-lg shadow-md sm:w-1/2 w-full">
                                    <img
                                        src="/profile.png"
                                        alt="Hugo Moreau"
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <div className="font-medium">Hugo Moreau</div>
                                        <div className="text-sm text-gray-500">Abonné depuis 3 mois</div>
                                    </div>
                                    <button className="ml-auto flex items-center text-gray-600 text-sm hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                                        <img
                                            src="abonee.png"
                                            alt="Icon"
                                            className="w-4 h-4 mr-2"
                                        />
                                        Abonné
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationAbonnées;
