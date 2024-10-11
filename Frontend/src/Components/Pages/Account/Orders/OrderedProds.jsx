import React from 'react'
import img1 from '../../../../assets/trial1.jpg'

const OrderedProds = () => {
  return (
    <>
        <div className='w-3/5 flex justify-evenly items-center relative border border-typography rounded-sm'>
            <img src={img1} className='w-1/2 h-full'/>
            <div className='flex justify-start items-start'>
                {/* PRODUCT INFORMATION */}
                <div>
                    <p className='font-semibold text-2xl font-texts'>H&M White Hoodie</p>
                    <p className='text-xl text-typography font-headings font-bold'>₹1599</p>
                    <p className='text-lg  text-typography font-texts font-semibold'>Size: M</p>
                    <p className='text-lg  text-typography font-texts font-semibold'> Quantity: 3</p>
                </div>   
            </div>
        </div>
    </>
  )
}

export default OrderedProds