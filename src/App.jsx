import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './Pages/HomePage';
import About from './Pages/About';
import AuthPage from './Pages/AuthPage';
import ApplicationForm from './Pages/ApplicationForm';
import Submissions from './components/Submission/submissions';
import SubmissionDetail from './components/Submission/SubmissionDetails';
import LeaderboardPage from './Pages/LeaderboardPage';
import FAQPage from './Pages/FaqPage';
import ContactPage from './Pages/ContactPage';
import ProfilePage from './Pages/ProfilePage';
import SettingsPage from './Pages/SettingsPage';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TearmsOfService from './Pages/TearmsOfService';
import Methodology from './Pages/Methodology';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or sessionStorage, based on your app

  // if token not found, navigate to /auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children; // if token found, render the page
};
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TearmsOfService />} />
          <Route path="/methodology" element={<Methodology />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application"
            element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <Submissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission-detail/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public route */}
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;