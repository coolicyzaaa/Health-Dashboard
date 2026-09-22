import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AirbrushBackground } from './components/AirbrushBackground';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { ChartsSection } from './components/ChartsSection';
import { DataTable } from './components/DataTable';
import { Footer } from './components/Footer';
import { HealthRecord, FilterState } from './types';
import { fetchHealthRecords } from './services/sheetService';
import { INITIAL_RECORDS } from './data/initialData';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_RECORDS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isRealtime, setIsRealtime] = useState<boolean>(true);

  // Filter State
  const initialFilters: FilterState = {
    riskLevel: 'ทั้งหมด',
    diseaseScreening: 'ทั้งหมด',
    ageRange: 'ทั้งหมด',
    area: 'ทั้งหมด',
    gender: 'ทั้งหมด',
    searchQuery: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync data from Google Sheet
  const handleSyncData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchHealthRecords();
      setRecords(result.records);
      setLastUpdated(result.lastUpdated);
      setIsRealtime(result.isRealtime);
    } catch (err) {
      console.error('Error syncing Google Sheet data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load & periodic background sync (every 60s)
  useEffect(() => {
    handleSyncData();
    const timer = setInterval(() => {
      handleSyncData();
    }, 60000);
    return () => clearInterval(timer);
  }, [handleSyncData]);

  // Extract unique areas
  const areas = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set);
  }, [records]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // 1. ระดับความเสี่ยง
      if (filters.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filters.riskLevel) {
        return false;
      }

      // 2. โรคประจำตัว / การคัดกรอง
      if (filters.diseaseScreening === 'เสี่ยงเบาหวาน' && r.diabetesScreening !== 'มีแนวโน้ม/เสี่ยง') {
        return false;
      }
      if (filters.diseaseScreening === 'เสี่ยงความดัน' && r.hypertensionScreening !== 'มีแนวโน้ม/เสี่ยง') {
        return false;
      }
      if (filters.diseaseScreening === 'เสี่ยงทั้งคู่' && (r.diabetesScreening !== 'มีแนวโน้ม/เสี่ยง' || r.hypertensionScreening !== 'มีแนวโน้ม/เสี่ยง')) {
        return false;
      }
      if (filters.diseaseScreening === 'ไม่มีความเสี่ยงทั้งคู่' && (r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง')) {
        return false;
      }

      // 3. ช่วงอายุ
      if (filters.ageRange === '< 30 ปี' && r.age >= 30) {
        return false;
      }
      if (filters.ageRange === '30 - 45 ปี' && (r.age < 30 || r.age > 45)) {
        return false;
      }
      if (filters.ageRange === '46 - 60 ปี' && (r.age < 46 || r.age > 60)) {
        return false;
      }
      if (filters.ageRange === '> 60 ปี' && r.age <= 60) {
        return false;
      }

      // 4. พื้นที่
      if (filters.area !== 'ทั้งหมด' && r.area !== filters.area) {
        return false;
      }

      // 5. เพศ
      if (filters.gender !== 'ทั้งหมด' && r.gender !== filters.gender) {
        return false;
      }

      // 6. Search query (ลำดับ, รหัส, พื้นที่)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchSeq = r.seq.toString() === q || r.seq.toString().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        const matchArea = r.area.toLowerCase().includes(q);
        return matchSeq || matchId || matchArea;
      }

      return true;
    });
  }, [records, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen relative bg-[#F7F4ED] text-[#2E3A5A] font-['Prompt',sans-serif] selection:bg-[#8FCBEA]/30 selection:text-[#2E3A5A] overflow-x-hidden">
      {/* Soft Airbrush Graphic Background Layers */}
      <AirbrushBackground />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
        {/* 1. Header with Real-time Google Sheet Sync & Timestamp */}
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isRealtime={isRealtime}
          onRefresh={handleSyncData}
          totalRecords={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* 1. Filters (ประเภทความเสี่ยง, โรคประจำตัว, ช่วงอายุ, พื้นที่, เพศ, ค้นหา) */}
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          areas={areas}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* 2. KPI Cards / Summary Cards (6 Metrics: จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, สัดส่วน, ร้อยละ) */}
        <KPICards records={filteredRecords} />

        {/* 3. Visualizations & Charts (พื้นที่ สัมพันธ์กับ ระดับความเสี่ยง, เพศ สัมพันธ์ ระดับความเสี่ยง, etc.) */}
        <ChartsSection records={filteredRecords} />

        {/* 4. Data Table (ระดับความเสี่ยง Fix อยู่กับที่, สีเด่นชัด, Filter หัวข้อความสัมพันธ์) */}
        <DataTable records={filteredRecords} />

        {/* 1. Footer with student credits */}
        <Footer />
      </main>
    </div>
  );
}
