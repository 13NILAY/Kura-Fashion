import React from 'react'

const NewsLetter = () => {
  return (
    <div className='px-sectionPadding max-sm:px-mobileScreenPadding py-10 bg-[#1D263B] flex items-center justify-between max-sm:flex-col w-full'>
        <div className='w-1/2 max-sm:w-full'>
            <p className='font-headings text-3xl max-mobileL:text-2xl font-semibold text-white'>Sign Up For Newsletters</p>
            <p className='font-texts text-lg font-semibold max-mobileL:text-base text-white/70'>Get E-mail updates about our latest shop and Special Offers</p>
        </div>
        <div className='w-1/2 flex max-mobileL:flex-col max-mobileL:items-center mobileL:h-12 max-sm:w-full max-sm:my-5'>
            <input type='text' className='font-texts text-typography px-4 py-2 text-base w-full rounded-l-md max-mobileL:rounded-md outline-none border-none max-mobileL:mb-3 max-mobileL:h-12' placeholder='Enter e-mail address'/>
            <button className='font-texts text-white bg-primary w-1/4 rounded-r-md max-mobileL:rounded-md max-mobileL:w-1/2 max-mobileL:h-12' >Sign up</button>
        </div>
    </div>
  )
}

export default NewsLetter