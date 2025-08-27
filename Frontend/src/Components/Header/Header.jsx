import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.jpg";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const changeSize = () => {
    if (window.innerWidth >= 768) setSidebar(false);
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('resize', changeSize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', changeSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`h-20 w-full z-50 fixed top-0 left-0 font-texts flex justify-between items-center px-4 md:px-8 
      ${isScrolled 
        ? 'bg-[#3A2E2E] shadow-xl backdrop-blur-md border-b border-[#D4A373]/20' 
        : 'bg-[#3A2E2E] shadow-lg'
      } 
      text-[#EADBC8] transition-all duration-500 ease-out`}>
      
      <nav className="flex justify-between items-center w-full">
        {/* Logo Section */}
        <div className="flex items-center h-full">
          <Link 
            to="/" 
            className="flex items-center h-full group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="Kura Fashion Logo" 
                className="h-12 md:h-16 w-auto object-contain transition-all duration-300 group-hover:brightness-110" 
              />
              {/* Elegant glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-[#D4A373]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-between items-center font-semibold text-base space-x-8">
          {['/', '/shop', '/about'].map((path, index) => (
            <li key={index} className="group">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `relative pb-2 px-3 py-2 rounded-lg transition-all duration-300 ease-out ${
                    isActive
                      ? `text-[#D4A373] bg-[#D4A373]/10 after:content-[""] after:w-full after:absolute after:h-[0.15rem] after:bg-gradient-to-r after:from-[#D4A373] after:to-[#EADBC8] after:bottom-0 after:left-0 after:rounded-full`
                      : `text-[#EADBC8] hover:text-[#D4A373] hover:bg-[#D4A373]/5 after:content-[""] after:w-0 after:absolute after:h-[0.15rem] after:bg-gradient-to-r after:from-[#D4A373] after:to-[#EADBC8] after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:transition-all after:duration-300 after:rounded-full hover:after:w-full`
                  }`
                }
              >
                <span className="relative z-10">
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </span>
              </NavLink>
            </li>
          ))}
          
          {/* Cart Icon */}
          <li className="group">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'text-[#D4A373] bg-[#D4A373]/15 shadow-lg shadow-[#D4A373]/20' 
                    : 'text-[#EADBC8] hover:text-[#D4A373] hover:bg-[#D4A373]/10 hover:shadow-md hover:shadow-[#D4A373]/10'
                }`
              }
            >
              <ShoppingBagOutlinedIcon className="transition-transform duration-200 group-hover:scale-110" />
              {/* Cart badge placeholder */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4A373] text-[#3A2E2E] text-xs rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                0
              </span>
            </NavLink>
          </li>
          
          {/* Account Icon */}
          <li className="group">
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `relative p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'text-[#D4A373] bg-[#D4A373]/15 shadow-lg shadow-[#D4A373]/20' 
                    : 'text-[#EADBC8] hover:text-[#D4A373] hover:bg-[#D4A373]/10 hover:shadow-md hover:shadow-[#D4A373]/10'
                }`
              }
            >
              <AccountCircleOutlinedIcon className="transition-transform duration-200 group-hover:scale-110" />
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-[#D4A373]/10 hover:text-[#D4A373]"
          onClick={() => setSidebar(true)}
        >
          <MenuIcon className="text-2xl" />
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebar && (
        <div className="fixed inset-0 bg-[#3A2E2E]/80 backdrop-blur-sm z-40 md:hidden">
          <div
            className="w-4/5 max-w-sm h-full fixed top-0 right-0 bg-gradient-to-br from-[#3A2E2E] to-[#2C2C2C] shadow-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#D4A373]/20">
              <div className="flex items-center">
                <img 
                  src={logo} 
                  alt="Kura Fashion Logo" 
                  className="h-10 w-auto object-contain mr-3" 
                />
                <span className="text-[#D4A373] font-bold text-lg">KURA</span>
              </div>
              <button
                className="text-[#D4A373] text-2xl p-2 rounded-full hover:bg-[#D4A373]/10 transition-all duration-200"
                onClick={() => setSidebar(false)}
              >
                <CloseIcon />
              </button>
            </div>
            
            {/* Sidebar Navigation */}
            <nav className="flex flex-col p-6 space-y-2">
              {['/', '/shop', '/about', '/cart', '/account'].map((path, index) => (
                <NavLink
                  key={index}
                  to={path}
                  className={({ isActive }) =>
                    `block px-4 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'text-[#D4A373] bg-[#D4A373]/15 shadow-lg border-l-4 border-[#D4A373]' 
                        : 'text-[#EADBC8] hover:text-[#D4A373] hover:bg-[#D4A373]/10 hover:translate-x-2'
                    }`
                  }
                  onClick={() => setSidebar(false)}
                >
                  <div className="flex items-center space-x-3">
                    {path === '/cart' && <ShoppingBagOutlinedIcon />}
                    {path === '/account' && <AccountCircleOutlinedIcon />}
                    <span>
                      {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                    </span>
                  </div>
                </NavLink>
              ))}
            </nav>
            
            {/* Sidebar Footer */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-center text-[#EADBC8]/60 text-sm border-t border-[#D4A373]/20 pt-4">
                <p>Premium Fashion Collection</p>
              </div>
            </div>
          </div>
          
          {/* Overlay - click to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setSidebar(false)}
          ></div>
        </div>
      )}
    </header>
  );
};

export default Header;