import NavbarUser from "../../components/NavbarUser";

function NotificationAchats() {
    return (
        <>
            <NavbarUser />
            <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
                <div className="max-w-full mx-auto">
                    <div className="p-6 pb-0">
                        <h1 className="text-xl font-bold text-gray-900 mb-6">Notifications</h1>

                        <div className="flex border-b border-gray-300">
                            <button className="pb-4 px-6 text-green-500 font-medium border-b-2 border-green-500">
                                Demandes d&apos;achats
                            </button>
                            <button className="pb-4 px-6 text-gray-600 font-medium border-b-2 border-transparent hover:text-gray-900">
                                Nouveaux abonnés
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 my-4 mx-4 md:mx-8">
                        <div className="flex items-start mb-4">
                            <img
                                src="/profile.png"
                                alt="Marie Dubois"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">Marie Dubois</div>
                                        <div className="text-sm text-gray-500">souhaite acheter votre article</div>
                                    </div>
                                    <div className="text-sm text-gray-400">il y a 2h</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                    src="/denim-jacket.png"
                                    alt="Pull vintage vert"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium">Pull vintage vert</div>
                                <div className="text-green-600 font-medium">25,00 €</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#16A34A] hover:bg-green-600 text-white py-2 rounded transition-colors">
                                Accepter
                            </button>
                            <button className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 py-2 rounded transition-colors">
                                Refuser
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 mx-4 md:mx-8">
                        <div className="flex items-start mb-4">
                            <img
                                src="/profile.png"
                                alt="Thomas Martin"
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium">Thomas Martin</div>
                                        <div className="text-sm text-gray-500">souhaite acheter votre article</div>
                                    </div>
                                    <div className="text-sm text-gray-400">il y a 5h</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-3">
                                <img
                                    src="/sneakers.png"
                                    alt="Robe verte d'été"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium">Robe verte d&apos;été</div>
                                <div className="text-green-600 font-medium">35,00 €</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#16A34A] hover:bg-green-600 text-white py-2 rounded transition-colors">
                                Accepter
                            </button>
                            <button className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 py-2 rounded transition-colors">
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationAchats;
