import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import logo from "../../assets/logo.jpg"; // Adjust path as needed

const FooterLinks = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#3A2E2E] text-[#EADBC8] 
      border-t-4 border-[#D4A373] overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4A373]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#EADBC8]/10 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '3s'}}></div>
      
      {/* Main Footer Content */}
      <div className="px-4 md:px-8 py-12 md:py-16 relative z-10">
        <div className="container mx-auto">
          
          {/* Top Section - Brand and Newsletter */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logo} 
                alt="Kura Fashion Logo" 
                className="h-16 w-auto object-contain mr-4 hover:scale-110 transition-transform duration-300" 
              />
              <div className="text-left">
                <h2 className="font-headings text-3xl font-light text-[#EADBC8]">KURA</h2>
                <p className="text-[#D4A373] text-sm tracking-widest uppercase">Fashion</p>
              </div>
            </div>
            <p className="text-lg text-[#EADBC8]/80 max-w-2xl mx-auto leading-relaxed">
              Crafting premium fashion with timeless elegance and modern sophistication. 
              Where tradition meets contemporary style.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Quick Links Section */}
            <div className="group">
              <div className="relative mb-6">
                <h3 className="font-headings text-xl font-semibold text-[#EADBC8] mb-6 
                  relative inline-block">
                  Quick Links
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#D4A373] 
                    transition-all duration-300 group-hover:w-full"></div>
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/privacy-policy", label: "Privacy Policy" },
                  { to: "/refund-policy", label: "Refund & Return" },
                  { to: "/shop", label: "Shop Collection" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to} 
                      className="font-texts text-[#EADBC8]/80 hover:text-[#D4A373] 
                        transition-all duration-300 group/link flex items-center text-base
                        hover:translate-x-2 hover:font-medium"
                    >
                      <span className="w-3 h-0.5 bg-[#D4A373]/50 group-hover/link:bg-[#D4A373] 
                        transition-all duration-300 mr-4 group-hover/link:w-6"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support Section */}
            <div className="group">
              <div className="relative mb-6">
                <h3 className="font-headings text-xl font-semibold text-[#EADBC8] mb-6 
                  relative inline-block">
                  Customer Support
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#D4A373] 
                    transition-all duration-300 group-hover:w-full"></div>
                </h3>
              </div>
              <ul className="space-y-5">
                <li>
                  <a 
                    href="mailto:kurafashion009@gmail.com"
                    className="font-texts text-[#EADBC8]/80 hover:text-[#D4A373] 
                      transition-all duration-300 flex items-center group/link
                      hover:bg-[#D4A373]/10 p-3 rounded-lg"
                  >
                    <EmailOutlinedIcon className="mr-4 text-[#D4A373] group-hover/link:scale-125 
                      transition-transform duration-300 flex-shrink-0" fontSize="medium" />
                    <div>
                      <div className="text-xs text-[#EADBC8]/60 uppercase tracking-wide mb-1">Email</div>
                      <div className="text-sm font-medium">kurafashion009@gmail.com</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+918369622374"
                    className="font-texts text-[#EADBC8]/80 hover:text-[#D4A373] 
                      transition-all duration-300 flex items-center group/link
                      hover:bg-[#D4A373]/10 p-3 rounded-lg"
                  >
                    <PhoneOutlinedIcon className="mr-4 text-[#D4A373] group-hover/link:scale-125 
                      transition-transform duration-300 flex-shrink-0" fontSize="medium" />
                    <div>
                      <div className="text-xs text-[#EADBC8]/60 uppercase tracking-wide mb-1">Phone</div>
                      <div className="text-sm font-medium">+91 8369622374</div>
                    </div>
                  </a>
                </li>
                <li className="pt-3 space-y-3">
                  <Link 
                    to="/terms-conditions" 
                    className="font-texts text-[#EADBC8]/80 hover:text-[#D4A373] 
                      transition-all duration-300 group/link flex items-center text-sm
                      hover:translate-x-2"
                  >
                    <span className="w-2 h-0.5 bg-[#D4A373]/50 group-hover/link:bg-[#D4A373] 
                      transition-all duration-300 mr-3 group-hover/link:w-4"></span>
                    Terms & Conditions
                  </Link>
                  <Link 
                    to="/shippingPolicy" 
                    className="font-texts text-[#EADBC8]/80 hover:text-[#D4A373] 
                      transition-all duration-300 group/link flex items-center text-sm
                      hover:translate-x-2"
                  >
                    <span className="w-2 h-0.5 bg-[#D4A373]/50 group-hover/link:bg-[#D4A373] 
                      transition-all duration-300 mr-3 group-hover/link:w-4"></span>
                    Shipping & Delivery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="group">
              <div className="relative mb-6">
                <h3 className="font-headings text-xl font-semibold text-[#EADBC8] mb-6 
                  relative inline-block">
                  Connect With Us
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#D4A373] 
                    transition-all duration-300 group-hover:w-full"></div>
                </h3>
              </div>
              <div className="space-y-5">
                <a 
                  href="https://www.instagram.com/kura_fashion09?igsh=a2I0MHp3d3liMmp4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 
                    backdrop-blur-sm transition-all duration-300 group/social
                    border border-[#D4A373]/30 hover:border-[#D4A373]/60
                    hover:shadow-2xl hover:shadow-[#D4A373]/20 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E4405F] to-[#F77737] 
                    rounded-xl flex items-center justify-center mr-4 
                    group-hover/social:scale-110 transition-transform duration-300 shadow-lg">
                    <InstagramIcon className="text-white" fontSize="medium" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[#EADBC8] mb-1">Instagram</div>
                    <div className="text-sm text-[#EADBC8]/70">@kura_fashion09</div>
                  </div>
                </a>
                
                {/* Coming Soon Social Links */}
                <div className="p-4 rounded-2xl bg-[#2C2C2C]/50 border border-[#D4A373]/20">
                  <div className="text-sm text-[#EADBC8]/60 italic text-center">
                    More platforms coming soon...
                  </div>
                  <div className="flex justify-center space-x-3 mt-3 opacity-50">
                    <div className="w-8 h-8 bg-[#D4A373]/30 rounded-lg flex items-center justify-center">
                      <FacebookIcon fontSize="small" />
                    </div>
                    <div className="w-8 h-8 bg-[#D4A373]/30 rounded-lg flex items-center justify-center">
                      <XIcon fontSize="small" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="group">
              <div className="relative mb-6">
                <h3 className="font-headings text-xl font-semibold text-[#EADBC8] mb-6 
                  relative inline-block">
                  Visit Our Store
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#D4A373] 
                    transition-all duration-300 group-hover:w-full"></div>
                </h3>
              </div>
              <div className="p-6 rounded-2xl bg-[#2C2C2C]/80 backdrop-blur-sm 
                border border-[#D4A373]/30 hover:border-[#D4A373]/60 
                hover:bg-[#2C2C2C] transition-all duration-300
                hover:shadow-xl hover:shadow-[#D4A373]/10">
                <div className="flex items-start mb-4">
                  <LocationOnOutlinedIcon className="mr-4 text-[#D4A373] mt-1 flex-shrink-0" fontSize="medium" />
                  <address className="font-texts text-[#EADBC8]/80 not-italic leading-relaxed">
                    <div className="font-bold text-[#EADBC8] mb-2 text-lg">Kura Fashion</div>
                    <div className="space-y-1">
                      <div>Flat 401 - Harmony Bldg</div>
                      <div>Court Naka, Thane West</div>
                      <div>Maharashtra, 400601</div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="inline-block w-3 h-3 bg-[#D4A373] rounded-full mr-3"></span>
                      <span className="font-semibold">India</span>
                    </div>
                  </address>
                </div>
                
                {/* Store Hours */}
                <div className="mt-4 pt-4 border-t border-[#D4A373]/20">
                  <div className="text-xs text-[#EADBC8]/60 uppercase tracking-wide mb-2">Store Hours</div>
                  <div className="text-sm text-[#EADBC8]/80">
                    <div>Mon - Sat: 10:00 AM - 8:00 PM</div>
                    <div>Sunday: 12:00 PM - 6:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D4A373]/30 bg-[#2C2C2C]/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-base text-[#EADBC8]/70 font-medium">
                © {currentYear} <span className="font-bold text-[#EADBC8]">Kura Fashion</span>. 
                All rights reserved.
              </p>
              <p className="text-sm text-[#EADBC8]/50 mt-1">
                Crafted with ❤️ for premium fashion
              </p>
            </div>
            
            {/* Secondary Links */}
            <div className="flex items-center space-x-8 text-sm">
              <Link 
                to="/sitemap" 
                className="text-[#EADBC8]/70 hover:text-[#D4A373] transition-colors duration-300
                  hover:underline underline-offset-4"
              >
                Sitemap
              </Link>
              <span className="w-1.5 h-1.5 bg-[#EADBC8]/40 rounded-full"></span>
              <Link 
                to="/accessibility" 
                className="text-[#EADBC8]/70 hover:text-[#D4A373] transition-colors duration-300
                  hover:underline underline-offset-4"
              >
                Accessibility
              </Link>
              <span className="w-1.5 h-1.5 bg-[#EADBC8]/40 rounded-full"></span>
              <Link 
                to="/cookies" 
                className="text-[#EADBC8]/70 hover:text-[#D4A373] transition-colors duration-300
                  hover:underline underline-offset-4"
              >
                Cookie Policy
              </Link>
            </div>
            
            {/* Quality Badge */}
            {/* <div className="flex items-center space-x-3 px-4 py-2 bg-[#D4A373]/20 rounded-full
              border border-[#D4A373]/30">
              <div className="w-6 h-6 bg-gradient-to-br from-[#D4A373] to-[#3A2E2E] rounded-full 
                flex items- */}
            
            {/* Quality Badge */}
            <div className="flex items-center space-x-2 text-xs text-[#EADBC8]/60">
              <div className="w-4 h-4 bg-[#D4A373] rounded flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span>Premium Quality Guaranteed</span>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLinks;