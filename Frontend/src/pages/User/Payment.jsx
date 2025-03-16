import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NavbarUser from "../../components/NavbarUser";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

// clé publique stripe
const stripePromise = loadStripe('pk_test_51R0Pf2BVXQv9uhUbsjBHE7k7Yq14GLGnBQaQ0OnqubxUNydTrg91G708dNOYCmGByC98zKRVNdT9jMpV1aVYoj9A00dAYvWh0H');

function CheckoutForm({ order, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postal_code: '',
    phone: ''
  });

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postal_code || !shippingInfo.phone) {
      setError('Veuillez remplir toutes les informations d\'expédition');
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Créer un token de carte
    const { error: stripeError, token: stripeToken } = await stripe.createToken(cardElement);

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    // Envoyer le token au serveur
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axiosInstance.post(`/orders/${order.id}/pay`, {
        stripeToken: stripeToken.id, 
        shipping: shippingInfo
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}` 
        }
      });

      if (response.data.success) {
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations d'expédition</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Code postal</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={shippingInfo.postal_code}
              onChange={handleShippingInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de paiement</h3>
        <div className="mb-4">
          <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
            Carte de crédit ou de débit
          </label>
          <div className="border border-gray-300 rounded-md p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#32325d',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                  },
                },
              }}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Vous serez débité de <span className="font-medium">{order.item?.price} MAD</span>
          </div>
          <button
            type="submit"
            disabled={!stripe || processing}
            className={`bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors ${(!stripe || processing) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {processing ? 'Traitement...' : 'Payer maintenant'}
          </button>
        </div>
      </div>
    </form>
  );
}

// Composant principal
function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get(`/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const orderData = response.data.data;

        // Vérifier si la commande peut être payée
        if (orderData.status !== 'accepted') {
          setError("Cette commande ne peut pas être payée dans son état actuel.");
          setLoading(false);
          return;
        }

        if (orderData.payment_status === 'paid') {
          setError("Cette commande a déjà été payée.");
          setLoading(false);
          return;
        }

        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de la commande:", err);
        setError("Une erreur est survenue lors du chargement des détails de la commande.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      navigate('/mes-achats');
    }, 3000);
  };

  if (loading) {
    return (
      <>
        <NavbarUser />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarUser />
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/mes-achats')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Retour à mes achats
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (paymentSuccess) {
    return (
      <>
        <NavbarUser />
        <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-3 text-lg font-medium text-gray-900">Paiement réussi!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Votre paiement a été traité avec succès. Un email de confirmation vous a été envoyé.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Vous allez être redirigé vers vos achats...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarUser />
      <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Finaliser la commande</h1>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>

            <div className="flex items-center mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                <img
                  src={order.item?.image ?
                    `http://localhost:8000/storage/${order.item.image}` :
                    '/placeholder-item.png'}
                  alt={order.item?.title || "Article"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-item.png';
                  }}
                />
              </div>
              <div>
                <div className="font-medium">{order.item?.title}</div>
                <div className="text-sm text-gray-500">Vendeur: {order.seller?.first_name} {order.seller?.last_name}</div>
                <div className="text-green-600 font-bold mt-1">{order.item?.price} MAD</div>
              </div>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm order={order} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      </div>
    </>
  );
}

export default Payment;