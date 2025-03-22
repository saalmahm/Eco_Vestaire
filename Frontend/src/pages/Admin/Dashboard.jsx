import React from 'react';
import Sidebar from '../../components/Sidebar';

function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-grow h-screen overflow-auto bg-gray-50 p-6">
                <div className="w-full">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Tableau de Bord</h1>
                        <p className="text-sm text-gray-600">Vue d&apos;ensemble des statistiques</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Utilisateurs Actifs</div>
                                    <div className="text-2xl font-bold text-gray-900">2,451</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">+12% ce mois</div>
                                </div>
                                <img src="/users-icon.png" alt="Utilisateurs Actifs" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Articles Publiés</div>
                                    <div className="text-2xl font-bold text-gray-900">8,749</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">+8% ce mois</div>
                                </div>
                                <img src="/bags-icon.png" alt="Articles Publiés" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Ventes Réalisées</div>
                                    <div className="text-2xl font-bold text-gray-900">3,824</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">+15% ce mois</div>
                                </div>
                                <img src="/carts-icon.png" alt="Ventes Réalisées" className="h-10 w-10" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 mb-1">Commentaires</div>
                                    <div className="text-2xl font-bold text-gray-900">12,921</div>
                                    <div className="text-xs font-medium text-green-600 mt-1">+16% ce mois</div>
                                </div>
                                <img src="/comments-icon.png" alt="Commentaires" className="h-10 w-10" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Activité Utilisateurs</h3>
                            <div className="flex items-center justify-center h-48">
                                <img src="/line-chart.png" alt="Activité Utilisateurs" className="h-24 w-24" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Ventes Mensuelles</h3>
                            <div className="flex items-center justify-center h-48">
                                <img src="/barr-chart.png" alt="Ventes Mensuelles" className="h-24 w-24" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Catégories Populaires</h3>
                            <div className="flex items-center justify-center h-48">
                                <img src="/pie-chart.png" alt="Catégories Populaires" className="h-24 w-24" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5">
                            <h3 className="font-medium text-gray-800 mb-6">Engagement Utilisateurs</h3>
                            <div className="flex items-center justify-center h-48">
                                <img src="/lline-chart.png" alt="Engagement Utilisateurs" className="h-24 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
