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
      ${isScrolled ? 'bg-[#EFE5D5] shadow-md' : 'bg-[#EFE5D5] shadow-md'} 
      text-[#5B3A2A] transition-all duration-300 ease-in-out`}>
      <nav className="flex justify-between items-center w-full">
        <div className="flex items-center h-full">
          <Link to="/" className="flex items-center h-full">
            <img 
              src={logo} 
              alt="Kura Fashion Logo" 
              className="h-full max-h-16 w-auto object-contain" 
            />
          </Link>
        </div>

        <ul className="hidden md:flex justify-between items-center font-semibold text-base space-x-4">
          {['/', '/shop', '/about'].map((path, index) => (
            <li key={index} className="group">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `relative pb-1 transition duration-300 ease-in-out ${
                    isActive
                      ? `text-[#A6896D] after:content-[""] after:w-full after:absolute after:h-[0.1rem] after:bg-[#A6896D] after:bottom-0 after:left-0`
                      : `hover:text-[#A6896D] after:content-[""] after:w-0 after:absolute after:h-[0.1rem] after:bg-[#A6896D] after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full`
                  }`
                }
              >
                {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `transition duration-300 hover:text-[#A6896D] ${
                  isActive ? 'text-[#A6896D]' : ''
                }`
              }
            >
              <ShoppingBagOutlinedIcon />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `transition duration-300 hover:text-[#A6896D] ${
                  isActive ? 'text-[#A6896D]' : ''
                }`
              }
            >
              <AccountCircleOutlinedIcon />
            </NavLink>
          </li>
        </ul>

        <div
          className="md:hidden cursor-pointer transition-transform duration-300 transform hover:scale-110"
          onClick={() => setSidebar(true)}
        >
          <MenuIcon />
        </div>
      </nav>

      {sidebar && (
        <div className="fixed inset-0 bg-[#EFE5D5]/60 z-40">
          <div
            className="w-2/3 h-full fixed top-0 right-0 bg-[#EFE5D5] shadow-lg p-6 z-50"
            onClick={() => setSidebar(false)}
          >
            <div className="text-[#A6896D] text-3xl absolute top-4 right-4 cursor-pointer transition-transform duration-300 transform hover:scale-110">
              <CloseIcon />
            </div>
            <nav className="flex flex-col items-start mt-16 space-y-8">
              {['/', '/shop', '/about', '/cart', '/account'].map((path, index) => (
                <NavLink
                  key={index}
                  to={path}
                  className={({ isActive }) =>
                    `block text-lg font-semibold transition duration-300 ${
                      isActive ? 'text-[#A6896D]' : ''
                    } hover:text-[#A6896D]`
                  }
                  onClick={() => setSidebar(false)}
                >
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;