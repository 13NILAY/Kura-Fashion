import React from 'react'
import FooterLinks from './FooterLinks'
import NewsLetter from './NewsLetter'

const Footer = () => {
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Decorative background elements - adjusted for dark theme */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4A373]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#EADBC8]/10 rounded-full blur-3xl animate-pulse" 
        style={{animationDelay: '3s'}}></div>
      
      
      <FooterLinks/>
      
      {/* Premium bottom accent */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent"></div>
    </footer>
  )
}

export default Footer