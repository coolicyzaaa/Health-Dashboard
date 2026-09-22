import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { MapPin, Users, HeartPulse, PieChart as PieIcon, BarChart3, Activity } from 'lucide-react';
import { HealthRecord } from '../types';

interface ChartsSectionProps {
  records: HealthRecord[];
}

type ChartViewTab = 'all' | 'area_risk' | 'gender_risk' | 'lifestyle' | 'risk_score';

const RISK_COLORS = {
  ต่ำ: '#5BBF9E',
  ปานกลาง: '#F4A261',
  สูง: '#E65C7B',
};

const PALETTE = ['#8FCBEA', '#BFE6FF', '#F2C9D6', '#5BBF9E', '#F4A261', '#2E3A5A'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<ChartViewTab>('all');

  const total = records.length;

  // 1. Data: พื้นที่ สัมพันธ์กับ ระดับความเสี่ยง
  const areas = Array.from(new Set(records.map(r => r.area))).filter(Boolean);
  const areaRiskData = areas.map(area => {
    const areaRecords = records.filter(r => r.area === area);
    const low = areaRecords.filter(r => r.riskLevel === 'ต่ำ').length;
    const medium = areaRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = areaRecords.filter(r => r.riskLevel === 'สูง').length;
    return {
      name: area,
      ต่ำ: low,
      ปานกลาง: medium,
      สูง: high,
      รวม: areaRecords.length
    };
  });

  // 2. Data: เพศ สัมพันธ์ ระดับความเสี่ยง
  const genders = ['ชาย', 'หญิง'];
  const genderRiskData = genders.map(gender => {
    const genderRecords = records.filter(r => r.gender === gender);
    const low = genderRecords.filter(r => r.riskLevel === 'ต่ำ').length;
    const medium = genderRecords.filter(r => r.riskLevel === 'ปานกลาง').length;
    const high = genderRecords.filter(r => r.riskLevel === 'สูง').length;
    return {
      name: gender,
      ต่ำ: low,
      ปานกลาง: medium,
      สูง: high,
      รวม: genderRecords.length
    };
  });

  // 3. Data: ระดับความเสี่ยง (Pie / Donut)
  const riskLevels = ['ต่ำ', 'ปานกลาง', 'สูง'] as const;
  const riskLevelData = riskLevels.map(lvl => {
    const count = records.filter(r => r.riskLevel === lvl).length;
    return {
      name: lvl,
      value: count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0
    };
  });

  // 4. Data: คะแนนความเสี่ยง (0 - 7)
  const scoreDistributionMap: { [score: number]: number } = {};
  for (let i = 0; i <= 7; i++) scoreDistributionMap[i] = 0;
  records.forEach(r => {
    const s = Math.round(r.riskScore);
    if (scoreDistributionMap[s] !== undefined) scoreDistributionMap[s]++;
  });
  const riskScoreData = Object.entries(scoreDistributionMap).map(([score, count]) => ({
    score: `คะแนน ${score}`,
    จำนวน: count
  }));

  // 5. Data: พฤติกรรมสุขภาพ & โรคคัดกรอง (สูบบุหรี่, ดื่มแอลกอฮอล์, ออกกำลังกาย, เบาหวาน_คัดกรอง, ความดัน_คัดกรอง)
  const smokingCount = records.filter(r => r.smoking === 'สูบ').length;
  const alcoholCount = records.filter(r => r.alcohol === 'ดื่ม').length;
  const exerciseNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length;
  const diabetesRiskCount = records.filter(r => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง').length;
  const htnRiskCount = records.filter(r => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง').length;

  const lifestyleSummaryData = [
    { factor: 'สูบบุหรี่', เสี่ยง_ผิดปกติ: smokingCount, ปกติ_ไม่เสี่ยง: total - smokingCount },
    { factor: 'ดื่มแอลกอฮอล์', เสี่ยง_ผิดปกติ: alcoholCount, ปกติ_ไม่เสี่ยง: total - alcoholCount },
    { factor: 'ไม่ออกกำลังกาย', เสี่ยง_ผิดปกติ: exerciseNone, ปกติ_ไม่เสี่ยง: total - exerciseNone },
    { factor: 'เสี่ยงเบาหวาน', เสี่ยง_ผิดปกติ: diabetesRiskCount, ปกติ_ไม่เสี่ยง: total - diabetesRiskCount },
    { factor: 'เสี่ยงความดันฯ', เสี่ยง_ผิดปกติ: htnRiskCount, ปกติ_ไม่เสี่ยง: total - htnRiskCount },
  ];

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-2xl bg-white/95 backdrop-blur-md p-3.5 border border-[#8FCBEA]/40 shadow-lg text-xs">
          <p className="font-bold text-[#2E3A5A] mb-1.5 pb-1 border-b border-[#8FCBEA]/20">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color || entry.fill }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                {entry.name}:
              </span>
              <span className="font-bold text-[#2E3A5A]">
                {entry.value} คน {total > 0 && entry.value && `(${Math.round((entry.value / total) * 100)}%)`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="relative z-10 w-full mb-8">
      {/* Visualizations Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#2E3A5A] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8FCBEA]" />
            แผนภูมิการวิเคราะห์และแสดงผล (Visualizations & Charts)
          </h2>
          <p className="text-xs sm:text-sm text-[#2E3A5A]/75">
            วิเคราะห์ความสัมพันธ์ของปัจจัยเสี่ยง พฤติกรรมสุขภาพ พื้นที่ และเพศ
          </p>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-[#8FCBEA]/30">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#8FCBEA] text-[#2E3A5A] shadow-xs'
                : 'text-[#2E3A5A]/75 hover:text-[#2E3A5A] hover:bg-[#BFE6FF]/30'
            }`}
          >
            ภาพรวมทั้งหมด
          </button>
          <button
            id="tab-area-risk"
            onClick={() => setActiveTab('area_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'area_risk'
                ? 'bg-[#8FCBEA] text-[#2E3A5A] shadow-xs'
                : 'text-[#2E3A5A]/75 hover:text-[#2E3A5A] hover:bg-[#BFE6FF]/30'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            พื้นที่ สัมพันธ์กับ ระดับความเสี่ยง
          </button>
          <button
            id="tab-gender-risk"
            onClick={() => setActiveTab('gender_risk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gender_risk'
                ? 'bg-[#8FCBEA] text-[#2E3A5A] shadow-xs'
                : 'text-[#2E3A5A]/75 hover:text-[#2E3A5A] hover:bg-[#BFE6FF]/30'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            เพศ สัมพันธ์ ระดับความเสี่ยง
          </button>
          <button
            onClick={() => setActiveTab('lifestyle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'lifestyle'
                ? 'bg-[#8FCBEA] text-[#2E3A5A] shadow-xs'
                : 'text-[#2E3A5A]/75 hover:text-[#2E3A5A] hover:bg-[#BFE6FF]/30'
            }`}
          >
            พฤติกรรม & การคัดกรอง
          </button>
          <button
            onClick={() => setActiveTab('risk_score')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'risk_score'
                ? 'bg-[#8FCBEA] text-[#2E3A5A] shadow-xs'
                : 'text-[#2E3A5A]/75 hover:text-[#2E3A5A] hover:bg-[#BFE6FF]/30'
            }`}
          >
            ระดับและคะแนนเสี่ยง
          </button>
        </div>
      </div>

      {/* Grid of Visualizations based on activeTab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: พื้นที่ สัมพันธ์กับ ระดับความเสี่ยง */}
        {(activeTab === 'all' || activeTab === 'area_risk') && (
          <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md border border-[#8FCBEA]/30 p-5 sm:p-6 shadow-[0_6px_25px_rgb(143,203,234,0.08)]">
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#8FCBEA]/20 to-[#BFE6FF]/10 blur-2xl pointer-events-none" 
            />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2E3A5A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2E3A5A]" />
                  พื้นที่ สัมพันธ์กับ ระดับความเสี่ยง
                </h3>
                <p className="text-xs text-[#2E3A5A]/70">
                  การกระจายตัวของระดับความเสี่ยง (ต่ำ, ปานกลาง, สูง) ในแต่ละพื้นที่สำรวจ
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#BFE6FF]/40 text-[#2E3A5A]">
                {areas.length} พื้นที่
              </span>
            </div>

            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaRiskData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 12 }} />
                  <YAxis stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
                    formatter={(val) => <span className="text-[#2E3A5A] font-medium">{val}</span>}
                  />
                  <Bar dataKey="ต่ำ" stackId="a" fill={RISK_COLORS['ต่ำ']} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ปานกลาง" stackId="a" fill={RISK_COLORS['ปานกลาง']} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="สูง" stackId="a" fill={RISK_COLORS['สูง']} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: เพศ สัมพันธ์ ระดับความเสี่ยง */}
        {(activeTab === 'all' || activeTab === 'gender_risk') && (
          <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md border border-[#8FCBEA]/30 p-5 sm:p-6 shadow-[0_6px_25px_rgb(143,203,234,0.08)]">
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#F2C9D6]/30 to-[#BFE6FF]/15 blur-2xl pointer-events-none" 
            />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2E3A5A] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8C3A50]" />
                  เพศ สัมพันธ์ ระดับความเสี่ยง
                </h3>
                <p className="text-xs text-[#2E3A5A]/70">
                  เปรียบเทียบระดับความเสี่ยงด้านสุขภาพระหว่างเพศชายและเพศหญิง
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2C9D6]/40 text-[#8C3A50]">
                เปรียบเทียบ 2 เพศ
              </span>
            </div>

            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderRiskData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 12 }} />
                  <YAxis stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
                    formatter={(val) => <span className="text-[#2E3A5A] font-medium">{val}</span>}
                  />
                  <Bar dataKey="ต่ำ" fill={RISK_COLORS['ต่ำ']} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ปานกลาง" fill={RISK_COLORS['ปานกลาง']} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="สูง" fill={RISK_COLORS['สูง']} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: พฤติกรรมสุขภาพ & ปัจจัยคัดกรอง (สูบบุหรี่, ดื่มสุรา, ออกกำลังกาย, เบาหวาน, ความดัน) */}
        {(activeTab === 'all' || activeTab === 'lifestyle') && (
          <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md border border-[#8FCBEA]/30 p-5 sm:p-6 shadow-[0_6px_25px_rgb(143,203,234,0.08)]">
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#8FCBEA]/20 to-[#F2C9D6]/20 blur-2xl pointer-events-none" 
            />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2E3A5A] flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#2E3A5A]" />
                  พฤติกรรมสุขภาพ & การคัดกรองโรค (Lifestyle & Screening)
                </h3>
                <p className="text-xs text-[#2E3A5A]/70">
                  สัดส่วนผู้มีปัจจัยเสี่ยงพฤติกรรม (บุหรี่/สุรา/ไม่ออกกำลังกาย) และผลคัดกรองโรค
                </p>
              </div>
            </div>

            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={lifestyleSummaryData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="factor" stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
                    formatter={(val) => <span className="text-[#2E3A5A] font-medium">{val}</span>}
                  />
                  <Bar dataKey="เสี่ยง_ผิดปกติ" name="เสี่ยง / ผิดปกติ" fill="#E65C7B" stackId="b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ปกติ_ไม่เสี่ยง" name="ปกติ / ปลอดภัย" fill="#8FCBEA" stackId="b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 4: สัดส่วนระดับความเสี่ยง & การกระจายของคะแนนความเสี่ยง */}
        {(activeTab === 'all' || activeTab === 'risk_score') && (
          <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md border border-[#8FCBEA]/30 p-5 sm:p-6 shadow-[0_6px_25px_rgb(143,203,234,0.08)]">
            <div 
              className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#BFE6FF]/25 to-[#5BBF9E]/20 blur-2xl pointer-events-none" 
            />
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2E3A5A] flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#2E3A5A]" />
                  สัดส่วนระดับความเสี่ยงและคะแนนความเสี่ยง
                </h3>
                <p className="text-xs text-[#2E3A5A]/70">
                  สัดส่วนประชากรตามระดับความเสี่ยง (ต่ำ / ปานกลาง / สูง)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[290px]">
              {/* Donut Chart of Risk Level */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-full h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskLevelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {riskLevelData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.name}`} 
                            fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#8FCBEA'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="flex items-center justify-center gap-3 text-xs">
                  {riskLevelData.map(item => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: RISK_COLORS[item.name as keyof typeof RISK_COLORS] }} 
                      />
                      <span className="font-medium text-[#2E3A5A]">{item.name}: {item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart of Risk Scores (0-7) */}
              <div className="flex flex-col justify-center">
                <p className="text-[11px] font-semibold text-[#2E3A5A]/80 text-center mb-1">
                  การกระจายคะแนนความเสี่ยง (0 - 7 คะแนน)
                </p>
                <div className="w-full h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskScoreData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                      <XAxis dataKey="score" stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 10 }} />
                      <YAxis stroke="#2E3A5A" tick={{ fill: '#2E3A5A', fontSize: 10 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="จำนวน" fill="#8FCBEA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
