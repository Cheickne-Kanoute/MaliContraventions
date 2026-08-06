import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardAgent from './pages/DashboardAgent';
import DashboardCitoyen from './pages/DashboardCitoyen';
import CodeRoute from './pages/CodeRoute';
import ContraventionDetail from './pages/ContraventionDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route path="/dashboard/agent" element={<DashboardAgent />} />
          <Route path="/dashboard/citoyen" element={<DashboardCitoyen />} />
          <Route path="/contraventions/:id" element={<ContraventionDetail />} />
          <Route path="/code-route" element={<CodeRoute />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
