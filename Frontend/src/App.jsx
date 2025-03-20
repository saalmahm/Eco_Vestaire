import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/User/Signup';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;