import React from 'react';
import Sidebar from '../../components/Sidebar';

function ManageArticles() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar /> 
            <div className="bg-gray-50 min-h-screen p-6 w-full">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Articles Management</h1>
                    <p className="text-sm text-gray-600">Manage all published articles across the platform</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full"> 
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Publisher</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-3">
                                            <img
                                                src="/article.png"
                                                alt="Vintage Denim Jacket"
                                                width={48}
                                                height={48}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Vintage Denim Jacket</div>
                                            <div className="text-sm text-gray-500">$45.00</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                            <img
                                                src="/profile.png"
                                                alt="Sarah Wilson"
                                                width={32}
                                                height={32}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-900">Sarah Wilson</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2023</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Disponible
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-4">
                                        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                            <img src="/view-icon.png" alt="View" className="h-5 w-6" />
                                        </button>
                                        <button className="text-red-400 hover:text-red-600 cursor-pointer">
                                            <img src="/trash-icon.png" alt="Delete" className="h-6 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>

=                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden mr-3">
                                            <img
                                                src="/denim-jacket.png"
                                                alt="Leather Boots"
                                                width={48}
                                                height={48}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">Leather Boots</div>
                                            <div className="text-sm text-gray-500">$69.00</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                                            <img
                                                src="/seller-avatar.png"
                                                alt="Mike Johnson"
                                                width={32}
                                                height={32}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-900">Mike Johnson</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 14, 2023</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        Vendu
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-4">
                                        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                            <img src="/view-icon.png" alt="View" className="h-5 w-6" />
                                        </button>
                                        <button className="text-red-400 hover:text-red-600 cursor-pointer">
                                            <img src="/trash-icon.png" alt="Delete" className="h-6 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageArticles;
