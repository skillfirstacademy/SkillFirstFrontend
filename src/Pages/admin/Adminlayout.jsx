import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, Home, BookOpen, Users, Settings, BarChart3, ChevronDown, ChevronRight, Video, ClipboardList, LogOut } from 'lucide-react';
import { logout } from "../../Features/authSlice";
import { showSuccess } from '../../Componnets/AppToaster';
import { useDispatch } from 'react-redux';
import api from '../../api/axios';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => {
      // If clicking on an already open menu, close it
      if (prev[menuKey]) {
        return { ...prev, [menuKey]: false };
      }
      // Otherwise, close all menus and open only the clicked one
      return { [menuKey]: true };
    });
  };

  const handleRouteChange = (route) => {
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      // Only clear if backend logout succeeded
      localStorage.removeItem("deviceId");
    } catch (err) {
      console.log("LOGOUT ERROR STATUS:", err.response?.status);
      console.log("LOGOUT ERROR DATA:", err.response?.data);
      console.log("ERROR :", err);
      // Don't remove deviceId if logout failed
    } finally {
      dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
      showSuccess("Logged out successfully");
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      route: '/admin/dashboard',
      type: 'single'
    },
    {
      icon: BookOpen,
      label: 'Courses',
      key: 'courses',
      type: 'dropdown',
      subItems: [
        { label: 'All Courses', route: '/admin/all-courses' },
        { label: 'Add Course', route: '/admin/add-courses' }
      ]
    },
    {
      icon: Users,
      label: 'Students',
      key: 'students',
      type: 'dropdown',
      subItems: [
        { label: 'All Students', route: '/admin/all-students' },
        { label: 'Add Student', route: '/admin/add-students' },
        { label: 'Enrolled Students', route: '/admin/enroll-students' }
      ]
    },
    {
      icon: Users,
      label: 'Users',
      key: 'users',
      type: 'dropdown',
      subItems: [
        { label: 'All Users', route: '/admin/all-users' },
        { label: 'Make Admin', route: '/admin/make-admin' }
      ]
    },
    {
      icon: ClipboardList,
      label: 'Tests',
      key: 'tests',
      type: 'dropdown',
      subItems: [
        { label: 'Add Test', route: '/admin/add-test' },
        { label: 'All Tests', route: '/admin/all-test' }
      ]
    },
    {
      icon: Video,
      label: 'Videos',
      key: 'videos',
      type: 'dropdown',
      subItems: [
        { label: 'Add Video', route: '/admin/add-videos' },
        { label: 'All Videos', route: '/admin/all-videos' }
      ]
    },
    
  ];

  // Auto-expand menus based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Find which dropdown the current route belongs to
    const activeDropdown = menuItems.find(item => {
      if (item.type === 'dropdown') {
        return item.subItems.some(subItem => subItem.route === path);
      }
      return false;
    });

    if (activeDropdown) {
      // Keep only the active dropdown open
      setExpandedMenus({ [activeDropdown.key]: true });
    } else {
      // Close all dropdowns when on a single page route
      setExpandedMenus({});
    }
  }, [location.pathname]);

  // Get page title from current route
  const getPageTitle = () => {
    if (location.pathname === '/admin/dashboard') return 'Dashboard';
    const pathParts = location.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Check if dropdown parent should be highlighted (when any child route is active)
  const isDropdownActive = (item) => {
    if (item.type !== 'dropdown') return false;
    return item.subItems.some(subItem => location.pathname === subItem.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-30 ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
          }`}
      >
        {sidebarOpen && (
          <div className="h-full flex flex-col pt-25">
            {/* Sidebar Header */}
            <div className="px-6 py-4 border-b border-purple-100">
              <h2 className="text-xl font-bold text-purple-900">Admin Panel</h2>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;

                  if (item.type === 'single') {
                    return (
                      <li key={index}>
                        <button
                          onClick={() => handleRouteChange(item.route)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname === item.route
                              ? 'bg-purple-100 text-purple-900'
                              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
                            }`}
                        >
                          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    );
                  }

                  // Dropdown menu
                  return (
                    <li key={index}>
                      <button
                        onClick={() => toggleMenu(item.key)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                          isDropdownActive(item)
                            ? 'bg-purple-50 text-purple-900'
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {expandedMenus[item.key] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {/* Submenu */}
                      {expandedMenus[item.key] && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <button
                                onClick={() => handleRouteChange(subItem.route)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${location.pathname === subItem.route
                                    ? 'bg-purple-100 text-purple-900 font-medium'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-900'
                                  }`}
                              >
                                {subItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout Button at Bottom */}
            <div className="p-4 border-t border-purple-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        {/* Top Header */}
        <header className="bg-white shadow-md sticky top-23 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-purple-700" />
              </button>
              <h1 className="text-2xl font-bold text-purple-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area - This is where child routes render */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;