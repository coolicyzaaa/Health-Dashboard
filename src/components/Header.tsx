import React from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Activity, Users } from 'lucide-react';
import { formatThaiDateTime } from '../services/sheetService';

interface HeaderProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  isRealtime: boolean;
  onRefresh: () => void;
  totalRecords: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  isRealtime,
  onRefresh,
  totalRecords,
  filteredCount
}) => {
  return (
    <header className="relative z-10 w-full mb-8">
      {/* Header Container with Soft Airbrush aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-md border border-[#8FCBEA]/30 shadow-[0_8px_30px_rgb(143,203,234,0.12)] p-6 sm:p-8 transition-all">
        {/* Soft Airbrush Decorative Blurs inside Header */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F2C9D6 0%, #8FCBEA 70%, transparent 100%)' }}
        />
        <div 
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-35 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #BFE6FF 0%, #8FCBEA 60%, transparent 100%)' }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main Title & Logo Badge */}
          <div className="flex items-start sm:items-center gap-4">
            {/* Airbrush Styled Icon Badge */}
            <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8FCBEA] via-[#BFE6FF] to-[#F2C9D6] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#2E3A5A]">
                <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-[#2E3A5A]" />
              </div>
              {/* Pulsing micro indicator */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BBF9E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2AA876] border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#BFE6FF]/50 text-[#2E3A5A] border border-[#8FCBEA]/40 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E3A5A]" />
                  ระบบบริการสุขภาพและการคัดกรองปฐมภูมิ
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F2C9D6]/40 text-[#8C3A50] border border-[#F2C9D6]">
                  Real-time Data Sync
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2E3A5A]">
                การคัดกรองความเสี่ยงด้านสุขภาพ
              </h1>
              
              <p className="text-sm sm:text-base text-[#2E3A5A]/80 mt-1">
                แดชบอร์ดติดตามและวิเคราะห์ความเสี่ยงด้านสุขภาพ พฤติกรรม และโรคไม่ติดต่อเรื้อรัง (NCDs)
              </p>
            </div>
          </div>

          {/* Right Action & Sync Status Panel */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:self-center">
            {/* Quick Record Counter Card */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#F7F4ED] border border-[#8FCBEA]/30 text-xs sm:text-sm">
              <Users className="w-4 h-4 text-[#2E3A5A]" />
              <div>
                <span className="text-[#2E3A5A]/70">ข้อมูลผู้คัดกรอง: </span>
                <span className="font-semibold text-[#2E3A5A]">{filteredCount}</span>
                {filteredCount !== totalRecords && (
                  <span className="text-xs text-[#2E3A5A]/60"> / {totalRecords} คน</span>
                )}
              </div>
            </div>

            {/* Real-time sync button & timestamp */}
            <div className="flex flex-col sm:items-end">
              <button
                id="refresh-sheet-data-btn"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8FCBEA] to-[#BFE6FF] hover:from-[#7BBFE0] hover:to-[#AFDFFF] text-[#2E3A5A] font-medium text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                title="คลิกเพื่ออัปเดตข้อมูลแบบ Real-time"
              >
                <RefreshCw className={`w-4 h-4 text-[#2E3A5A] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'กำลังดึงข้อมูล...' : 'อัปเดตข้อมูลสด (Sync)'}</span>
              </button>

              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#2E3A5A]/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2AA876]" />
                <span>อัปเดตล่าสุด: </span>
                <span className="font-medium text-[#2E3A5A]">{formatThaiDateTime(lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
