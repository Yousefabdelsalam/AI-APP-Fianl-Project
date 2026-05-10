import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import AITripPlannerPage from './pages/AITripPlannerPage';
import AIChatGuidePage from './pages/AIChatGuidePage';
import VirtualDestinationGeneratorPage from './pages/VirtualDestinationGeneratorPage';
import BudgetEstimatorPage from './pages/BudgetEstimatorPage';
import SavedTripsPage from './pages/SavedTripsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/destination/:id" element={<DestinationDetailsPage />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/trip-planner" element={<ProtectedRoute><AITripPlannerPage /></ProtectedRoute>} />
            <Route path="/ai-guide" element={<ProtectedRoute><AIChatGuidePage /></ProtectedRoute>} />
            <Route path="/virtual-tour" element={<ProtectedRoute><VirtualDestinationGeneratorPage /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetEstimatorPage /></ProtectedRoute>} />
            <Route path="/saved-trips" element={<ProtectedRoute><SavedTripsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
