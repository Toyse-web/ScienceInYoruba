import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Import all pages
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import CreateAdmin from "./admin/pages/CreateAdmin";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import Dashboard from "./admin/pages/AdminDashboard";
import ArticleList from "./admin/components/ArticleList";
import ArticleForm from "./admin/components/ArticleForm";
import TopicManager from "./admin/components/TopicManager";
import MediaManager from "./admin/components/MediaManager";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
            {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/create-admin" element={<CreateAdmin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="articles" element={<ArticleList />} />
                  <Route path="articles/new" element={<ArticleForm />} />
                  <Route path="articles/:id/edit" element={<ArticleForm />} />
                  <Route path="topics" element={<TopicManager />} />
                  <Route path="media" element={<MediaManager />} />
              </Route>
              {/* 404 Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;