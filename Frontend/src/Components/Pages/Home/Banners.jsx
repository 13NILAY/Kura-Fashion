import React, { useState, useEffect, useRef } from 'react';
import banner1 from '../../../assets/banner1.jpg'; // Adjust the path as needed
import banner2 from '../../../assets/banner2.jpg'; // Adjust the path as needed
import { axiosPrivate } from '../../../api/axios';
import axios from '../../../api/axios';

const Banners = () => {

  const BANNER_DATA_API = '/banner/all';

  const [bannerData, setBannerData] = useState([]);
  const bannerRef = useRef(null);

  useEffect(() => {
    // Fetch data from backend
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(BANNER_DATA_API);
        console.log(response);
        setBannerData(response.data.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };

    fetchBannerData();
  }, []);

  return (
    <div className='px-sectionPadding flex max-sm:flex-col justify-between items-center w-full mt-10 gap-6'>
      {/* Loop through banner data */}
      {bannerData.map((banner, index) => (
        <div
          key={index} // Each item must have a unique key
          className='w-1/2 max-sm:w-full bg-cover bg-center h-80 text-[#F4E1D2] font-semibold p-6 rounded-lg shadow-md shadow-[#6B4F3A] transition-transform duration-300 hover:scale-105' 
          style={{ backgroundImage: `url(${banner.image})`, backgroundColor: '#8A5D3B' }}
        >
          {/* <img
            src={banner.image}
            className="h-96 max-md:h-80 max-[530px]:h-64 max-mobileM:h-52"
            alt={banner.title} // Updated the reference here
          /> */}
          <p className='text-5xl font-headings max-mobileL:text-4xl'>{banner.title}</p>
          <p className='text-xl font-texts mt-4 max-mobileL:text-lg'>{banner.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Banners;
