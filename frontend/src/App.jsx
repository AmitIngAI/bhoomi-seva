import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { LanguageProvider } from "./context/LanguageContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import PredictionPage from "./pages/PredictionPage";
import DashboardHome from "./pages/DashboardHome";
import DashboardSearch from "./pages/DashboardSearch";
import DashboardMyLands from "./pages/DashboardMyLands";
import DashboardPredictions from "./pages/DashboardPredictions";
import DashboardDownloads from "./pages/DashboardDownloads";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardMap from "./pages/DashboardMap";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import DocumentViewPage from "./pages/DocumentViewPage";
import DashboardNotifications from "./pages/DashboardNotifications";

//  ADMIN IMPORTS
import AdminLayout from "./components/AdminLayout";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminLandRecords from "./pages/admin/AdminLandRecords";
import AdminSatbara from "./pages/admin/AdminSatbara";
import AdminEightA from "./pages/admin/AdminEightA";
import AdminPropertyCards from "./pages/admin/AdminPropertyCards";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMessages from "./pages/admin/AdminMessages";

import "./App.css";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
            <Route path="/predict" element={<PublicLayout><PredictionPage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Document Route */}
            <Route path="/document/:recordId" element={<ProtectedRoute><DocumentViewPage /></ProtectedRoute>} />

            {/* Citizen Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="citizen">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="search" element={<DashboardSearch />} />
              <Route path="my-lands" element={<DashboardMyLands />} />
              <Route path="satbara" element={<DashboardMyLands filterType="agricultural" />} />
              <Route path="eight-a" element={<DashboardMyLands filterType="agricultural" />} />
              <Route path="property-card" element={<DashboardMyLands filterType="non-agricultural" />} />
              <Route path="predictions" element={<DashboardPredictions />} />
              <Route path="map" element={<DashboardMap />} />
              <Route path="downloads" element={<DashboardDownloads />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="notifications" element={<DashboardNotifications />} />
            </Route>

            {/* ✅ ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardHome />} />
              <Route path="land-records" element={<AdminLandRecords />} />
              <Route path="satbara" element={<AdminSatbara />} />
              <Route path="eight-a" element={<AdminEightA />} />
              <Route path="property-cards" element={<AdminPropertyCards />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;