import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/Signup';
import Login from './pages/Login';
import Home from './pages/User/Home';
import ArticleDetail from './pages/User/ArticleDetail'; // Import de la page ArticleDetail
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />  {/* Route pour ArticleDetail */}
      </Routes>
    </Router>
  );
}

export default App;
