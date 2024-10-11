import React from 'react';

const AboutUs = () => {
  return (
    <div
      className="mt-20 px-8 max-md:px-4 py-16 bg-[#F4D3C4] text-typography mx-auto max-w-5xl rounded-lg shadow-lg"
      style={{ backgroundColor: '#F4D3C4', color: '#6B4F3A' }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-headings text-3xl font-bold text-[#8A5D3B] mb-6">About Us</h1>
        <p className="font-texts text-lg mb-4">
          Welcome to <strong>Kura Fashion</strong>, where we believe in delivering the highest quality products and services to our customers. Founded in 2024, we have grown from a small startup to a trusted name in the industry. Our journey has been fueled by a passion for innovation, a commitment to customer satisfaction, and a dedication to excellence.
        </p>
        <p className="font-texts text-lg mb-4">
          At <strong>Kura Fashion</strong>, we specialize in modern, wonderful, and comfortable clothes. Our team of experienced professionals works tirelessly to ensure that every product we offer meets the highest standards of quality. We are proud of our commitment to sustainability and our efforts to reduce our environmental footprint.
        </p>
        <p className="font-texts text-lg  mb-4">
          Our mission is to create value for our customers by offering superior products and exceptional customer service. We believe in building lasting relationships with our customers, partners, and the communities we serve.
        </p>
        <p className="font-texts text-lg mb-4">
          Thank you for choosing <strong>Kura Fashion</strong>. We look forward to serving you and exceeding your expectations.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
