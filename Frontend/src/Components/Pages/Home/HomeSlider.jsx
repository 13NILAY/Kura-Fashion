import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import axios from "../../../api/axios";

const HomeSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const sliderRef = useRef(null);

  const settings = {
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear",
    fade: true
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

  const backgroundColorClasses = [
    'bg-[#F4D3C4]',
    'bg-[#C4A68A]',
    'bg-[#D8B4A6]',
    'bg-[#A67B5B]',
    'bg-[#F3D9D1]'
  ];

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
                <h2 className='font-headings text-[#5B3A2A] text-5xl max-md:text-4xl max-mobileL:text-3xl my-4 font-bold'>
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
                  className="h-64 max-md:h-52 max-[530px]:h-40 max-mobileM:h-32"
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