import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/Signup';
import Login from './pages/Login';
import Home from './pages/User/Home';
import ArticleDetail from './pages/User/ArticleDetail'; 
import UserProfile from './pages/User/UserProfile'; 
import Profile from './pages/User/Profile';
import NotificationAbonnées from './pages/User/NotificationAbonées';
import NotificationAchats from './pages/User/NotificationAchats';
import Favorites from './pages/User/Favorites';
import Following from './pages/User/Following';
import Followers from './pages/User/Followers';
import PublishArticle from './pages/User/PublishArticle';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} /> 
        <Route path="/user-profile" element={<UserProfile />} /> 
        <Route path="/profile" element={<Profile />} />  
        <Route path="/notifications-abonnes" element={<NotificationAbonnées />} />
        <Route path="/notifications-achats" element={<NotificationAchats />} />
        <Route path="/favorites" element={<Favorites />} />  
        <Route path="/following" element={<Following />} />  
        <Route path="/followers" element={<Followers />} />  
        <Route path="/publish-article" element={<PublishArticle />} />  

      </Routes>
    </Router>
  );
}

export default App;
