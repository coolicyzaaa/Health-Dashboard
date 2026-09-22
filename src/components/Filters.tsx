import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp, Search, UserCheck, AlertCircle, HeartPulse } from 'lucide-react';
import { FilterState, RiskLevelType, DiseaseScreeningFilter, AgeRangeFilter } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  areas: string[];
  totalCount: number;
  filteredCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  areas,
  totalCount,
  filteredCount
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasActiveFilters = 
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.diseaseScreening !== 'ทั้งหมด' ||
    filters.ageRange !== 'ทั้งหมด' ||
    filters.area !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.searchQuery !== '';

  return (
    <section className="relative z-10 w-full mb-8">
      <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-[#8FCBEA]/30 p-5 sm:p-6 shadow-[0_6px_25px_rgb(143,203,234,0.08)]">
        {/* Filter Bar Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#8FCBEA]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8FCBEA]/25 text-[#2E3A5A] flex items-center justify-center border border-[#8FCBEA]/40">
              <Filter className="w-5 h-5 text-[#2E3A5A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#2E3A5A]">
                  ตัวกรองข้อมูลการคัดกรอง
                </h2>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2C9D6] text-[#8C3A50]">
                    กำลังกรอง {filteredCount} / {totalCount} รายการ
                  </span>
                )}
              </div>
              <p className="text-xs text-[#2E3A5A]/70 hidden sm:block">
                เลือกประเภทความเสี่ยง โรคประจำตัว/การคัดกรอง และช่วงอายุของผู้ป่วย
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#2E3A5A] hover:bg-[#F2C9D6]/40 transition-colors border border-transparent hover:border-[#F2C9D6] cursor-pointer"
                title="ล้างตัวกรองทั้งหมด"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างค่า</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#BFE6FF]/40 text-[#2E3A5A] hover:bg-[#8FCBEA]/30 transition-colors border border-[#8FCBEA]/30 cursor-pointer sm:hidden"
            >
              <span>{isExpanded ? 'ย่อตัวกรอง' : 'ขยายตัวกรอง'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Filter Controls Grid */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-5">
            {/* 1. ประเภทความเสี่ยง (ระดับความเสี่ยง) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <AlertCircle className="w-3.5 h-3.5 text-[#E78234]" />
                <span>ประเภทความเสี่ยง</span>
              </label>
              <select
                id="filter-risk-level"
                value={filters.riskLevel}
                onChange={(e) => onFilterChange({ riskLevel: e.target.value as RiskLevelType })}
                aria-label="ประเภทความเสี่ยง"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all cursor-pointer font-medium"
              >
                <option value="ทั้งหมด">ทั้งหมด (ทุกระดับความเสี่ยง)</option>
                <option value="ต่ำ">🟢 ความเสี่ยงต่ำ (คะแนน 0-1)</option>
                <option value="ปานกลาง">🟡 ความเสี่ยงปานกลาง (คะแนน 2-3)</option>
                <option value="สูง">🔴 ความเสี่ยงสูง (คะแนน ≥ 4)</option>
              </select>
            </div>

            {/* 2. โรคประจำตัว / การคัดกรอง */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <HeartPulse className="w-3.5 h-3.5 text-[#E63968]" />
                <span>โรคประจำตัว / การคัดกรอง</span>
              </label>
              <select
                id="filter-disease-screening"
                value={filters.diseaseScreening}
                onChange={(e) => onFilterChange({ diseaseScreening: e.target.value as DiseaseScreeningFilter })}
                aria-label="โรคประจำตัว / การคัดกรอง"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all cursor-pointer font-medium"
              >
                <option value="ทั้งหมด">ทั้งหมด (โรคไม่ติดต่อ)</option>
                <option value="เสี่ยงเบาหวาน">เสี่ยงเบาหวาน</option>
                <option value="เสี่ยงความดัน">เสี่ยงความดันโลหิตสูง</option>
                <option value="เสี่ยงทั้งคู่">เสี่ยงทั้งเบาหวานและความดัน</option>
                <option value="ไม่มีความเสี่ยงทั้งคู่">ไม่พบความเสี่ยงทั้งคู่</option>
              </select>
            </div>

            {/* 3. ช่วงอายุของผู้ป่วย */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <UserCheck className="w-3.5 h-3.5 text-[#5BBF9E]" />
                <span>ช่วงอายุของผู้ป่วย</span>
              </label>
              <select
                id="filter-age-range"
                value={filters.ageRange}
                onChange={(e) => onFilterChange({ ageRange: e.target.value as AgeRangeFilter })}
                aria-label="ช่วงอายุของผู้ป่วย"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all cursor-pointer font-medium"
              >
                <option value="ทั้งหมด">ทุกช่วงอายุ</option>
                <option value="< 30 ปี">ต่ำกว่า 30 ปี (วัยหนุ่มสาว)</option>
                <option value="30 - 45 ปี">30 - 45 ปี (วัยทำงานต้น)</option>
                <option value="46 - 60 ปี">46 - 60 ปี (วัยกลางคน)</option>
                <option value="> 60 ปี">มากกว่า 60 ปี (ผู้สูงอายุ)</option>
              </select>
            </div>

            {/* 4. พื้นที่ */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <span>พื้นที่สำรวจ</span>
              </label>
              <select
                id="filter-area"
                value={filters.area}
                onChange={(e) => onFilterChange({ area: e.target.value })}
                aria-label="พื้นที่สำรวจ"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all cursor-pointer font-medium"
              >
                <option value="ทั้งหมด">ทุกพื้นที่</option>
                {areas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* 5. เพศ */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <span>เพศ</span>
              </label>
              <select
                id="filter-gender"
                value={filters.gender}
                onChange={(e) => onFilterChange({ gender: e.target.value })}
                aria-label="เพศ"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all cursor-pointer font-medium"
              >
                <option value="ทั้งหมด">ทุกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            {/* 6. ค้นหารหัสบุคคล */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-[#2E3A5A]">
                <Search className="w-3.5 h-3.5 text-[#2E3A5A]/70" />
                <span>ค้นหารหัสบุคคล</span>
              </label>
              <div className="relative">
                <input
                  id="search-patient-id"
                  type="text"
                  placeholder="เช่น H0001, H0012"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-[#F7F4ED] border border-[#8FCBEA]/40 text-[#2E3A5A] placeholder-[#2E3A5A]/40 focus:outline-none focus:ring-2 focus:ring-[#8FCBEA] transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
