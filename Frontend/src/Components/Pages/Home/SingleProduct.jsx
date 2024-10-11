import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

const SingleProduct = ({ product }) => {
  return (
    <>
      <Link 
        to={`/shop/${product._id}`} 
        className='flex flex-col items-start justify-start rounded-lg border border-[#5c4033] p-4 my-5 text-[#40322e] shadow-md shadow-[#5c4033] transition duration-300 hover:shadow-lg hover:scale-105 bg-[#F4E1D2]'
      >
        {/* Image Section */}
        <div className='bg-[#f9f4f1] rounded-lg overflow-hidden'>
          <img src={product.frontPicture} className='h-80 w-full object-cover rounded-lg' alt={product.name} />
        </div>

        {/* Product Details */}
        <div className='mx-1 mt-4'>
          <p className='font-semibold text-2xl text-[#5c4033]'>{product.name}</p>
          <p className='text-xl text-[#5c4033] font-semibold mt-1'>₹ {product.cost.value}</p>

          {/* Star Ratings */}
          <div className='flex text-[#fbb523] mt-2'>
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} style={{ fontSize: "large" }} />
            ))}
          </div>
        </div>
      </Link>
    </>
  );
}

export default SingleProduct;
