import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Home from "./pages/index";
import Experience from "./pages/experience";
import Expertise from "./pages/expertise";
import Achievements from "./pages/achievements";
import Projects from "./pages/project";
import ProjectDetail from "./pages/project-details";
import Contact from "./pages/contact";

import { AuthProvider } from "./lib/auth";
import RequireAuth from "./components/admin/RequireAuth";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProfile from "./pages/admin/profile";
import AdminProjects from "./pages/admin/projects-list";
import AdminProjectEditor from "./pages/admin/project-editor";
import { AdminExperiences, AdminAchievements, AdminSocialLinks } from "./pages/admin/collections";
import AdminMessages from "./pages/admin/messages";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/expertise" element={<Expertise />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Route>

        {/* Admin: login is public, everything else needs a valid token */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/new" element={<AdminProjectEditor />} />
          <Route path="projects/:id" element={<AdminProjectEditor />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="social-links" element={<AdminSocialLinks />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="*" element={<p className="text-muted-foreground">Admin page not found.</p>} />
        </Route>

        <Route element={<Layout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}