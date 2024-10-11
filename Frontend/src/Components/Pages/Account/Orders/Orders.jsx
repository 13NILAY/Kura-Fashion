import React, { useState } from 'react'
import OrderedProds from './OrderedProds'
import { Link } from 'react-router-dom'
import UserOrders from './UserOrders'

const Orders = () => {
    const [hasOrdered, setHasOrdered]= useState(true)
  return (
    <div className='mt-20 px-sectionPadding pt-10 '>
        {
            hasOrdered &&
            (
                <div className='flex flex-col justify-center items-center'>
                    {/* <p className='text-4xl font-semibold font-headings text-typography mb-6'>MY ORDERS</p> */}
                    <UserOrders/>
                </div>
            )
        }
        {
            !hasOrdered &&
            (
                <div className='text-4xl font-semibold font-texts text-typography flex flex-col justify-center items-center w-full h-full my-10'>
                    <p>No orders have been made yet.</p>
                    <p className='text-xl font-texts'>Any orders that you place will be visible here</p>
                    <Link to="/shop" className='flex justify-center items-center'>
                        <button className='bg-primary h-12 text-background text-2xl px-8 py-2 rounded-sm border border-typography my-6'> Continue Shopping</button>
                    </Link>
                </div>
            )

        }
        
    </div>
  )
}

export default Orders