import { HealthRecord } from '../types';
import { INITIAL_RECORDS } from '../data/initialData';

export const SHEET_ID = '1f508QZq-6T8OMuU5d-5O4sUR-Fl6OOjnzctzHCY3ojo';
export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
export const CSV_BACKUP_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSV(csvText: string): HealthRecord[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return [];
  }

  const parseLine = (line: string): string[] => {
    const row: string[] = [];
    let inQuote = false;
    let curr = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        row.push(curr.trim());
        curr = '';
      } else {
        curr += char;
      }
    }
    row.push(curr.trim());
    return row.map(s => s.replace(/^"|"$/g, '').trim());
  };

  const headers = parseLine(lines[0]);
  const records: HealthRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseLine(lines[i]);
    if (!rawCols[0] || rawCols[0].trim() === '') continue;

    // Header index mapping helper
    const getVal = (name: string, fallbackIdx: number): string => {
      const idx = headers.findIndex(h => h.includes(name));
      if (idx !== -1 && rawCols[idx] !== undefined) {
        return rawCols[idx];
      }
      return rawCols[fallbackIdx] || '';
    };

    const id = getVal('รหัสบุคคล', 0);
    if (!id || !id.startsWith('H')) continue;

    const seq = parseInt(id.replace(/\D/g, ''), 10) || (records.length + 1);
    const date = getVal('วันที่คัดกรอง', 1);
    const area = getVal('พื้นที่', 2);
    const gender = getVal('เพศ', 3);
    const age = parseFloat(getVal('อายุ', 4)) || 0;
    const height = parseFloat(getVal('ส่วนสูง', 5)) || 0;
    const weight = parseFloat(getVal('น้ำหนัก', 6)) || 0;
    const bmi = parseFloat(getVal('BMI', 7)) || 0;
    const sbp = parseFloat(getVal('SBP', 8)) || 0;
    const dbp = parseFloat(getVal('DBP', 9)) || 0;
    const pulse = parseFloat(getVal('ชีพจร', 10)) || 0;
    const bloodSugar = parseFloat(getVal('น้ำตาล', 11)) || 0;
    const smoking = getVal('สูบบุหรี่', 12);
    const alcohol = getVal('ดื่มแอลกอฮอล์', 13);
    const exercise = getVal('การออกกำลังกาย', 14);
    const diabetesScreening = getVal('เบาหวาน_คัดกรอง', 15);
    const hypertensionScreening = getVal('ความดันโลหิตสูง_คัดกรอง', 16);
    const riskScore = parseFloat(getVal('คะแนนความเสี่ยง', 17)) || 0;
    const riskLevel = getVal('ระดับความเสี่ยง', 18) || (riskScore >= 4 ? 'สูง' : riskScore >= 2 ? 'ปานกลาง' : 'ต่ำ');
    const month = getVal('เดือน', 19);

    records.push({
      seq,
      id,
      date,
      area,
      gender,
      age,
      height,
      weight,
      bmi,
      sbp,
      dbp,
      pulse,
      bloodSugar,
      smoking,
      alcohol,
      exercise,
      diabetesScreening,
      hypertensionScreening,
      riskScore,
      riskLevel,
      month
    });
  }

  return records;
}

export async function fetchHealthRecords(): Promise<{
  records: HealthRecord[];
  lastUpdated: Date;
  isRealtime: boolean;
}> {
  try {
    // Add cache-busting query parameter for real-time fresh data
    const url = `${CSV_URL}&t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'text/csv' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const records = parseCSV(csvText);

    if (records.length > 0) {
      return {
        records,
        lastUpdated: new Date(),
        isRealtime: true
      };
    } else {
      throw new Error('No records parsed from sheet response');
    }
  } catch (error) {
    console.warn('Real-time fetch encountered an error, using initial synchronized dataset:', error);
    return {
      records: INITIAL_RECORDS,
      lastUpdated: new Date(),
      isRealtime: false
    };
  }
}

export function formatThaiDateTime(date: Date): string {
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}
