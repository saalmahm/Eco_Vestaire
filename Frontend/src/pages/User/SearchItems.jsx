import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from '../../../axiosConfig';
import Navbar from "../../components/NavbarUser";
import Footer from "../../components/Footer";

function SearchItems() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/items/search?query=${encodeURIComponent(searchQuery)}`);
                setItems(response.data.data.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError("Une erreur est survenue lors de la recherche.");
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchSearchResults();
        } else {
            setItems([]);
            setLoading(false);
        }
    }, [searchQuery]);

    const renderConditionBadge = (condition) => {
        const conditionLabels = {
            new: 'Neuf',
            like_new: 'Comme neuf',
            good: 'Bon état',
            fair: 'État correct',
            poor: 'État moyen'
        };

        const conditionLabel = conditionLabels[condition] || condition;

        return (
            <span className="bg-gray-100 text-xs px-2 py-1 rounded text-gray-700">
                {conditionLabel}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 mt-24 mb-10 flex-grow">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Résultats de recherche pour: <span className="text-green-600">"{searchQuery}"</span>
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Erreur! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-10 rounded relative text-center">
                        <p className="text-lg">Aucun résultat trouvé pour "{searchQuery}"</p>
                        <p className="mt-2 text-gray-600">Essayez avec d'autres mots-clés ou vérifiez l'orthographe.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                                <a href={`/article/${item.id}`}>
                                    <div className="relative pb-[100%]">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:8000/storage/${item.image}`}
                                                alt={item.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800 mb-1 truncate">{item.title}</h3>
                                        <p className="text-green-600 font-bold">{item.price} €</p>

                                        <div className="mt-2 flex items-center justify-between">
                                            {renderConditionBadge(item.condition)}

                                            {item.category && (
                                                <span className="text-xs text-gray-500">
                                                    {item.category.name}
                                                </span>
                                            )}
                                        </div>

                                        {item.seller && (
                                            <div className="mt-3 flex items-center">
                                                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                                    <span className="text-green-600 text-xs font-medium">
                                                        {item.seller.first_name?.charAt(0)}{item.seller.last_name?.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {item.seller.first_name} {item.seller.last_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default SearchItems;