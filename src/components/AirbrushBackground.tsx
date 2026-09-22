import React from 'react';

export const AirbrushBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary soft airbrush aura - Top Left (#8FCBEA & #BFE6FF) */}
      <div 
        className="absolute -top-[12rem] -left-[10rem] w-[36rem] h-[36rem] rounded-full opacity-60 blur-[100px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #8FCBEA 0%, #BFE6FF 50%, rgba(247, 244, 237, 0) 80%)'
        }}
      />

      {/* Secondary airbrush rose aura - Top Right (#F2C9D6) */}
      <div 
        className="absolute -top-[8rem] -right-[8rem] w-[32rem] h-[32rem] rounded-full opacity-55 blur-[95px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #F2C9D6 0%, #F7D6E0 50%, rgba(247, 244, 237, 0) 80%)'
        }}
      />

      {/* Center ambient glow - Soft Sky & Warm Cream (#BFE6FF) */}
      <div 
        className="absolute top-[35%] left-[20%] w-[42rem] h-[30rem] rounded-full opacity-35 blur-[120px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse, #BFE6FF 0%, rgba(143, 203, 234, 0.4) 40%, rgba(247, 244, 237, 0) 75%)'
        }}
      />

      {/* Bottom airbrush blossom aura (#F2C9D6 & #8FCBEA) */}
      <div 
        className="absolute -bottom-[10rem] right-[5%] w-[38rem] h-[38rem] rounded-full opacity-45 blur-[110px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #F2C9D6 0%, #BFE6FF 45%, rgba(247, 244, 237, 0) 80%)'
        }}
      />

      {/* Bottom left gentle mist (#8FCBEA) */}
      <div 
        className="absolute -bottom-[8rem] -left-[6rem] w-[30rem] h-[30rem] rounded-full opacity-40 blur-[90px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #8FCBEA 0%, rgba(191, 230, 255, 0.5) 50%, rgba(247, 244, 237, 0) 80%)'
        }}
      />

      {/* Subtle organic SVG airbrush particles for texture and depth */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.22]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="airbrush-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
          </filter>
        </defs>
        <circle cx="15%" cy="20%" r="90" fill="#8FCBEA" filter="url(#airbrush-blur)" />
        <circle cx="85%" cy="15%" r="110" fill="#F2C9D6" filter="url(#airbrush-blur)" />
        <circle cx="50%" cy="50%" r="130" fill="#BFE6FF" filter="url(#airbrush-blur)" />
        <circle cx="90%" cy="80%" r="120" fill="#F2C9D6" filter="url(#airbrush-blur)" />
      </svg>
    </div>
  );
};
