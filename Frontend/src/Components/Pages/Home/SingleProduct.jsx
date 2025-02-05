import React from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

const SingleProduct = ({ product, className = '' }) => {
  return (
    <Link 
      to={`/shop/${product._id}`}
      className={`
        group flex flex-col justify-between rounded-lg
        border border-[#5B3A2A] bg-[#F4D3C4] p-4
        text-[#40322e] shadow-md transition-all duration-300
        hover:shadow-lg hover:scale-[1.02]
        ${className}
      `}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#EFE5D5]">
        <img 
          src={product.frontPicture} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-headings text-[#5B3A2A] text-xl font-semibold line-clamp-2">
          {product.name}
        </h3>

        <p className="font-texts text-[#5B3A2A] text-lg font-semibold">
          ₹{product.cost.value.toLocaleString()}
        </p>

        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i}
              style={{ fontSize: "large", color: "#fbb523" }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default SingleProduct;