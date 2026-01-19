import React from 'react'
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  const courses = [
    { name: 'Graphic Design', href: '/courses/graphic-design' },
    { name: 'Web Development', href: '/courses/web-development' },
    { name: 'English Communication', href: '/courses/english' },
    { name: 'UI/UX Design', href: '/courses/ui-ux' }
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'All Courses', href: '/courses' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' }
  ]

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
    { name: 'Cookie Policy', href: '/cookies' }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' }
  ]

  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-purple-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">SkillFirst</h3>
            <p className="text-purple-300 mb-6 leading-relaxed">
              Empowering learners worldwide with expert-led courses and AI-powered learning experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-purple-800/50 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-purple-200" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Popular Courses</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.name}>
                  <a
                    href={course.href}
                    className="text-purple-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2 group-hover:bg-purple-400 transition-colors"></span>
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-purple-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-2 group-hover:bg-purple-400 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-400 mb-1">Email</p>
                  <a href="mailto:info@skillfirst.com" className="text-purple-300 hover:text-white transition-colors">
                    info@skillfirst.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-400 mb-1">Phone</p>
                  <a href="tel:+1234567890" className="text-purple-300 hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-400 mb-1">Location</p>
                  <p className="text-purple-300">
                    Ahmedabad, Gujarat, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-purple-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-white text-lg font-semibold mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-purple-300 text-sm">Get the latest courses and updates delivered to your inbox</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-purple-800/50 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-purple-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-purple-300 text-sm text-center md:text-left">
              © {currentYear} SkillFirst. All rights reserved. Made with ❤️ in India
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-purple-300 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer