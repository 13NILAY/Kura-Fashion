import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import axios from "../../../api/axios";

// Assuming the API endpoint to fetch slider data
const SLIDER_DATA_API = '/slider/all';

const HomeSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 850,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchSliderData = async () => {
      try {
        const response = await axios.get('/slider/all');
        console.log(response);
       
        setSliderData(response.data.data);
      } catch (error) {
        console.error('Error fetching slider data:', error);
      }
    };

    fetchSliderData();
  }, []);

  return (
    <div className="w-full my-20 relative">
      <Slider ref={sliderRef} {...settings} className="w-full">
        {sliderData.map((slide, index) => {
          // Define background colors based on index
          const backgroundColorClasses = [
            'bg-[#F4D3C4]', // Warm Beige
            'bg-[#C4A68A]', // Sand Dune
            // 'bg-[#6D4C41]', // Cinnamon Brown
            // 'bg-[#8B6D5C]', // Taupe
            // 'bg-[#C69C6C]', // Caramel  see
            'bg-[#D8B4A6]', // Warm Taupe
            // 'bg-[#4B3A30]', // Coffee
            // 'bg-[#6D3F2D]', // Chestnut
            // 'bg-[#F2E5D5]', // Moccasin
            'bg-[#A67B5B]', // Toffee
            'bg-[#F3D9D1]' 
          ];
          
          return (
            <div
              key={index}
              className={`w-full px-sectionPadding py-10 relative ${backgroundColorClasses[index % backgroundColorClasses.length]}`}
            >
              <div className='flex justify-between max-md:flex-col-reverse items-center w-full'>
                <div className='flex flex-col justify-evenly items-start w-1/2 max-md:w-full'>
                  <p className='font-headings text-[#5B3A2A] text-5xl max-mobileL:text-4xl max-mobileL:font-semibold my-2'>
                    {slide.name}
                  </p>
                  <p className='text-base max-mobileL:text-sm font-texts text-[#5B3A2A]/80'>
                    {slide.description}
                  </p>
                  <div className="flex items-center text-sm mt-8 text-[#5B3A2A] font-semibold font-headings">
                    <Link to='/shop' className="hover:underline transition duration-150 ease-in-out">
                      View Collection
                    </Link>
                    <ArrowRightAltOutlinedIcon style={{ fontSize: "x-large", paddingTop: "3px" }} />
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  <img
                    src={slide.image}
                    className="h-96 max-md:h-80 max-[530px]:h-64 max-mobileM:h-52"
                    alt={slide.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      {/* Navigation Arrows */}
      <div className="h-10 w-10 rounded-full border-[#5B3A2A] border cursor-pointer text-[#5B3A2A] flex justify-center items-center absolute left-5 top-1/2" onClick={previous}>
        <ChevronLeftOutlinedIcon />
      </div>
      <div className="h-10 w-10 rounded-full border-[#5B3A2A] border cursor-pointer text-[#5B3A2A] flex justify-center items-center absolute right-5 top-1/2" onClick={next}>
        <ChevronRightOutlinedIcon />
      </div>
    </div>
  );
};

export default HomeSlider;
