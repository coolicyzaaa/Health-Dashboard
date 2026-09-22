import React from 'react';
import { Heart, Sparkles, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full mt-12 pb-8">
      <div className="rounded-3xl bg-white/75 backdrop-blur-md border border-[#8FCBEA]/30 p-6 shadow-[0_4px_20px_rgb(143,203,234,0.1)] text-center relative overflow-hidden">
        {/* Soft Airbrush orbs inside Footer */}
        <div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full opacity-35 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #8FCBEA 0%, #F2C9D6 60%, transparent 100%)' }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-[#2E3A5A]">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#BFE6FF]/40 border border-[#8FCBEA]/30 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-[#2E3A5A]" />
            <span>โครงการพัฒนาระบบสารสนเทศและการคัดกรองความเสี่ยงสุขภาพ</span>
          </div>

          <p className="text-base sm:text-lg font-bold tracking-wide text-[#2E3A5A] mt-1">
            นางสาววสุมดี ช่างสากล วท.บ.เวชระเบียน 67208306044
          </p>

          <p className="text-xs text-[#2E3A5A]/70 flex items-center gap-1">
            <span>ภาควิชาเวชระเบียนและสารสนเทศสุขภาพ</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              ดูแลสุขภาพด้วยหัวใจ <Heart className="w-3 h-3 text-[#E63968] fill-[#E63968]" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
