import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
