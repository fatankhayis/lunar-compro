import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import StarGazer from './components/StarGazer';

import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Admin/account/Login';

import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CrewPage from './pages/Admin/page/CrewPage';
import ProjectPage from './pages/Admin/page/ProjectPage';
import PartnershipPage from './pages/Admin/page/PartnershipPage';
import TestimonialPage from './pages/Admin/page/TestimonialPage';
import MessagePage from './pages/Admin/page/MessagePage';
import NotFound from './pages/NotFound';
import PrivateRoute from './pages/Admin/account/PrivateRoute';
import ProductPage from './pages/Admin/page/ProductPage';
import BlogAdminPage from './pages/Admin/page/BlogPage';
import UserManagementPage from './pages/Admin/page/UserManagementPage';
import BlogManagementPage from './pages/Admin/page/BlogManagementPage';
import BlogFormPage from './pages/Admin/page/BlogFormPage';
import MyBlogsPage from './pages/Admin/page/MyBlogsPage';

import RoleRoute from './pages/Admin/account/RoleRoute';

const AppContent = () => {
  const location = useLocation();
  const hideStars = location.pathname === '/login' || location.pathname.startsWith('/admin');

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
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
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
              <Route path="crew" element={<RoleRoute allowedRoles={["super_admin"]}><CrewPage /></RoleRoute>} />
              <Route path="product" element={<RoleRoute allowedRoles={["super_admin"]}><ProductPage /></RoleRoute>} />
              <Route path="project" element={<RoleRoute allowedRoles={["super_admin"]}><ProjectPage /></RoleRoute>} />
              <Route path="partnership" element={<RoleRoute allowedRoles={["super_admin"]}><PartnershipPage /></RoleRoute>} />
              <Route path="testimonial" element={<RoleRoute allowedRoles={["super_admin"]}><TestimonialPage /></RoleRoute>} />
              <Route path="blog" element={<RoleRoute allowedRoles={["super_admin"]}><BlogManagementPage /></RoleRoute>} />
              <Route path="blog-editor" element={<RoleRoute allowedRoles={["super_admin"]}><BlogAdminPage /></RoleRoute>} />
              <Route path="blogs" element={<RoleRoute allowedRoles={["blog_author"]}><MyBlogsPage /></RoleRoute>} />
              <Route path="blogs/create" element={<RoleRoute allowedRoles={["blog_author"]}><BlogFormPage /></RoleRoute>} />
              <Route path="blogs/:postId/edit" element={<RoleRoute allowedRoles={["blog_author"]}><BlogFormPage /></RoleRoute>} />
              <Route path="blog-management" element={<RoleRoute allowedRoles={["super_admin"]}><BlogManagementPage /></RoleRoute>} />
              <Route path="inquiries" element={<RoleRoute allowedRoles={["super_admin"]}><MessagePage /></RoleRoute>} />
              <Route path="users" element={<RoleRoute allowedRoles={["super_admin"]}><UserManagementPage /></RoleRoute>} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppContent;
