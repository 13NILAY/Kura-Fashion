import React from 'react';
import banner1 from '../../../assets/banner1.jpg'; // Adjust the path as needed
import banner2 from '../../../assets/banner2.jpg'; // Adjust the path as needed

const Banners = () => {
  return (
    <div className='px-sectionPadding flex max-sm:flex-col justify-between items-center w-full mt-10 gap-6'>
      {/* Banner 1 */}
      <div 
        className='w-1/2 max-sm:w-full bg-cover bg-center h-80 text-[#F4E1D2] font-semibold p-6 rounded-lg shadow-md shadow-[#6B4F3A] transition-transform duration-300 hover:scale-105' 
        style={{ backgroundImage: `url(${banner1})`, backgroundColor: '#8A5D3B' }}
      >
        <p className='text-5xl font-headings max-mobileL:text-4xl'>Spring/Summer</p>
        <p className='text-3xl font-texts max-mobileL:text-2xl mt-2'>Upcoming Season</p>
        <p className='text-xl font-texts mt-4 max-mobileL:text-lg'>The best classic dress is on sale</p>
      </div>

      {/* Banner 2 */}
      <div 
        className='w-1/2 max-sm:w-full bg-cover bg-center h-80 text-[#F4E1D2] font-semibold p-6 rounded-lg shadow-md shadow-[#6B4F3A] transition-transform duration-300 hover:scale-105' 
        style={{ backgroundImage: `url(${banner2})`, backgroundColor: '#8A5D3B' }}
      >
        <p className='text-5xl font-headings max-mobileL:text-4xl'>Spring/Summer</p>
        <p className='text-3xl font-texts max-mobileL:text-2xl mt-2'>Upcoming Season</p>
        <p className='text-xl font-texts mt-4 max-mobileL:text-lg'>The best classic dress is on sale</p>
      </div>
    </div>
  );
};

export default Banners;
