import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import StarGazer from './components/StarGazer';

import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import Login from './pages/Admin/account/Login';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CrewPage from './pages/Admin/page/CrewPage';
import ProjectPage from './pages/Admin/page/ProjectPage';
import PartnershipPage from './pages/Admin/page/PartnershipPage';
import TestimonialPage from './pages/Admin/page/TestimonialPage';
import NotFound from './pages/NotFound';
import PrivateRoute from './pages/Admin/account/PrivateRoute';
import ProductPage from './pages/Admin/page/ProductPage';

const AppContent = () => {
  const location = useLocation();
  const routesWithoutStars = [
    '/login',
    '/admin',
    '/admin/crew',
    '/admin/product',
    '/admin/project',
    '/admin/partnership',
    '/admin/Testimonial',
  ];
  const hideStars = routesWithoutStars.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="relative min-h-screen overflow-hidden bg-bg">
        {!hideStars && <StarGazer />}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/project" element={<Project />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="crew" element={<CrewPage />} />
              <Route path="Product" element={<ProductPage />} />
              <Route path="project" element={<ProjectPage />} />
              <Route path="partnership" element={<PartnershipPage />} />
              <Route path="testimonial" element={<TestimonialPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppContent;
