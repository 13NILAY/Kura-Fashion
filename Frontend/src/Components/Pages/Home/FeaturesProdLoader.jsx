import React from 'react';

const ProductSkeleton = () => (
  <div className='flex flex-col items-start justify-start rounded-lg border border-[#5c4033]/20 p-4 my-5 bg-[#F4E1D2]/50 animate-pulse'>
    <div className='bg-[#f9f4f1] rounded-lg overflow-hidden h-80 w-full'>
      <div className='w-full h-full bg-gray-300'></div>
    </div>
    <div className='mx-1 mt-4 w-full'>
      <div className='h-6 bg-gray-300 mb-2 w-3/4'></div>
      <div className='h-5 bg-gray-300 w-1/2'></div>
      <div className='flex mt-2'>
        {[...Array(5)].map((_, index) => (
          <div key={index} className='h-5 w-5 bg-gray-300 mr-1'></div>
        ))}
      </div>
    </div>
  </div>
);

const FeaturedProdsLoader = () => {
  return (
    <div className='px-sectionPadding max-md:px-mobileScreenPadding text-[#4A2C2A] w-full'>
      <div className='flex flex-col justify-center items-center mb-10'>
        <div className='h-10 bg-gray-300 w-1/2'></div>
      </div>

      <div className='grid sm:grid-cols-3 gap-x-6 my-10 max-sm:grid-cols-2 max-mobileL:grid-cols-1'>
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>

      <div className='w-full flex justify-center items-center'>
        <div className='h-12 w-48 bg-gray-300 rounded-sm'></div>
      </div>
    </div>
  );
};

export default FeaturedProdsLoader;