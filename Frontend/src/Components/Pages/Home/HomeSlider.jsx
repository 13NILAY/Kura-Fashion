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
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Custom arrow components with KURA styling
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full 
        bg-[#3A2E2E]/80 hover:bg-[#3A2E2E] backdrop-blur-sm transition-all duration-300 
        flex items-center justify-center text-[#D4A373] hover:text-[#EADBC8] 
        shadow-lg hover:shadow-xl hover:shadow-[#3A2E2E]/30 hover:scale-110
        border border-[#D4A373]/30 hover:border-[#D4A373]/60"
    >
      <KeyboardArrowRightIcon className="text-2xl" />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full 
        bg-[#3A2E2E]/80 hover:bg-[#3A2E2E] backdrop-blur-sm transition-all duration-300 
        flex items-center justify-center text-[#D4A373] hover:text-[#EADBC8] 
        shadow-lg hover:shadow-xl hover:shadow-[#3A2E2E]/30 hover:scale-110
        border border-[#D4A373]/30 hover:border-[#D4A373]/60"
    >
      <KeyboardArrowLeftIcon className="text-2xl" />
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
    speed: 800,
    autoplaySpeed: 5000,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fade: true,
    pauseOnHover: true,
    swipe: true,
    waitForAnimate: false,
    lazyLoad: null,
    initialSlide: 0,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          fade: false,
          speed: 500
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
      if (e.keyCode === 37) {
        sliderRef.current?.slickPrev();
      } else if (e.keyCode === 39) {
        sliderRef.current?.slickNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Premium gradient backgrounds for each slide
  const backgroundGradients = [
    'bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]',
    'bg-gradient-to-br from-[#EADBC8] via-[#D4A373] to-[#3A2E2E]/20',
    'bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8]/80 to-[#D4A373]/60',
    'bg-gradient-to-br from-[#D4A373]/30 via-[#EADBC8] to-[#F8F5F2]',
    'bg-gradient-to-br from-[#EADBC8]/90 via-[#F8F5F2] to-[#D4A373]/40'
  ];

  // Loading state with premium design
  if (isLoading) {
    return (
      <div className="w-full relative mt-20 min-h-[500px] bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]">
        <div className="container mx-auto px-4 sm:px-8 py-16 flex items-center justify-center h-full">
          <div className="text-center">
            {/* Elegant loading spinner */}
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-[#D4A373]/30 border-t-[#3A2E2E] rounded-full animate-spin mx-auto">
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-[#D4A373] rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-[#3A2E2E]/20 rounded-lg w-80 max-w-full mx-auto animate-pulse"></div>
              <div className="h-6 bg-[#3A2E2E]/15 rounded-lg w-64 max-w-full mx-auto animate-pulse"></div>
              <div className="h-6 bg-[#3A2E2E]/10 rounded-lg w-48 max-w-full mx-auto animate-pulse"></div>
            </div>
            <p className="text-[#3A2E2E] font-medium mt-6 text-lg">
              Crafting your premium experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sliderData.length) {
    return null;
  }

  return (
    <div className="w-full relative mt-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4A373]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#3A2E2E]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <Slider ref={sliderRef} {...settings} className="w-full">
        {sliderData.map((slide, index) => (
          <div key={index} className="relative">
            <div className={`w-full px-4 sm:px-8 py-16 sm:py-20 relative min-h-[500px] sm:min-h-[600px] 
              ${backgroundGradients[index % backgroundGradients.length]}`}>
              
              {/* Content Container */}
              <div className='container mx-auto'>
                <div className='flex justify-between max-lg:flex-col-reverse items-center w-full gap-8 lg:gap-12'>
                  {/* Text Content */}
                  <div className='flex flex-col justify-center items-start w-full lg:w-1/2 space-y-6 lg:space-y-8'>
                    {/* Slide indicator */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-12 h-0.5 bg-[#D4A373]"></div>
                      <span className="text-[#3A2E2E]/60 text-sm font-medium tracking-widest uppercase">
                        Collection {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Main Heading */}
                    <h1 className='font-headings text-[#3A2E2E] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 
                      font-light leading-tight tracking-tight'>
                      <span className="block">{slide.name.split(' ')[0]}</span>
                      <span className="block text-[#D4A373] font-normal">
                        {slide.name.split(' ').slice(1).join(' ')}
                      </span>
                    </h1>
                    
                    {/* Description */}
                    <p className='text-lg sm:text-xl font-texts text-[#3A2E2E]/80 max-w-xl leading-relaxed'>
                      {slide.description}
                    </p>
                    
                    {/* CTA Button */}
                    <div className="flex items-center space-x-6 pt-4">
                      <Link 
                        to='/shop' 
                        className="group inline-flex items-center px-8 py-4 bg-[#3A2E2E] text-[#EADBC8] 
                          font-semibold font-headings rounded-full transition-all duration-300 
                          hover:bg-[#2C2C2C] hover:shadow-xl hover:shadow-[#3A2E2E]/30 
                          hover:scale-105 transform"
                      >
                        <span className="mr-3">Explore Collection</span>
                        <ArrowRightAltOutlinedIcon className="transition-transform duration-300 group-hover:translate-x-2" />
                      </Link>
                      
                      {/* Secondary link */}
                      <Link 
                        to='/about' 
                        className="text-[#3A2E2E] font-medium hover:text-[#D4A373] 
                          transition-colors duration-300 border-b-2 border-transparent 
                          hover:border-[#D4A373] pb-1"
                      >
                        Our Story
                      </Link>
                    </div>
                  </div>
                  
                  {/* Image Content */}
                  <div className='w-full lg:w-1/2 flex justify-center items-center relative'>
                    {/* Image container with premium styling */}
                    <div className="relative group">
                      {/* Decorative background */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A373]/20 to-[#3A2E2E]/10 
                        rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                      
                      {/* Main image */}
                      <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 
                        shadow-2xl hover:shadow-3xl transition-all duration-500 
                        border border-white/30">
                        <img
                          src={slide.image}
                          className="h-64 sm:h-80 lg:h-96 w-auto object-contain mx-auto 
                            transition-transform duration-700 group-hover:scale-105"
                          alt={slide.name}
                          loading="eager"
                          fetchPriority="high"
                        />
                      </div>
                      
                      {/* Floating accent */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#D4A373]/20 
                        rounded-full blur-xl animate-bounce" style={{animationDuration: '3s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide Progress Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {sliderData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => sliderRef.current?.slickGoTo(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentSlide 
                        ? 'bg-[#3A2E2E] scale-125 shadow-lg' 
                        : 'bg-[#3A2E2E]/30 hover:bg-[#3A2E2E]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;