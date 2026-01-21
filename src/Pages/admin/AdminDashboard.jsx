import React, { useState } from 'react';
import { Users, BookOpen, FileText, BarChart3, Award } from 'lucide-react';
import Tabs from './Tabs';
import { useSessionValidator } from '../../hooks/useSessionValidator';

const AdminDashboard = () => {
  useSessionValidator();
  const [activeTab, setActiveTab] = useState('students');

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

  return (
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
  );
};

export default AdminDashboard;