import React, { useState, useEffect } from 'react';
import ScrollToTop from '../../../ScrollToTop';
import HomeSlider from './HomeSlider';
import FeaturedProds from './FeaturedProds';
import Banners from './Banners';
import DynamicLoader from './DynamicLoader';

const Home = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    const savedData = localStorage.getItem('firstLoadComplete');
    if (!savedData) return true;

    try {
      const { timestamp } = JSON.parse(savedData);
      const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // Check if more than a day has passed
      if (Date.now() - timestamp > ONE_DAY) {
        localStorage.removeItem('firstLoadComplete');
        return true;
      }
      
      return false;
    } catch (error) {
      // If there's any error parsing the data, treat it as first load
      localStorage.removeItem('firstLoadComplete');
      return true;
    }
  });

  const handleLoadComplete = () => {
    setIsFirstLoad(false);
    // Save the current timestamp along with the flag
    const data = {
      completed: true,
      timestamp: Date.now()
    };
    localStorage.setItem('firstLoadComplete', JSON.stringify(data));
  };

  // Optional: Clean up expired data on component mount
  useEffect(() => {
    const cleanupStorage = () => {
      const savedData = localStorage.getItem('firstLoadComplete');
      if (savedData) {
        try {
          const { timestamp } = JSON.parse(savedData);
          const ONE_DAY = 24 * 60 * 60 * 1000;
          if (Date.now() - timestamp > ONE_DAY) {
            localStorage.removeItem('firstLoadComplete');
          }
        } catch (error) {
          localStorage.removeItem('firstLoadComplete');
        }
      }
    };

    cleanupStorage();
  }, []);

  return (
    <>
      {isFirstLoad ? (
        <DynamicLoader onComplete={handleLoadComplete} />
      ) : (
        <>
          <ScrollToTop/>
          <HomeSlider/>
          <FeaturedProds/>
          <Banners/>
        </>
      )}
    </>
  );
};

export default Home;