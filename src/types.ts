export interface HealthRecord {
  id: string;                    // รหัสบุคคล เช่น H0001
  date: string;                  // วันที่คัดกรอง เช่น 3/1/2026
  area: string;                  // พื้นที่: เมือง, เหนือ, ใต้, ตะวันออก, ตะวันตก
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number;                   // อายุ (ปี)
  height: number;                // ส่วนสูง_cm
  weight: number;                // น้ำหนัก_kg
  bmi: number;                   // BMI
  sbp: number;                   // SBP_mmHg
  dbp: number;                   // DBP_mmHg
  pulse: number;                 // ชีพจร_bpm
  bloodSugar: number;            // น้ำตาล_mg_dL
  smoking: 'สูบ' | 'ไม่สูบ' | string;       // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string;     // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesScreening: 'มีแนวโน้ม/เสี่ยง' | 'ไม่มี' | string; // เบาหวาน_คัดกรอง
  hypertensionScreening: 'มีแนวโน้ม/เสี่ยง' | 'ไม่มี' | string; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number;             // คะแนนความเสี่ยง
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string;                 // เดือน เช่น 2026-01
}

export type RiskLevelType = 'ทั้งหมด' | 'ต่ำ' | 'ปานกลาง' | 'สูง';
export type DiseaseScreeningFilter = 'ทั้งหมด' | 'เสี่ยงเบาหวาน' | 'เสี่ยงความดัน' | 'เสี่ยงทั้งคู่' | 'ไม่มีความเสี่ยงทั้งคู่';
export type AgeRangeFilter = 'ทั้งหมด' | '< 30 ปี' | '30 - 45 ปี' | '46 - 60 ปี' | '> 60 ปี';

export interface FilterState {
  riskLevel: RiskLevelType;
  diseaseScreening: DiseaseScreeningFilter;
  ageRange: AgeRangeFilter;
  area: string; // 'ทั้งหมด' or specific area
  gender: string; // 'ทั้งหมด' or 'ชาย' or 'หญิง'
  searchQuery: string;
}

export interface MetricSummary {
  count: number;
  total: number;
  percentage: number;
  proportion: string;
  avgRiskScore: number;
  minRiskScore: number;
  maxRiskScore: number;
  avgKeyMetric?: number; // e.g. avg blood sugar or avg sbp
  label: string;
  subLabel: string;
}
