import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, BookOpen, Users, Award, Target, TrendingUp, Star, Lightbulb } from 'lucide-react';

function AboutSection() {
  const [courses, setCourses] = useState(0);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView1) {
      animateCounter(5, setCourses, 1800);
    }
  }, [inView1]);

  useEffect(() => {
    if (inView2) {
      animateCounter(150, setCourses, 2000);
      animateCounter(10, setStudents, 2500);
      animateCounter(50, setInstructors, 2200);
      animateCounter(98, setSatisfaction, 1800);
    }
  }, [inView2]);

  const animateCounter = (target, setter, duration) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.ceil(start));
      }
    }, 16);
  };

  const stats = [
    {
      icon: BookOpen,
      value: `${courses}+`,
      label: "Expert Courses",
      iconColor: "text-purple-500",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-400/10",
      valueColor: "from-purple-500 to-violet-400"
    },
    {
      icon: Users,
      value: `${students}K+`,
      label: "Active Students",
      iconColor: "text-blue-500",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-400/10",
      valueColor: "from-blue-500 to-cyan-400"
    },
    {
      icon: Award,
      value: `${instructors}+`,
      label: "Expert Instructors",
      iconColor: "text-pink-500",
      bgColor: "bg-gradient-to-br from-pink-500/10 to-rose-400/10",
      valueColor: "from-pink-500 to-rose-400"
    },
    {
      icon: Star,
      value: `${satisfaction}%`,
      label: "Satisfaction Rate",
      iconColor: "text-amber-500",
      bgColor: "bg-gradient-to-br from-amber-500/10 to-yellow-400/10",
      valueColor: "from-amber-500 to-yellow-400"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-300/5 to-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Upper Section */}
      <div ref={ref1} className="relative">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image Section */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="SkillFirst Learning Environment" 
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
              </div>
              
              {/* Floating Stats Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-purple-100/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-900 mb-1">{courses}+</div>
                  <div className="text-sm text-gray-600 font-medium">Years Excellence</div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200">
                  <Lightbulb className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-900">About SkillFirst</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight">
                  Empowering Learners Through
                  <span className="block text-transparent bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text mt-2">
                    Expert-Led Education
                  </span>
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  SkillFirst is a premier online learning platform dedicated to transforming careers through 
                  expert-crafted courses and AI-powered learning experiences. With over <span className="font-semibold text-purple-900">{courses}+ years</span> of 
                  educational excellence, we've helped thousands achieve their professional goals.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm md:text-base">Industry-recognized certifications</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm md:text-base">Personalized learning paths</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm md:text-base">Expert instructor support</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 text-sm md:text-base">Lifetime course access</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button className="px-6 md:px-8 py-3 md:py-3.5 bg-purple-700 text-white rounded-xl font-medium hover:bg-purple-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Start Learning
                </button>
                <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white border-2 border-purple-700 text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-all duration-300">
                  View Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section
      <div ref={ref2} className="relative py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
              <TrendingUp className="w-4 h-4 text-purple-700 mr-2" />
              <span className="text-sm font-medium text-purple-900">Our Impact</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 mb-4">
              Learning Success
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text mt-2">
                By The Numbers
              </span>
            </h3>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful learners who have transformed their careers with SkillFirst
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg"></div>
                  <div className="relative p-6 md:p-8 text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className={`inline-flex p-3 md:p-4 rounded-2xl ${stat.bgColor} mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${stat.iconColor}`} />
                    </div>
                    
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3">
                      <span className={`bg-gradient-to-r ${stat.valueColor} bg-clip-text text-transparent`}>
                        {stat.value}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 font-medium text-xs md:text-sm lg:text-base">
                      {stat.label}
                    </p>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br from-white/50 to-transparent"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      {/* Mission Section */}
      <div className="relative py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <Target className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm font-medium text-white">Our Mission</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Making Quality Education Accessible to Everyone
                </h3>
                
                <p className="text-purple-100 text-base md:text-lg leading-relaxed">
                  We believe that education is the key to unlocking human potential. Our mission is to provide 
                  world-class learning experiences that are accessible, affordable, and tailored to your unique 
                  career goals.
                </p>

                <button className="px-6 md:px-8 py-3 md:py-4 bg-white text-purple-900 rounded-xl font-medium hover:bg-purple-50 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Join Our Community
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-purple-200 mb-3" />
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">Learn</h4>
                  <p className="text-purple-200 text-sm">Expert-led courses</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-purple-200 mb-3" />
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">Certify</h4>
                  <p className="text-purple-200 text-sm">Industry credentials</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-purple-200 mb-3" />
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">Grow</h4>
                  <p className="text-purple-200 text-sm">Career advancement</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <Star className="w-8 h-8 md:w-10 md:h-10 text-purple-200 mb-3" />
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">Excel</h4>
                  <p className="text-purple-200 text-sm">Achieve your goals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;