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
    speed: 800, // Increased speed for faster transitions
    autoplaySpeed: 4000, // Slightly longer display time
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // Smooth easing function
    fade: true,
    pauseOnHover: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false // Hide arrows on mobile
        }
      }
    ]
  };

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await axios.get('/slider/all');
        setSliderData(response.data.data);
      } catch (error) {
        console.error('Error fetching slider data:', error);
      }
    };
    
    fetchSliderData();
  }, []);

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

  return (
    <div className="w-full relative mt-20">
      <Slider ref={sliderRef} {...settings} className="w-full">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className={`w-full px-sectionPadding py-8 relative 
              ${backgroundColorClasses[index % backgroundColorClasses.length]}`}
          >
            <div className='flex justify-between max-md:flex-col-reverse items-center w-full'>
              <div className='flex flex-col justify-evenly items-start w-1/2 max-md:w-full'>
                <h2 className='font-headings text-[#5B3A2A] text-3xl sm:text-4xl lg:text-5xl font-bold my-3'>
                  {slide.name}
                </h2>
                <p className='text-base max-mobileL:text-sm font-texts text-[#5B3A2A]/80'>
                  {slide.description}
                </p>
                <div className="flex items-center text-xs mt-4 text-[#5B3A2A] font-semibold font-headings">
                  <Link to='/shop' className="hover:underline transition duration-150 ease-in-out">
                    View Collection
                  </Link>
                  <ArrowRightAltOutlinedIcon style={{ fontSize: "small", paddingTop: "3px" }} />
                </div>
              </div>
              <div className='flex justify-center items-center'>
                <img
                  src={slide.image}
                  className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain"
                  alt={slide.title}
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