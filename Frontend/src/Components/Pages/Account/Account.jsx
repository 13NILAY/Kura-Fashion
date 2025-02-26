import React, { useState, useEffect } from 'react';
import orders from '../../../assets/Orders.jpg';
import address from '../../../assets/address.png';
import account from '../../../assets/account.png';
import admin from '../../../assets/Admin.png';
import ScrollToTop from '../../../ScrollToTop';
import { Link } from 'react-router-dom';
// import SignInPage from '../../SignIn/SignInPage';
import Login from '../../SignIn/Login';
import logout1 from '../../../assets/logout.png';
import useLogout from '../../../hooks/useLogout';
import useAuth from '../../../hooks/useAuth';

const Account = () => {
  const logout = useLogout();
  const { auth } = useAuth();
  const [loggedin, setLoggedin] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);

  // Use useEffect to prevent direct state changes in the body
  useEffect(() => {
    if (auth && auth.isAuthenticated) {
      setLoggedin(true);
    }
    if (auth && auth.roles && auth.roles.includes(5150)) {
      setAdminLogin(true);
    }
  }, [auth]); // This effect will run when the auth object changes

  const handleClick = async () => {
    await logout();
    setLoggedin(false); // Set logged in state to false after logout
  };

  return (
    <>
      <ScrollToTop />
      {!loggedin && <Login />}

      {loggedin && (
        <div className='mt-20 px-sectionPadding max-md:px-mobileScreenPadding'>
          <div className='mt-10 text-typography'>
            <p className='text-4xl max-mobileM:text-3xl font-headings text-black font-semibold'>YOUR ACCOUNT</p>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-between my-10 gap-10'>
              {/* Your Orders */}
              <Link
                to='/account/my-orders'
                className='px-4 py-6 border border-typography flex justify-between items-center font-texts font-semibold rounded-md cursor-pointer hover:bg-gray-400/10 max-sm:w-3/4 max-[470px]:w-full'
              >
                <img src={orders} className='h-28 max-mobileM:h-24 p-2' />
                <div className='h-full flex flex-col justify-center items-start py-6'>
                  <p className='text-xl font-bold'>Your Orders</p>
                  <p className='text-sm '>View, Track and Return your orders here</p>
                </div>
              </Link>

              {/* Account Details */}
              {/* <Link
                to='/account/account-details'
                className='px-4 py-6 border border-typography flex justify-between items-center font-texts font-semibold rounded-md cursor-pointer hover:bg-gray-400/10 max-sm:w-3/4 max-[470px]:w-full'
              >
                <img src={account} className='h-28 max-mobileM:h-24 p-2' />
                <div className='h-full flex flex-col justify-center items-start py-6'>
                  <p className='text-xl font-bold'>Account Details</p>
                  <p className='text-sm '>Get your account details here</p>
                </div>
              </Link> */}

              {/* Address */}
              <Link
                to='/account/address'
                className='px-4 py-6 border border-typography flex justify-between items-center font-texts font-semibold rounded-md cursor-pointer hover:bg-gray-400/10 max-sm:w-3/4 max-[470px]:w-full'
              >
                <img src={address} className='h-28 max-mobileM:h-24 p-2 ' />
                <div className='h-full flex flex-col justify-center items-start py-6'>
                  <p className='text-xl font-bold'>Address</p>
                  <p className='text-sm '>View and Edit addresses for orders and gifts</p>
                </div>
              </Link>

              {/* Admin Section */}
              {adminLogin && (
                <Link
                  to='/account/admin'
                  className='px-4 py-6 border border-typography flex justify-between items-center font-texts font-semibold rounded-md cursor-pointer hover:bg-gray-400/10 max-sm:w-3/4 max-[470px]:w-full'
                >
                  <img src={admin} className='h-28 max-mobileM:h-24 p-2 ' />
                  <div className='h-full flex flex-col justify-center items-start py-6'>
                    <p className='text-xl font-bold'>ADMIN</p>
                    <p className='text-sm'>All information and details here</p>
                  </div>
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={handleClick}
                className='px-4 py-6 border border-typography flex justify-between items-center font-texts font-semibold rounded-md cursor-pointer hover:bg-gray-400/10 max-sm:w-3/4 max-[470px]:w-full'
              >
                <img src={logout1} className='h-28 max-mobileM:h-24 p-2 ' />
                <div className='h-full flex flex-col justify-center items-start py-6'>
                  <p className='text-xl font-bold'>Log Out</p>
                  <p className='text-sm '>Sign Out from your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
