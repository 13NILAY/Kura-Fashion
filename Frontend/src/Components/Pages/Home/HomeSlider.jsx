import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from "../../../api/axios";

const HomeSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef(null);

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full 
        bg-white/50 hover:bg-white transition-all duration-200 flex items-center justify-center
        text-[#5B3A2A] hover:text-[#5B3A2A]/80"
    >
      <KeyboardArrowRightIcon />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full 
        bg-white/50 hover:bg-white transition-all duration-200 flex items-center justify-center
        text-[#5B3A2A] hover:text-[#5B3A2A]/80"
    >
      <KeyboardArrowLeftIcon />
    </button>
  );

  const settings = {
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 300, // Faster initial load
    autoplaySpeed: 4000, // Slightly longer display time
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth easing function
    fade: false, // Disable fade initially
    pauseOnHover: true,
    swipe: true,
    waitForAnimate: false, // Prevents animation queue buildup
    lazyLoad: null, // Remove lazy loading
    initialSlide: 0,
    beforeChange: (current, next) => {
      // Enable fade effect after first render
      if (current === 0 && next === 1) {
        settings.fade = true;
        settings.speed = 500;
      }
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false, // Hide arrows on mobile
          fade: false, // Disable fade on mobile for better performance
          speed: 300
        }
      }
    ]
  };

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/slider/all');
        setSliderData(response.data.data);
      } catch (error) {
        console.error('Error fetching slider data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSliderData();
  }, []);

  // Preload images
  useEffect(() => {
    if (sliderData.length > 0) {
      sliderData.forEach(slide => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, [sliderData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 37) { // Left arrow
        sliderRef.current?.slickPrev();
      } else if (e.keyCode === 39) { // Right arrow
        sliderRef.current?.slickNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const backgroundColorClasses = [
    'bg-[#F4D3C4]',
    'bg-[#C4A68A]',
    'bg-[#D8B4A6]',
    'bg-[#A67B5B]',
    'bg-[#F3D9D1]'
  ];

  // Manual navigation methods
  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  if (isLoading) {
    return (
      <div className="w-full relative mt-20 min-h-[300px] bg-[#F4D3C4] animate-pulse">
        <div className="container mx-auto px-4 sm:px-sectionPadding py-8">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <div className="h-8 bg-[#5B3A2A]/20 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-[#5B3A2A]/20 rounded w-full mb-2"></div>
              <div className="h-4 bg-[#5B3A2A]/20 rounded w-2/3"></div>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="w-48 h-48 rounded-lg bg-[#5B3A2A]/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sliderData.length) {
    return null;
  }

  return (
    <div className="w-full relative mt-20">
      <Slider ref={sliderRef} {...settings} className="w-full">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`w-full px-4 sm:px-sectionPadding py-8 relative 
              ${backgroundColorClasses[index % backgroundColorClasses.length]}`}
          >
            <div className='flex justify-between max-md:flex-col-reverse items-center w-full gap-6'>
              <div className='flex flex-col justify-evenly items-start w-full md:w-1/2 space-y-4'>
                <h2 className='font-headings text-[#5B3A2A] text-2xl sm:text-4xl lg:text-5xl font-bold'>
                  {slide.name}
                </h2>
                <p className='text-sm sm:text-base font-texts text-[#5B3A2A]/80 max-w-prose'>
                  {slide.description}
                </p>
                <Link 
                  to='/shop' 
                  className="inline-flex items-center text-sm sm:text-base text-[#5B3A2A] font-semibold font-headings hover:underline transition duration-150"
                >
                  View Collection
                  <ArrowRightAltOutlinedIcon className="ml-1" />
                </Link>
              </div>
              <div className='w-full md:w-1/2 flex justify-center items-center'>
                <img
                  src={slide.image}
                  className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain"
                  alt={slide.name}
                  loading="eager" // Load first image immediately
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;