import React from 'react';
import { Cigarette, Wine, Dumbbell, Droplets, HeartPulse } from 'lucide-react';
import { HealthRecord } from '../types';

interface KPICardsProps {
  records: HealthRecord[];
}

interface StatDetails {
  count: number;
  total: number;
  percentage: number;
  proportion: string;
  average: number;
  min: number;
  max: number;
  averageMetricName: string;
  unit: string;
  secondaryAvg: number;
  secondaryLabel: string;
}

export const KPICards: React.FC<KPICardsProps> = ({ records }) => {
  const total = records.length || 1;

  // 1. พฤติกรรมการสูบบุหรี่
  const smokers = records.filter(r => r.smoking === 'สูบ');
  const smokerRiskScores = smokers.map(r => r.riskScore);
  const smokingStats: StatDetails = {
    count: smokers.length,
    total,
    percentage: Math.round((smokers.length / total) * 1000) / 10,
    proportion: `${smokers.length}/${total}`,
    average: smokers.length ? Math.round((smokerRiskScores.reduce((a, b) => a + b, 0) / smokers.length) * 10) / 10 : 0,
    min: smokers.length ? Math.min(...smokerRiskScores) : 0,
    max: smokers.length ? Math.max(...smokerRiskScores) : 0,
    averageMetricName: 'คะแนนเสี่ยงเฉลี่ย',
    unit: 'คะแนน',
    secondaryAvg: smokers.length ? Math.round((smokers.reduce((a, b) => a + b.age, 0) / smokers.length) * 10) / 10 : 0,
    secondaryLabel: 'อายุเฉลี่ย'
  };

  // 2. พฤติกรรมการดื่มแอลกอฮอล์
  const drinkers = records.filter(r => r.alcohol === 'ดื่ม');
  const drinkerRiskScores = drinkers.map(r => r.riskScore);
  const alcoholStats: StatDetails = {
    count: drinkers.length,
    total,
    percentage: Math.round((drinkers.length / total) * 1000) / 10,
    proportion: `${drinkers.length}/${total}`,
    average: drinkers.length ? Math.round((drinkerRiskScores.reduce((a, b) => a + b, 0) / drinkers.length) * 10) / 10 : 0,
    min: drinkers.length ? Math.min(...drinkerRiskScores) : 0,
    max: drinkers.length ? Math.max(...drinkerRiskScores) : 0,
    averageMetricName: 'คะแนนเสี่ยงเฉลี่ย',
    unit: 'คะแนน',
    secondaryAvg: drinkers.length ? Math.round((drinkers.reduce((a, b) => a + b.bmi, 0) / drinkers.length) * 10) / 10 : 0,
    secondaryLabel: 'BMI เฉลี่ย'
  };

  // 3. พฤติกรรมการออกกำลังกาย (โฟกัสกลุ่มไม่ออกกำลังกายซึ่งเป็นกลุ่มเสี่ยง หรือกลุ่มออกกำลังกาย)
  const nonExercisers = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย');
  const regularExercisers = records.filter(r => r.exercise === 'สม่ำเสมอ');
  const nonExRiskScores = nonExercisers.map(r => r.riskScore);
  const exerciseStats: StatDetails = {
    count: nonExercisers.length,
    total,
    percentage: Math.round((nonExercisers.length / total) * 1000) / 10,
    proportion: `${nonExercisers.length}/${total}`,
    average: nonExercisers.length ? Math.round((nonExRiskScores.reduce((a, b) => a + b, 0) / nonExercisers.length) * 10) / 10 : 0,
    min: nonExercisers.length ? Math.min(...nonExRiskScores) : 0,
    max: nonExercisers.length ? Math.max(...nonExRiskScores) : 0,
    averageMetricName: 'คะแนนเสี่ยงเฉลี่ย (ไม่ออกฯ)',
    unit: 'คะแนน',
    secondaryAvg: regularExercisers.length ? Math.round((regularExercisers.length / total) * 1000) / 10 : 0,
    secondaryLabel: 'ออกกำลังกายสม่ำเสมอ (%)'
  };

  // 4. การคัดกรองโรคเบาหวาน (กลุ่มมีแนวโน้ม/เสี่ยง)
  const diabeticRisk = records.filter(r => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง');
  const diabeticSugarVals = diabeticRisk.map(r => r.bloodSugar);
  const diabetesStats: StatDetails = {
    count: diabeticRisk.length,
    total,
    percentage: Math.round((diabeticRisk.length / total) * 1000) / 10,
    proportion: `${diabeticRisk.length}/${total}`,
    average: diabeticRisk.length ? Math.round((diabeticSugarVals.reduce((a, b) => a + b, 0) / diabeticRisk.length) * 10) / 10 : 0,
    min: diabeticRisk.length ? Math.min(...diabeticSugarVals) : 0,
    max: diabeticRisk.length ? Math.max(...diabeticSugarVals) : 0,
    averageMetricName: 'ระดับน้ำตาลเฉลี่ย',
    unit: 'mg/dL',
    secondaryAvg: diabeticRisk.length ? Math.round((diabeticRisk.reduce((a, b) => a + b.riskScore, 0) / diabeticRisk.length) * 10) / 10 : 0,
    secondaryLabel: 'คะแนนเสี่ยงเฉลี่ย'
  };

  // 5. การคัดกรองโรคความดันโลหิตสูง (กลุ่มมีแนวโน้ม/เสี่ยง)
  const htnRisk = records.filter(r => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง');
  const htnSbpVals = htnRisk.map(r => r.sbp);
  const htnStats: StatDetails = {
    count: htnRisk.length,
    total,
    percentage: Math.round((htnRisk.length / total) * 1000) / 10,
    proportion: `${htnRisk.length}/${total}`,
    average: htnRisk.length ? Math.round((htnSbpVals.reduce((a, b) => a + b, 0) / htnRisk.length) * 10) / 10 : 0,
    min: htnRisk.length ? Math.min(...htnSbpVals) : 0,
    max: htnRisk.length ? Math.max(...htnSbpVals) : 0,
    averageMetricName: 'ความดันตัวบน (SBP) เฉลี่ย',
    unit: 'mmHg',
    secondaryAvg: htnRisk.length ? Math.round((htnRisk.reduce((a, b) => a + b.dbp, 0) / htnRisk.length) * 10) / 10 : 0,
    secondaryLabel: 'ความดันตัวล่าง (DBP) เฉลี่ย'
  };

  const cardsConfig = [
    {
      id: 'kpi-smoking',
      title: 'พฤติกรรมการสูบบุหรี่',
      subtitle: 'กลุ่มผู้สูบบุหรี่เป็นประจำ',
      icon: Cigarette,
      iconColor: 'text-[#E78234]',
      iconBg: 'bg-[#FEF3E9] border-[#F4A261]/40',
      badgeBg: 'bg-[#FEF3E9] text-[#B25E1E]',
      stat: smokingStats,
      airbrushAura: 'from-[#F4A261]/20 via-[#F2C9D6]/15 to-transparent'
    },
    {
      id: 'kpi-alcohol',
      title: 'พฤติกรรมการดื่มแอลกอฮอล์',
      subtitle: 'กลุ่มผู้ดื่มแอลกอฮอล์',
      icon: Wine,
      iconColor: 'text-[#8C3A50]',
      iconBg: 'bg-[#FDE8ED] border-[#F2C9D6]',
      badgeBg: 'bg-[#F2C9D6]/60 text-[#8C3A50]',
      stat: alcoholStats,
      airbrushAura: 'from-[#F2C9D6]/30 via-[#BFE6FF]/20 to-transparent'
    },
    {
      id: 'kpi-exercise',
      title: 'พฤติกรรมการออกกำลังกาย',
      subtitle: 'กลุ่มที่ไม่ออกกำลังกาย',
      icon: Dumbbell,
      iconColor: 'text-[#2E3A5A]',
      iconBg: 'bg-[#BFE6FF]/40 border-[#8FCBEA]/50',
      badgeBg: 'bg-[#BFE6FF]/50 text-[#2E3A5A]',
      stat: exerciseStats,
      airbrushAura: 'from-[#8FCBEA]/25 via-[#BFE6FF]/20 to-transparent'
    },
    {
      id: 'kpi-diabetes',
      title: 'การคัดกรองโรคเบาหวาน',
      subtitle: 'กลุ่มมีแนวโน้ม/เสี่ยงเบาหวาน',
      icon: Droplets,
      iconColor: 'text-[#2AA876]',
      iconBg: 'bg-[#E8F8F2] border-[#5BBF9E]/40',
      badgeBg: 'bg-[#E8F8F2] text-[#1E7754]',
      stat: diabetesStats,
      airbrushAura: 'from-[#5BBF9E]/20 via-[#BFE6FF]/20 to-transparent'
    },
    {
      id: 'kpi-hypertension',
      title: 'การคัดกรองโรคความดันโลหิตสูง',
      subtitle: 'กลุ่มมีแนวโน้ม/เสี่ยงความดันฯ',
      icon: HeartPulse,
      iconColor: 'text-[#E63968]',
      iconBg: 'bg-[#FFE8EE] border-[#E63968]/30',
      badgeBg: 'bg-[#FFE8EE] text-[#A61E42]',
      stat: htnStats,
      airbrushAura: 'from-[#E63968]/20 via-[#F2C9D6]/25 to-transparent'
    }
  ];

  return (
    <section className="relative z-10 w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#2E3A5A]">
            ตัวชี้วัดหลักและสถิติสรุป (KPI Summary)
          </h2>
          <p className="text-xs sm:text-sm text-[#2E3A5A]/75">
            สรุปข้อมูลสถิติสำคัญ 6 มิติ: จำนวน, ค่าเฉลี่ย, ค่าต่ำสุด, ค่าสูงสุด, สัดส่วน, ร้อยละ
          </p>
        </div>
      </div>

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cardsConfig.map((item) => {
          const Icon = item.icon;
          const s = item.stat;
          return (
            <div
              key={item.id}
              id={item.id}
              className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md border border-[#8FCBEA]/30 p-5 shadow-[0_4px_20px_rgb(143,203,234,0.1)] hover:shadow-[0_8px_30px_rgb(143,203,234,0.18)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Soft Airbrush Radial Glow inside card */}
              <div 
                className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${item.airbrushAura} blur-2xl pointer-events-none`}
              />

              <div>
                {/* Card Header with Icon & Subtitle */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl ${item.iconBg} border flex items-center justify-center shadow-xs flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.badgeBg}`}>
                    {s.percentage}% ของกลุ่ม
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2E3A5A] leading-tight mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#2E3A5A]/65 mb-4 font-medium">
                  {item.subtitle}
                </p>

                {/* Primary Number: จำนวน & สัดส่วน */}
                <div className="flex items-baseline justify-between pb-3 border-b border-[#8FCBEA]/20 mb-3">
                  <div>
                    <div className="text-xs text-[#2E3A5A]/70 font-medium">จำนวนผู้เข้าเกณฑ์</div>
                    <div className="text-2xl font-bold text-[#2E3A5A] tracking-tight">
                      {s.count} <span className="text-xs font-normal text-[#2E3A5A]/70">คน</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#2E3A5A]/70 font-medium">สัดส่วน / ทั้งหมด</div>
                    <div className="text-sm font-semibold text-[#2E3A5A] bg-[#F7F4ED] px-2 py-0.5 rounded-lg border border-[#8FCBEA]/20">
                      {s.proportion}
                    </div>
                  </div>
                </div>

                {/* 6 Required Metrics Breakdown */}
                <div className="space-y-2 text-xs">
                  {/* ค่าเฉลี่ย (Average) */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#2E3A5A]/75 font-medium">
                      ค่าเฉลี่ย:
                    </span>
                    <span className="font-bold text-[#2E3A5A]">
                      {s.average} <span className="text-[10px] font-normal text-[#2E3A5A]/70">{s.unit}</span>
                    </span>
                  </div>

                  {/* ค่าต่ำสุด - ค่าสูงสุด (Min - Max) */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#2E3A5A]/75 font-medium">
                      ค่าต่ำสุด - สูงสุด:
                    </span>
                    <span className="font-semibold text-[#2E3A5A] bg-[#BFE6FF]/30 px-2 py-0.5 rounded-md text-[11px]">
                      {s.min} – {s.max} {s.unit}
                    </span>
                  </div>

                  {/* สัดส่วน (Proportion) */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#2E3A5A]/75 font-medium">
                      สัดส่วนประชากร:
                    </span>
                    <span className="font-semibold text-[#2E3A5A]">
                      {s.proportion} ({s.percentage}%)
                    </span>
                  </div>

                  {/* ร้อยละ (Percentage) Progress bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-[#2E3A5A]/70 mb-1">
                      <span>ร้อยละ (อัตราส่วน)</span>
                      <span className="font-bold text-[#2E3A5A]">{s.percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F7F4ED] overflow-hidden border border-[#8FCBEA]/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8FCBEA] via-[#BFE6FF] to-[#F2C9D6] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(0, s.percentage))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Insight Footer */}
              <div className="mt-3 pt-2.5 border-t border-[#8FCBEA]/15 flex items-center justify-between text-[11px] text-[#2E3A5A]/70">
                <span>{s.secondaryLabel}</span>
                <span className="font-semibold text-[#2E3A5A]">
                  {s.secondaryAvg}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
