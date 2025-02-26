import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicLoader = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Revert back to emoji icons with some additions
  const fashionIcons = [
    "👗", "👜", "👠", "💄", "👚", "🎀", "💃", "👒", "💅", "👛", "🌹", "✨"
  ];

  const fashionQuotes = [
    "Style is a way to say who you are without having to speak",
    "Fashion is the armor to survive everyday life",
    "Create your own style... let it be unique",
    "Elegance is elimination",
    "Fashion fades, style is eternal",
    "Dress like every day is a runway",
    "Fashion is the poetry of clothing",
    "Simplicity is the ultimate sophistication"
  ];

  const loadingPhrases = [
    "Curating exclusive collections...",
    "Handpicking trendy styles...",
    "Preparing your fashion journey...",
    "Arranging the virtual boutique...",
    "Perfecting every detail...",
    "Styling the perfect looks...",
    "Adding designer touches...",
    "Almost ready to dazzle..."
  ];

  // Color palette for gradient animations
  const colors = {
    primary: '#5c4033',
    secondary: '#8B4513',
    accent: '#A67B5B',
    light: '#F4E1D2',
    lighter: '#fff7ec'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 7) { // 8 total steps
        setStep(prev => prev + 1);
      } else {
        setLoading(false);
        setTimeout(() => onComplete(), 1000);
      }
    }, 3000); // 3 seconds per step = 24 seconds total

    return () => clearTimeout(timer);
  }, [step, onComplete]);

  // Enhanced animations
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const logoVariants = {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#F4E1D2] via-[#fff7ec] to-[#F4E1D2]"
        animate={{
          background: [
            `linear-gradient(to right, ${colors.light}, ${colors.lighter})`,
            `linear-gradient(to left, ${colors.light}, ${colors.lighter})`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Update Decorative Pattern with Emojis */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl md:text-3xl transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {fashionIcons[i % fashionIcons.length]}
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 h-full flex flex-col items-center justify-center p-4"
      >
        {/* Brand Logo with Enhanced Animation */}
        <motion.div 
          variants={logoVariants}
          className="mb-8 md:mb-12 relative"
        >
          <motion.h1 className="text-4xl md:text-7xl font-headings text-[#5c4033] mb-2 text-center">
           Welcome To Kura Fashion
          </motion.h1>
          {/* Animated underline */}
          <motion.div 
            className="h-1 w-24 md:w-32 mx-auto rounded-full"
            animate={{
              background: [
                `linear-gradient(to right, transparent, ${colors.primary}, transparent)`,
                `linear-gradient(to right, transparent, ${colors.secondary}, transparent)`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>

        {/* Update Fashion Icons Circle with Emojis */}
        <motion.div 
          className="relative w-28 h-28 md:w-40 md:h-40 mx-auto mb-8 md:mb-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {fashionIcons.slice(0, 8).map((icon, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl md:text-3xl transform-gpu"
              style={{
                transform: `rotate(${index * 45}deg) translateY(-40px) md:translateY(-60px)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                filter: [
                  'brightness(1)',
                  'brightness(1.2)',
                  'brightness(1)'
                ]
              }}
              transition={{
                duration: 3,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>

        {/* Fashion Quote with Enhanced Animation */}
        <AnimatePresence mode='wait'>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.02, 1]
            }}
            exit={{ opacity: 0, y: -20 }}
            className="text-lg md:text-2xl font-texts text-[#8B4513] italic mb-8 md:mb-12 min-h-[3rem] md:min-h-[4rem] text-center max-w-xs md:max-w-2xl px-4"
          >
            {fashionQuotes[step]}
          </motion.p>
        </AnimatePresence>

        {/* Enhanced Progress Bar */}
        <div className="relative w-64 md:w-80 h-2 bg-[#F4E1D2] rounded-full overflow-hidden mb-4 md:mb-6">
          <motion.div
            className="absolute left-0 top-0 h-full"
            animate={{
              width: `${(step + 1) * 12.5}%`,
              background: [
                `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                `linear-gradient(to right, ${colors.secondary}, ${colors.primary})`
              ]
            }}
            transition={{
              width: { duration: 0.5 },
              background: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          />
        </div>

        {/* Loading Text with Enhanced Animation */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={loadingPhrases[step]}
            className="relative overflow-hidden px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/20"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs md:text-sm font-texts text-[#5c4033] relative z-10"
            >
              {loadingPhrases[step]}
            </motion.p>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DynamicLoader;