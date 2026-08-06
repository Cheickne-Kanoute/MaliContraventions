import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardAgent from './pages/DashboardAgent';
import DashboardCitoyen from './pages/DashboardCitoyen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/agent" element={<DashboardAgent />} />
        <Route path="/dashboard/citoyen" element={<DashboardCitoyen />} />
      </Routes>
    </Router>
  );
}

export default App;
