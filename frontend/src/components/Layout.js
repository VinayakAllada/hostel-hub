import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiAlertCircle,
  FiCalendar,
  FiBell,
  FiUser,
  FiUsers,
  FiClipboard,
  FiLogOut,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiLayers,
} from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Layout.fixed.css";

const Layout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(role === "admin" ? "/admin/login" : "/student/login");
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: "/student/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/student/complaints", label: "Complaints", icon: FiAlertCircle },
    { path: "/student/mess-leave", label: "Mess Leave", icon: FiCalendar },
    { path: "/student/announcements", label: "Announcements", icon: FiBell },
    { path: "/student/profile", label: "Profile", icon: FiUser },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/admin/students", label: "Students", icon: FiUsers },
    { path: "/admin/attendance", label: "Attendance", icon: FiClipboard },
    { path: "/admin/complaints", label: "Complaints", icon: FiAlertCircle },
    { path: "/admin/mess-leave", label: "Mess Leave", icon: FiCalendar },
    { path: "/admin/announcements", label: "Announcements", icon: FiBell },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`layout ${theme}`}>
      <motion.nav
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="nav-container">
          <div className="nav-brand-section">
            <motion.h1
              className="nav-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FiLayers
                size={28}
                style={{
                  marginRight: "0.5rem",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              
            </motion.h1>
            <motion.button
              className="hamburger"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
          <AnimatePresence>
            {(() => {
              const isDesktop =
                typeof window !== "undefined" && window.innerWidth > 768;
              return mobileMenuOpen || isDesktop ? (
                <motion.div
                  className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}
                  initial={isDesktop ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {links.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          className={
                            isActive(link.path) ? "nav-link active" : "nav-link"
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon style={{ marginRight: "0.5rem" }} />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : null;
            })()}
          </AnimatePresence>
          <AnimatePresence>
            {(() => {
              const isDesktop =
                typeof window !== "undefined" && window.innerWidth > 768;
              return mobileMenuOpen || isDesktop ? (
                <motion.div
                  className={`nav-actions ${
                    mobileMenuOpen ? "mobile-open" : ""
                  }`}
                  initial={isDesktop ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "light" ? (
                      <FiMoon size={20} />
                    ) : (
                      <FiSun size={20} />
                    )}
                  </motion.button>
                  <span className="user-name">
                    <HiOutlineUserCircle
                      size={24}
                      style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                    />
                    <span className="user-name-text">
                      {user?.name || user?.studentID || user?.adminID}
                    </span>
                  </span>
                  <motion.button
                    onClick={handleLogout}
                    className="logout-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut style={{ marginRight: "0.5rem" }} />
                    Logout
                  </motion.button>
                </motion.div>
              ) : null;
            })()}
          </AnimatePresence>
        </div>
      </motion.nav>
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
