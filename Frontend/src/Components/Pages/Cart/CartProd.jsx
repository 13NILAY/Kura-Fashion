import React, { useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const CartProd = ({ product, quantity, selectedSize, selectedColor, _id, onDelete }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || 1);

  const handleDelete = () => {
    onDelete({ _id, size: selectedSize });
  };

  return (
    <div className="flex items-center relative border border-typography rounded-sm p-4 my-3 shadow-md bg-white hover:shadow-lg transition max-[940px]:flex-col max-[940px]:items-start">
      <img
        src={product.frontPicture}
        className="w-2/5 max-[940px]:w-full rounded-lg object-cover"
        alt={product.name}
      />
      <div className="flex flex-col justify-center items-start ml-6 max-md:ml-0 max-md:my-4">
        <p className="font-semibold text-2xl max-sm:text-lg font-texts">{product.name}</p>
        <p className="text-xl max-sm:text-base text-typography font-headings font-semibold">₹ {product.cost.value}</p>
        <p className="text-lg max-sm:text-base text-typography font-texts font-bold">Size: {selectedSize}</p>
        <p className="text-lg max-sm:text-base text-typography font-texts font-bold">Quantity: {quantity}</p>
        <p className="text-lg max-sm:text-base text-typography font-texts font-bold">
          Color: <span style={{ backgroundColor: selectedColor, display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%' }}></span>
        </p>
      </div>
      <button onClick={handleDelete} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition">
        <DeleteOutlineOutlinedIcon fontSize="large" />
      </button>
    </div>
  );
};

export default CartProd;
