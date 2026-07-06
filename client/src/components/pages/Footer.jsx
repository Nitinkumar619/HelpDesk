import React from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white pt-12 pb-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-8">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <Building2 className="h-6 w-6 text-indigo-700" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                IIITA <span className="text-indigo-300">Help Desk</span>
              </h2>
            </div>
            <p className="text-indigo-200 text-sm mb-4">
              A unified platform for students and staff to raise, manage, and track complaints across hostels, departments, and campus facilities at IIITA.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/kalim-Asim/Help-Desk-IIITA" className="text-gray-300 hover:text-white transition-colors duration-300" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-300 hover:text-white transition-colors duration-300" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors duration-300" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors duration-300" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-indigo-300">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/select-category" label="Submit Ticket" />
              <FooterLink to="/track" label="Track Ticket" />
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/about" label="About Us" />
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-indigo-300">Help & Support</h3>
            <ul className="space-y-2">
              <FooterLink to="/contact" label="Contact Us" />
              <FooterLink to="/privacy-policy" label="Privacy Policy" />
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/accessibility" label="Accessibility" />
              <FooterExternalLink href="https://iiita.ac.in" label="IIITA Website" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-indigo-300">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-300 text-sm">helpdesk@iiita.ac.in</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-300 text-sm">+91 123 456 7890</span>
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-indigo-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Indian Institute of Information Technology Allahabad<br />
                  Devghat, Jhalwa<br />
                  Allahabad, Uttar Pradesh 211015
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-indigo-300">
              © {currentYear} IIITA Help Desk. All rights reserved.
            </p>
            
            {/* Additional Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-indigo-400">
              <Link to="/privacy" className="hover:text-indigo-200 transition-colors duration-300">Privacy</Link>
              <Link to="/terms" className="hover:text-indigo-200 transition-colors duration-300">Terms</Link>
              <Link to="/cookies" className="hover:text-indigo-200 transition-colors duration-300">Cookies</Link>
              <Link to="/sitemap" className="hover:text-indigo-200 transition-colors duration-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable Footer Link Component
const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center"
    >
      {label}
    </Link>
  </li>
);

// External Link Component with Icon
const FooterExternalLink = ({ href, label }) => (
  <li>
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center gap-1"
    >
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  </li>
);

export default Footer;