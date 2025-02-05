// / SignInPage.jsx
// import React, { useState } from 'react';
// import Login from './Login';
// import Register from './Register';
// import { motion, AnimatePresence } from 'framer-motion';

// const SignInPage = () => {
//   const [login, setLogin] = useState(false);

//   return (
//     <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#F4E1D2] to-[#F9EFE6] overflow-y-auto py-10'>
//       {/* Login/Register Toggle */}
//       <div className='w-full md:w-3/5 lg:w-2/5 flex flex-wrap items-center justify-center gap-8 mb-12'>
//         <button
//           className={`text-xl md:text-3xl font-headings transition-all duration-300 ease-in-out relative ${
//             login ? 'text-[#4A2C2A] font-bold' : 'text-gray-400'
//           } hover:scale-105`}
//           onClick={() => setLogin(true)}>
//           Login
//           {login && (
//             <motion.div
//               className="absolute -bottom-2 left-0 w-full h-1 bg-[#8A5D3B] rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: '100%' }}
//               transition={{ duration: 0.3 }}
//             />
//           )}
//         </button>
//         <div className='h-14 w-14 rounded-full border-4 border-[#8A5D3B] text-[#4A2C2A] text-lg font-bold font-texts flex justify-center items-center bg-white shadow-md'>
//           OR
//         </div>
//         <button
//           className={`text-xl md:text-3xl font-headings transition-all duration-300 ease-in-out relative ${
//             !login ? 'text-[#4A2C2A] font-bold' : 'text-gray-400'
//           } hover:scale-105`}
//           onClick={() => setLogin(false)}>
//           Register
//           {!login && (
//             <motion.div
//               className="absolute -bottom-2 left-0 w-full h-1 bg-[#8A5D3B] rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: '100%' }}
//               transition={{ duration: 0.3 }}
//             />
//           )}
//         </button>
//       </div>

//       {/* Form Container */}
//       <div className='w-full max-w-screen-md px-4'>
//         <div className='bg-white/80 backdrop-blur-sm border-[#8A5D3B] border rounded-2xl shadow-2xl overflow-hidden'>
//           <AnimatePresence mode='wait'>
//             {login ? (
//               <motion.div
//                 key="login"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}>
//                 <Login />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="register"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}>
//                 <Register />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;
