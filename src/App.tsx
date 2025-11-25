import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Causes from "./pages/Causes";
import Sponsor from "./pages/Sponsor";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AddOrphan from "./pages/AddOrphan";
import ViewOrphans from "./pages/ViewOrphans";
import ViewDonors from "./pages/ViewDonors";
import ViewDonations from "./pages/ViewDonations";
import ViewReports from "./pages/ViewReports";
import ManageCategories from "./pages/ManageCategories";
import PostUpdate from "./pages/PostUpdate";
import ManageUpdates from "./pages/ManageUpdates";
import ViewAnalytics from "./pages/ViewAnalytics";
import DonationMethods from "./pages/DonationMethods";
import SetAdminRole from "./pages/SetAdminRole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/causes" element={<Causes />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donation-methods" element={<DonationMethods />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/set-admin-role"
              element={
                <ProtectedRoute>
                  <SetAdminRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-orphan"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddOrphan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orphans"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewOrphans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donors"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewDonors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/post-update"
              element={
                <ProtectedRoute requiredRole="admin">
                  <PostUpdate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/updates"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageUpdates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewAnalytics />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
