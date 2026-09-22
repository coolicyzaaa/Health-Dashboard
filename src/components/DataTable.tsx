import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, ArrowUpDown, ChevronLeft, ChevronRight, 
  Search, ShieldAlert, SlidersHorizontal, Sparkles 
} from 'lucide-react';
import { HealthRecord, RiskLevelType } from '../types';

interface DataTableProps {
  records: HealthRecord[];
}

type RelationshipTopic = 'all' | 'lifestyle' | 'screening' | 'vitals' | 'demographics';

export const DataTable: React.FC<DataTableProps> = ({ records }) => {
  const [topic, setTopic] = useState<RelationshipTopic>('all');
  const [tableRiskFilter, setTableRiskFilter] = useState<RiskLevelType>('ทั้งหมด');
  const [sortField, setSortField] = useState<keyof HealthRecord>('riskScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filter and sort records
  const filteredAndSorted = useMemo(() => {
    return records
      .filter(r => {
        // Local table risk filter
        if (tableRiskFilter !== 'ทั้งหมด' && r.riskLevel !== tableRiskFilter) {
          return false;
        }
        // Local table search
        if (tableSearch.trim()) {
          const q = tableSearch.toLowerCase().trim();
          const matchSeq = r.seq.toString().includes(q);
          const matchId = r.id.toLowerCase().includes(q);
          const matchArea = r.area.toLowerCase().includes(q);
          const matchGender = r.gender.toLowerCase().includes(q);
          const matchAge = r.age.toString().includes(q);
          return matchSeq || matchId || matchArea || matchGender || matchAge;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        const strA = String(valA);
        const strB = String(valB);
        return sortAsc ? strA.localeCompare(strB, 'th') : strB.localeCompare(strA, 'th');
      });
  }, [records, tableRiskFilter, tableSearch, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  const handleSort = (field: keyof HealthRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setCurrentPage(1);
  };

  const getRiskBadge = (level: string, score: number) => {
    if (level === 'สูง') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFE8EE] text-[#E63968] border border-[#E63968] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E63968]" />
          สูง ({score} คะแนน)
        </span>
      );
    }
    if (level === 'ปานกลาง') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF3E8] text-[#E78234] border border-[#F4A261] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E78234]" />
          ปานกลาง ({score} คะแนน)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F8F2] text-[#2AA876] border border-[#5BBF9E] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#2AA876]" />
        ต่ำ ({score} คะแนน)
      </span>
    );
  };

  return (
    <section className="relative z-10 w-full mb-12">
      <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-[#8FCBEA]/30 shadow-[0_6px_30px_rgb(143,203,234,0.12)] overflow-hidden">
        {/* Table Header & Relationship Inquiries Filter */}
        <div className="p-5 sm:p-6 border-b border-[#8FCBEA]/20 bg-gradient-to-r from-white/90 via-[#F7F4ED]/80 to-white/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#8FCBEA]/25 border border-[#8FCBEA]/40 flex items-center justify-center text-[#2E3A5A]">
                  <TableIcon className="w-5 h-5 text-[#2E3A5A]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#2E3A5A] flex items-center gap-2">
                    ตารางข้อมูลระดับความเสี่ยงและความสัมพันธ์
                  </h2>
                  <p className="text-xs text-[#2E3A5A]/70">
                    ข้อมูลระดับความเสี่ยง <strong className="text-[#2E3A5A]">Fix ตรึงอยู่กับที่</strong> พร้อมสีแสดงระดับที่เด่นชัด เลือกหัวข้อความสัมพันธ์ที่ต้องการถามได้
                  </p>
                </div>
              </div>
            </div>

            {/* Quick search input */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#2E3A5A]/50 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ค้นหาในตาราง..."
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-white border border-[#8FCBEA]/40 text-[#2E3A5A] placeholder-[#2E3A5A]/40 focus:outline-none focus:ring-2 focus:ring-[#8FCBEA]"
                />
              </div>
            </div>
          </div>

          {/* Relationship Topic Selector Bar */}
          <div className="mt-4 pt-3 border-t border-[#8FCBEA]/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-[#2E3A5A] flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8FCBEA]" />
                หัวข้อความสัมพันธ์:
              </span>
              <button
                onClick={() => setTopic('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  topic === 'all'
                    ? 'bg-[#2E3A5A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#2E3A5A] hover:bg-[#BFE6FF]/40 border border-[#8FCBEA]/20'
                }`}
              >
                แสดงทุกคอลัมน์
              </button>
              <button
                onClick={() => setTopic('lifestyle')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  topic === 'lifestyle'
                    ? 'bg-[#2E3A5A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#2E3A5A] hover:bg-[#BFE6FF]/40 border border-[#8FCBEA]/20'
                }`}
              >
                พฤติกรรมเสี่ยง (บุหรี่ / สุรา / ออกกำลังกาย)
              </button>
              <button
                onClick={() => setTopic('screening')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  topic === 'screening'
                    ? 'bg-[#2E3A5A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#2E3A5A] hover:bg-[#BFE6FF]/40 border border-[#8FCBEA]/20'
                }`}
              >
                ผลคัดกรองโรค (เบาหวาน / ความดัน / น้ำตาล / SBP)
              </button>
              <button
                onClick={() => setTopic('vitals')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  topic === 'vitals'
                    ? 'bg-[#2E3A5A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#2E3A5A] hover:bg-[#BFE6FF]/40 border border-[#8FCBEA]/20'
                }`}
              >
                สรีรวิทยา & สัญญาณชีพ (BMI / น้ำหนัก / ส่วนสูง / ชีพจร)
              </button>
              <button
                onClick={() => setTopic('demographics')}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  topic === 'demographics'
                    ? 'bg-[#2E3A5A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#2E3A5A] hover:bg-[#BFE6FF]/40 border border-[#8FCBEA]/20'
                }`}
              >
                ประชากรศาสตร์ (พื้นที่ / เพศ / อายุ)
              </button>
            </div>

            {/* Quick Risk level filter pills */}
            <div className="flex items-center gap-1.5 self-start md:self-auto">
              <span className="text-xs text-[#2E3A5A]/70 font-medium">ระดับความเสี่ยง:</span>
              {(['ทั้งหมด', 'ต่ำ', 'ปานกลาง', 'สูง'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setTableRiskFilter(lvl);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tableRiskFilter === lvl
                      ? lvl === 'สูง'
                        ? 'bg-[#FFE8EE] text-[#E63968] border border-[#E63968]'
                        : lvl === 'ปานกลาง'
                        ? 'bg-[#FFF3E8] text-[#E78234] border border-[#F4A261]'
                        : lvl === 'ต่ำ'
                        ? 'bg-[#E8F8F2] text-[#2AA876] border border-[#5BBF9E]'
                        : 'bg-[#8FCBEA] text-[#2E3A5A] border border-[#8FCBEA]'
                      : 'bg-white text-[#2E3A5A]/70 hover:bg-[#F7F4ED] border border-gray-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Responsive Table with FIXED / STICKY Risk Level column */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F7F4ED] border-b border-[#8FCBEA]/20 text-[#2E3A5A] select-none">
                {/* 1. FIXED COLUMN: ลำดับ */}
                <th 
                  onClick={() => handleSort('seq')}
                  className="sticky left-0 z-20 bg-[#F7F4ED] py-3.5 px-3 sm:px-4 font-bold cursor-pointer hover:bg-[#BFE6FF]/30 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-[#8FCBEA]/20 whitespace-nowrap text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ลำดับ</span>
                    <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/50" />
                  </div>
                </th>

                {/* 2. FIXED / PINNED COLUMN: ระดับความเสี่ยง (เด่นชัด ตามข้อกำหนด 4) */}
                <th 
                  onClick={() => handleSort('riskScore')}
                  className="sticky left-[65px] sm:left-[75px] z-20 bg-[#F7F4ED] py-3.5 px-4 font-bold cursor-pointer hover:bg-[#BFE6FF]/30 transition-colors shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)] border-r-2 border-[#8FCBEA]/40 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5 text-[#2E3A5A]">
                    <ShieldAlert className="w-4 h-4 text-[#E63968]" />
                    <span>ระดับความเสี่ยง (Fixed)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/50" />
                  </div>
                </th>

                {/* Dynamic Columns based on Topic */}
                {(topic === 'all' || topic === 'demographics') && (
                  <>
                    <th onClick={() => handleSort('area')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>พื้นที่</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('gender')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>เพศ</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('age')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>อายุ (ปี)</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                  </>
                )}

                {(topic === 'all' || topic === 'lifestyle') && (
                  <>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">สูบบุหรี่</th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ดื่มแอลกอฮอล์</th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">การออกกำลังกาย</th>
                  </>
                )}

                {(topic === 'all' || topic === 'screening') && (
                  <>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">เบาหวาน_คัดกรอง</th>
                    <th onClick={() => handleSort('bloodSugar')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>น้ำตาล (mg/dL)</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ความดันโลหิตสูง_คัดกรอง</th>
                    <th onClick={() => handleSort('sbp')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>SBP (mmHg)</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                  </>
                )}

                {(topic === 'all' || topic === 'vitals') && (
                  <>
                    <th onClick={() => handleSort('bmi')} className="py-3.5 px-4 font-semibold cursor-pointer hover:bg-[#BFE6FF]/20 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>BMI</span>
                        <ArrowUpDown className="w-3 h-3 text-[#2E3A5A]/40" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ส่วนสูง (cm)</th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">น้ำหนัก (kg)</th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">DBP (mmHg)</th>
                    <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ชีพจร (bpm)</th>
                  </>
                )}

                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">วันที่คัดกรอง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8FCBEA]/15">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-12 text-center text-[#2E3A5A]/60">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((row, idx) => (
                  <tr 
                    key={row.id}
                    className={`hover:bg-[#BFE6FF]/15 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F7F4ED]/40'}`}
                  >
                    {/* 1. FIXED COLUMN: ลำดับ */}
                    <td className="sticky left-0 z-10 bg-inherit py-3 px-3 sm:px-4 font-bold text-[#2E3A5A] text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-[#8FCBEA]/20 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-lg bg-[#8FCBEA]/20 text-[#2E3A5A] text-xs font-bold">
                        {row.seq}
                      </span>
                    </td>

                    {/* 2. FIXED COLUMN: ระดับความเสี่ยง (เด่นชัด) */}
                    <td className="sticky left-[65px] sm:left-[75px] z-10 bg-inherit py-3 px-4 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.08)] border-r-2 border-[#8FCBEA]/40 whitespace-nowrap">
                      {getRiskBadge(row.riskLevel, row.riskScore)}
                    </td>

                    {/* Dynamic Columns based on Topic */}
                    {(topic === 'all' || topic === 'demographics') && (
                      <>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap font-medium">{row.area}</td>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-xs ${row.gender === 'ชาย' ? 'bg-[#8FCBEA]/30 text-[#1E4D68]' : 'bg-[#F2C9D6]/40 text-[#8C3A50]'}`}>
                            {row.gender}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap font-medium">{row.age}</td>
                      </>
                    )}

                    {(topic === 'all' || topic === 'lifestyle') && (
                      <>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.smoking === 'สูบ' ? 'bg-[#FEF3E9] text-[#B25E1E] border border-[#F4A261]/50' : 'bg-gray-100 text-gray-700'}`}>
                            {row.smoking}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.alcohol === 'ดื่ม' ? 'bg-[#FDE8ED] text-[#8C3A50] border border-[#F2C9D6]' : 'bg-gray-100 text-gray-700'}`}>
                            {row.alcohol}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            row.exercise === 'สม่ำเสมอ' 
                              ? 'bg-[#E8F8F2] text-[#1E7754] border border-[#5BBF9E]/50' 
                              : row.exercise === 'บางครั้ง' 
                              ? 'bg-[#BFE6FF]/40 text-[#2E3A5A]' 
                              : 'bg-[#FFE8EE] text-[#A61E42] border border-[#E63968]/30'
                          }`}>
                            {row.exercise}
                          </span>
                        </td>
                      </>
                    )}

                    {(topic === 'all' || topic === 'screening') && (
                      <>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' ? 'bg-[#FFE8EE] text-[#A61E42] border border-[#E63968]/30' : 'bg-[#E8F8F2] text-[#1E7754]'}`}>
                            {row.diabetesScreening}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap font-medium">
                          <span className={row.bloodSugar >= 126 ? 'text-[#E63968] font-bold' : ''}>
                            {row.bloodSugar}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' ? 'bg-[#FFE8EE] text-[#A61E42] border border-[#E63968]/30' : 'bg-[#E8F8F2] text-[#1E7754]'}`}>
                            {row.hypertensionScreening}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap font-medium">
                          <span className={row.sbp >= 140 ? 'text-[#E63968] font-bold' : ''}>
                            {row.sbp}
                          </span>
                        </td>
                      </>
                    )}

                    {(topic === 'all' || topic === 'vitals') && (
                      <>
                        <td className="py-3 px-4 text-[#2E3A5A] whitespace-nowrap font-medium">{row.bmi}</td>
                        <td className="py-3 px-4 text-[#2E3A5A]/80 whitespace-nowrap">{row.height}</td>
                        <td className="py-3 px-4 text-[#2E3A5A]/80 whitespace-nowrap">{row.weight}</td>
                        <td className="py-3 px-4 text-[#2E3A5A]/80 whitespace-nowrap">{row.dbp}</td>
                        <td className="py-3 px-4 text-[#2E3A5A]/80 whitespace-nowrap">{row.pulse}</td>
                      </>
                    )}

                    <td className="py-3 px-4 text-[#2E3A5A]/70 whitespace-nowrap text-xs">
                      {row.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Status Footer */}
        <div className="p-4 border-t border-[#8FCBEA]/20 bg-[#F7F4ED]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#2E3A5A]">
          <div>
            แสดงผล <strong>{paginatedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> - <strong>{Math.min(currentPage * pageSize, filteredAndSorted.length)}</strong> จากทั้งหมด <strong>{filteredAndSorted.length}</strong> รายการ
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-[#8FCBEA]/30 text-[#2E3A5A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#8FCBEA]/20 transition-colors cursor-pointer"
              title="หน้าก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-[#8FCBEA]/30 text-[#2E3A5A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#8FCBEA]/20 transition-colors cursor-pointer"
              title="หน้าถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
