import React from 'react';
import { Users, BookOpen, FileText, DollarSign, Award, UserCheck, TrendingUp } from 'lucide-react';

function Tabs({ activeTab }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Students Management</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">New This Month</p>
                  <p className="text-2xl font-bold text-purple-900">1,234</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Active Students</p>
                  <p className="text-2xl font-bold text-purple-900">8,756</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Inactive</p>
                  <p className="text-2xl font-bold text-purple-900">1,478</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Students</h3>
                <div className="space-y-3">
                  {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'].map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{name}</p>
                          <p className="text-sm text-gray-600">student{index + 1}@example.com</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-800">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Courses Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { name: 'Graphic Design', students: 2500 },
                { name: 'Web Development', students: 3200 },
                { name: 'UI/UX Design', students: 2100 },
                { name: 'English', students: 1800 }
              ].map((course, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
                  <p className="text-sm text-gray-600">{course.students} students</p>
                  <button className="mt-3 text-sm text-purple-700 font-medium hover:underline">
                    Manage Course →
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'enrollments':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-lg">
                <FileText className="w-6 h-6 text-amber-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Enrollments Overview</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { student: 'John Doe', course: 'Graphic Design - Beginner', date: '2024-01-15', status: 'Active' },
                { student: 'Jane Smith', course: 'Web Development - Intermediate', date: '2024-01-14', status: 'Active' },
                { student: 'Mike Johnson', course: 'UI/UX Design - Advanced', date: '2024-01-13', status: 'Completed' },
                { student: 'Sarah Wilson', course: 'English - Beginner', date: '2024-01-12', status: 'Active' }
              ].map((enrollment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{enrollment.student}</p>
                    <p className="text-sm text-gray-600">{enrollment.course}</p>
                    <p className="text-xs text-gray-500 mt-1">{enrollment.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    enrollment.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Revenue Analytics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-green-700">$45,230</p>
                <p className="text-xs text-green-600 mt-1">+15% from last month</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Last Month</p>
                <p className="text-2xl font-bold text-green-700">$39,320</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">$125,450</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue by Course</h3>
              <div className="space-y-3">
                {[
                  { course: 'Web Development', revenue: '$48,500', percentage: 39 },
                  { course: 'Graphic Design', revenue: '$35,200', percentage: 28 },
                  { course: 'UI/UX Design', revenue: '$28,750', percentage: 23 },
                  { course: 'English', revenue: '$13,000', percentage: 10 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.course}</span>
                      <span className="text-sm font-bold text-gray-900">{item.revenue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Award className="w-6 h-6 text-pink-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Certificates Issued</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-pink-700">456</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Issued</p>
                <p className="text-2xl font-bold text-pink-700">3,421</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Recent Certificates</h3>
              {[
                { student: 'John Doe', course: 'Graphic Design - Advanced', date: '2024-01-15' },
                { student: 'Jane Smith', course: 'Web Development - Complete', date: '2024-01-14' },
                { student: 'Mike Johnson', course: 'UI/UX Design - Professional', date: '2024-01-13' }
              ].map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{cert.student}</p>
                    <p className="text-sm text-gray-600">{cert.course}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                  <button className="px-4 py-2 bg-pink-700 text-white rounded-lg text-sm hover:bg-pink-800">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'instructors':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-indigo-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Instructors Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Dr. Sarah Johnson', 'Prof. Mike Chen', 'Emily Rodriguez', 'David Brown'].map((name, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h4 className="font-semibold text-gray-900">{name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{Math.floor(Math.random() * 500) + 200} Students</p>
                  <button className="mt-3 text-sm text-indigo-700 font-medium hover:underline">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-teal-700" />
              </div>
              <h2 className="text-2xl font-bold text-purple-900">Completion Rate Analytics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Overall Rate</p>
                <p className="text-3xl font-bold text-teal-700">78%</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-teal-700">82%</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Last Month</p>
                <p className="text-3xl font-bold text-teal-700">75%</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Completion by Course</h3>
              {[
                { course: 'Graphic Design', rate: 85 },
                { course: 'Web Development', rate: 79 },
                { course: 'UI/UX Design', rate: 76 },
                { course: 'English', rate: 72 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.course}</span>
                    <span className="text-sm font-bold text-teal-700">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${item.rate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <p className="text-gray-600">Select a card to view details</p>
          </div>
        );
    }
  };

  return (
    <div className="mt-6">
      {renderTabContent()}
    </div>
  );
}

export default Tabs;