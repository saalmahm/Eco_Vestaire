import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/Signup';
import Login from './pages/Login';
import Home from './pages/User/Home';
import ArticleDetail from './pages/User/ArticleDetail'; 
import UserProfile from './pages/User/UserProfile'; 
import Profile from './pages/User/Profile';
import NotificationAbonnées from './pages/User/NotificationAbonées';
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
      </Routes>
    </Router>
  );
}

export default App;
