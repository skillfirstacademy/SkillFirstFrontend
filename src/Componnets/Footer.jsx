import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../assets/Skill-Firest_logo_WHITE_01.png";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "All Courses", href: "/courses" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-purple-200">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Logo & Description */}
          <div>
            <Link to="/">
              <img src={logo} alt="SkillFirst Logo" className="h-12 mb-4" />
            </Link>

            <p className="text-purple-300 text-sm leading-relaxed mb-6">
              Empowering learners worldwide with expert-led courses and
              AI-powered learning experiences.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-purple-800/50 hover:bg-purple-700 rounded-md flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 text-purple-200" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-purple-400 mt-1" />
                <a
                  href="mailto:info@skillfirst.com"
                  className="hover:text-white transition-colors"
                >
                  info@skillfirst.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-purple-400 mt-1" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-800/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-6 text-center text-sm">
          © {currentYear} SkillFirst. All rights reserved.
        </div>
      </div>

    </footer>
  );
}

export default Footer;
