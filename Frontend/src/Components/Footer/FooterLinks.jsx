import React from 'react';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

const FooterLinks = () => {
  return (
    <footer className="border-t-[1px] border-[#5B3A2A] px-4 md:px-8 py-8 md:py-12 bg-[#F1E6D2] text-[#5B3A2A]">
      <div className="flex flex-wrap justify-between max-sm:flex-col items-start w-full">
        
        {/* Quick Links Section */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/4 mb-6">
          <h2 className="font-headings text-sm md:text-base font-semibold text-[#5B3A2A] mb-2">Quick Links</h2>
          <ul className="font-texts text-xs md:text-sm font-semibold text-[#5B3A2A]/70 space-y-1 md:space-y-2">
            <li><Link to="/about" className="hover:text-[#5B3A2A]">About Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#5B3A2A]">Privacy Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-[#5B3A2A]">Refund & Return</Link></li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/4 mb-6">
          <h2 className="font-headings text-sm md:text-base font-semibold text-[#5B3A2A] mb-2">Help</h2>
          <ul className="font-texts text-xs md:text-sm font-semibold text-[#5B3A2A]/70 space-y-1 md:space-y-2">
            <li>Contact Us: nilayrathod129@gmail.com</li>
            <li>Customer Service: +91 9324263899</li>
            <li><Link to="/terms-conditions" className="hover:text-[#5B3A2A]">Terms & Conditions</Link></li>
            <li><Link to="/shippingPolicy" className="hover:text-[#5B3A2A]">Shipping & Delivery Policy</Link></li>
          </ul>
        </div>

        {/* Socials Section */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/4 mb-6">
          <h2 className="font-headings text-sm md:text-base font-semibold text-[#5B3A2A] mb-2">Socials</h2>
          <ul className="font-texts text-xs md:text-sm font-semibold text-[#5B3A2A]/70 space-y-1 md:space-y-2">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#5B3A2A]"><InstagramIcon fontSize="small" /> <span className="ml-2">Instagram</span></a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#5B3A2A]"><FacebookIcon fontSize="small" /> <span className="ml-2">Facebook</span></a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[#5B3A2A]"><XIcon fontSize="small" /> <span className="ml-2">Twitter</span></a></li>
          </ul>
        </div>

        {/* Address Section */}
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/4 mb-6">
          <h2 className="font-headings text-sm md:text-base font-semibold text-[#5B3A2A] mb-2">Our Address</h2>
          <address className="font-texts text-xs md:text-sm font-semibold text-[#5B3A2A]/70 not-italic space-y-1 md:space-y-2">
            <p>Kura Fashion</p>
            <p>Flat 401 - Harmony Bldg, Kharkar Alley</p>
            <p>Thane West, Maharashtra, 400601</p>
            <p>India</p>
          </address>
        </div>

      </div>
      <div className="text-center text-xs md:text-sm text-[#5B3A2A]/50 mt-4">
        © {new Date().getFullYear()} Kura Fashion. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterLinks;