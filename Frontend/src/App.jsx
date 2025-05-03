import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/Signup';
import Login from './pages/Login';
import Home from './pages/User/Home';
import ArticleDetail from './pages/User/ArticleDetail';
import UserProfile from './pages/User/UserProfile';
import Profile from './pages/User/Profile';
import NotificationAbonnées from './pages/User/NotificationAbonées';
import NotificationAchats from './pages/User/notificationAchats';
import Favorites from './pages/User/Favorites';
import Following from './pages/User/Following';
import Followers from './pages/User/Followers';
import PublishArticle from './pages/User/PublishArticle';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageArticles from './pages/Admin/ManageArticles';
import ManageCategories from './pages/Admin/ManageCategories';
import Dashboard from './pages/Admin/Dashboard';
import EditArticle from './pages/User/EditArticle';
import SearchItems from './pages/User/SearchItems';
import SearchUsers from './pages/User/SearchUsers';
import MesAchats from './pages/User/MesAchats';
import Payment from './pages/User/Payment';
import SalesHistory from './pages/User/SalesHistory';
import CategoryItems from './pages/User/CategoryItems';
import ProtectedRoute from './components/ProtectedRoute';
import AdminArticleDetail from './pages/Admin/AdminArticleDetail';
import ManageComments from './pages/Admin/ManageComments';
import ManageOrders from './pages/Admin/ManageOrders';
import OrderDetail from './pages/Admin/OrderDetail';
import AdminUserProfile from './pages/Admin/AdminUserProfile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/search/items" element={<SearchItems />} />
        <Route path="/search/users" element={<SearchUsers />} />
        <Route path="/categories/:categoryId" element={<CategoryItems />} />

        <Route element={<ProtectedRoute allowedRoles={'admin'} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/manage-articles" element={<ManageArticles />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-categorie" element={<ManageCategories />} />
          <Route path="/admin/article/:id" element={<AdminArticleDetail />} />
          <Route path="/admin/gestion-commentaires" element={<ManageComments />} />
          <Route path="/admin/gestion-commandes" element={<ManageOrders />} />
          <Route path="/admin/order/:id" element={<OrderDetail />} />
          <Route path="/admin/user/:id" element={<AdminUserProfile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={'buyer_seller'} />}>
          <Route path="/edit-article/:id" element={<EditArticle />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications-abonnes" element={<NotificationAbonnées />} />
          <Route path="/notifications-achats" element={<NotificationAchats />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/following" element={<Following />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/publish-article" element={<PublishArticle />} />
          <Route path="/mes-achats" element={<MesAchats />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/mes-ventes" element={<SalesHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;