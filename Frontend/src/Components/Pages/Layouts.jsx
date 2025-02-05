import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layouts = () => {
  return (
    <main className='bg-[#F4E1D2] w-full flex flex-col min-h-screen'>
      {/* Header Component */}
      <Header />

      {/* Content Outlet */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>

      {/* Footer Component */}
      <Footer />
    </main>
  );
};

export default Layouts;
