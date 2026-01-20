import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, BookOpen, Users, Settings, BarChart3, FileText, Award, ChevronDown, ChevronRight, Video, ClipboardList } from 'lucide-react';
import Tabs from './Tabs';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleRouteChange = (route) => {
    navigate(route);
  };

  // Auto-expand menus based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/courses')) {
      setExpandedMenus(prev => ({ ...prev, courses: true }));
    } else if (path.includes('/students')) {
      setExpandedMenus(prev => ({ ...prev, students: true }));
    } else if (path.includes('/users')) {
      setExpandedMenus(prev => ({ ...prev, users: true }));
    } else if (path.includes('/test')) {
      setExpandedMenus(prev => ({ ...prev, tests: true }));
    } else if (path.includes('/videos')) {
      setExpandedMenus(prev => ({ ...prev, videos: true }));
    }
  }, [location.pathname]);

  const statsCards = [
    {
      id: 'students',
      icon: Users,
      label: 'Total Students',
      value: '10,234',
      change: '+12%',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-700'
    },
    {
      id: 'courses',
      icon: BookOpen,
      label: 'Total Courses',
      value: '48',
      change: '+3',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-700'
    },
    {
      id: 'enrollments',
      icon: FileText,
      label: 'Active Enrollments',
      value: '8,456',
      change: '+8%',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-700'
    },
    {
      id: 'revenue',
      icon: BarChart3,
      label: 'Total Revenue',
      value: '$125K',
      change: '+15%',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-700'
    },
    {
      id: 'certificates',
      icon: Award,
      label: 'Certificates Issued',
      value: '3,421',
      change: '+22%',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-700'
    },
    {
      id: 'instructors',
      icon: Users,
      label: 'Active Instructors',
      value: '52',
      change: '+5',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-700'
    },
    {
      id: 'completion',
      icon: BarChart3,
      label: 'Completion Rate',
      value: '78%',
      change: '+6%',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-700'
    }
  ];

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
        { label: 'Enroll Students', route: '/admin/enroll-students' }
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
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      route: '/admin/analytics',
      type: 'single'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      route: '/admin/settings',
      type: 'single'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
        }`}
      >
        {sidebarOpen && (
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-purple-100">
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
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            location.pathname === item.route
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
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-all duration-200 group"
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
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                  location.pathname === subItem.route
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
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Top Header */}
        <header className="bg-white shadow-md sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-purple-700" />
              </button>
              <h1 className="text-2xl font-bold text-purple-900">
                {location.pathname === '/admin/dashboard' ? 'Dashboard' : 
                 location.pathname.split('/').pop().split('-').map(word => 
                   word.charAt(0).toUpperCase() + word.slice(1)
                 ).join(' ')}
              </h1>
            </div>
          </div>
        </header>

        {/* Dynamic Dashboard Content */}
        <main className="p-6">
          {/* Show stats cards and tabs only on dashboard route */}
          {location.pathname === '/admin/dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveTab(card.id)}
                      className={`bg-white rounded-2xl shadow-lg p-6 border cursor-pointer transition-all duration-300 ${
                        activeTab === card.id
                          ? 'border-purple-500 shadow-xl ring-2 ring-purple-300'
                          : 'border-purple-100 hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${card.bgColor} rounded-lg`}>
                          <Icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                        <span className="text-sm font-medium text-green-600">{card.change}</span>
                      </div>
                      <h3 className="text-gray-600 text-sm font-medium mb-1">{card.label}</h3>
                      <p className="text-3xl font-bold text-purple-900">{card.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tabs Component */}
              <Tabs activeTab={activeTab} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;