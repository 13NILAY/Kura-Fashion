import React from 'react';

const TermsConditions = () => {
  return (
    <div className="mt-20 px-8 max-md:px-4 py-16 bg-[#F4D3C4] text-typography mx-auto max-w-5xl rounded-lg shadow-lg" style={{ color: '#6B4F3A' }}>
      <h1 className="text-3xl font-headings font-bold text-[#8A5D3B] mb-6">Terms and Conditions</h1>
      {/* <h1 className="font-headings text-3xl font-bold text-[#8A5D3B] mb-6">About Us</h1> */}
      <div className="text-sm font-texts space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-[#8A5D3B]">1. Introduction</h2>
          <p>Welcome to Kura Fashion. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-[#8A5D3B]">2. Intellectual Property Rights</h2>
          <p>Unless otherwise stated, Kura Fashion and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and/or print pages from [website] for your personal use, subject to restrictions set in these terms and conditions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#8A5D3B]">3. Restrictions</h2>
          <p>You are specifically restricted from all of the following:</p>
          <ul className="list-disc list-inside">
            <li>Publishing any website material in any other media without prior permission.</li>
            <li>Selling, sublicensing, and/or otherwise commercializing any website material.</li>
            <li>Publicly performing and/or showing any website material.</li>
            <li>Using this website in any way that is, or may be, damaging to this website.</li>
            <li>Using this website in any way that impacts user access to this website.</li>
            <li>Engaging in any data mining, data harvesting, data extracting, or any other similar activity in relation to this website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#8A5D3B]">4. Limitation of Liability</h2>
          <p>In no event shall Kura Fashion, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract, tort, or otherwise.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#8A5D3B]">5. Governing Law & Jurisdiction</h2>
          <p>These terms will be governed by and interpreted in accordance with the laws of Maharashtra/India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Maharashtra/India for the resolution of any disputes.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
