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
    <div className='px-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full mt-8 sm:mt-10'>
      {bannerData.map((banner, index) => (
        <div
          key={index}
          className='w-full sm:w-1/2 bg-cover bg-center h-64 sm:h-72 lg:h-80 text-[#F4E1D2] p-4 sm:p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02]' 
          style={{ backgroundImage: `url(${banner.image})`, backgroundColor: '#8A5D3B' }}
        >
          <h3 className='text-3xl sm:text-4xl lg:text-5xl font-headings mb-3'>{banner.title}</h3>
          <p className='text-base sm:text-lg font-texts'>{banner.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Banners;
