import React from 'react'
import HomeSlider from './HomeSlider'
import FeaturedProds from './FeaturedProds'
import Banners from './Banners'
import ScrollToTop from '../../../ScrollToTop'


const Home = () => {
  return(
    <>
      <ScrollToTop/>
      <HomeSlider/>
      <FeaturedProds/>
      <Banners/>
    </>
      
  )
}
export default Home