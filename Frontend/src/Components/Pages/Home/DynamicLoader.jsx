import React, { useState, useEffect } from 'react';
import { 
  LocalMallOutlined, 
  ShoppingCartOutlined, 
  StarBorderOutlined, 
  LocalShippingOutlined, 
  PaymentOutlined, 
  SpaOutlined,
  DiamondOutlined,
  ColorLensOutlined,
  FavoriteOutlined
} from '@mui/icons-material';

const DynamicLoader = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const icons = [
    { Icon: LocalMallOutlined, text: "Exploring Exclusive Collections", color: "#8A5D3B" },
    { Icon: ShoppingCartOutlined, text: "Preparing Your Personalized Experience", color: "#5B3A2A" },
    { Icon: StarBorderOutlined, text: "Curating Premium Products", color: "#A6896D" },
    { Icon: LocalShippingOutlined, text: "Optimizing Delivery Networks", color: "#6D4C41" },
    { Icon: PaymentOutlined, text: "Securing Advanced Payment Gateways", color: "#40322E" },
    { Icon: SpaOutlined, text: "Crafting Your Unique Fashion Journey", color: "#4A2C2A" },
    { Icon: DiamondOutlined, text: "Polishing Luxurious Details", color: "#8B6D5C" },
    { Icon: ColorLensOutlined, text: "Painting Your Style Canvas", color: "#C4A68A" },
    { Icon: FavoriteOutlined, text: "Tailoring Your Fashion Experience", color: "#5B3A2A" }
  ];

  useEffect(() => {
    const totalDuration = 24000; // 30 seconds
    const intervalTime = totalDuration / icons.length;

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / icons.length), 100));
    }, intervalTime);

    const timer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    const iconTimer = setInterval(() => {
      setActiveIndex(prev => 
        prev < icons.length - 1 ? prev + 1 : prev
      );
    }, intervalTime);

    return () => {
      clearTimeout(timer);
      clearInterval(iconTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete, icons.length]);

  const { Icon, text, color } = icons[activeIndex];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#F4E1D2] to-[#E3C7A6] 
      flex flex-col justify-center items-center p-6 overflow-hidden">
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-[#5B3A2A] transition-all duration-500" 
          style={{width: `${progress}%`}}
        ></div>
      </div>

      {/* Animated Icon Container */}
      <div className="relative w-48 h-48 flex justify-center items-center">
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
        <Icon 
          sx={{ 
            fontSize: 96, 
            color: color,
            position: 'relative',
            zIndex: 10
          }} 
        />
      </div>

      {/* Text Animation */}
      <p 
        key={activeIndex} 
        className="mt-6 text-2xl text-center font-headings text-[#4A2C2A] 
        animate-fade-in-down tracking-wide"
      >
        {text}
      </p>

      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(45deg, #5B3A2A 25%, transparent 25%), linear-gradient(-45deg, #5B3A2A 25%, transparent 25%)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default DynamicLoader;