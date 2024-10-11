import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { motion, AnimatePresence } from 'framer-motion';

const SignInPage = () => {
  const [login, setLogin] = useState(false);

  return (
    <>
      <div className='min-h-screen flex flex-col justify-center items-center w-full bg-[#F4E1D2] overflow-y-auto'>
        {/* Login/Register Toggle */}
        <div className='text-[#8A5D3B] w-full md:w-3/5 lg:w-2/5 font-headings flex flex-wrap items-center justify-around mb-8'>
          <button
            className={`text-lg md:text-2xl lg:text-[2.7rem] ${login ? 'text-[#4A2C2A]' : 'text-gray-400'} duration-200 ease-in-out border-none outline-none`}
            onClick={() => { setLogin(true); }}>
            Login
          </button>
          <div className='h-12 w-12 rounded-full border-4 border-gray-400 text-lg md:text-2xl font-bold font-texts flex justify-center items-center'>
            OR
          </div>
          <button
            className={`text-lg md:text-2xl lg:text-[2.7rem] ${!login ? 'text-[#4A2C2A]' : 'text-gray-400'} duration-200 ease-in-out border-none outline-none`}
            onClick={() => { setLogin(false); }}>
            Register
          </button>
        </div>

        {/* Login/Register Form */}
        <AnimatePresence>
          <div className='bg-[#F9EFE6] w-full max-w-screen-md border-[#8A5D3B] border-2 flex flex-col px-5 py-10 rounded-lg shadow-lg overflow-hidden'>
            {login ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}>
                <Login />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}>
                <Register />
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default SignInPage;
