export interface StudentProfile {
  id: number;
  name: string;
  grade_level: string;
  student_id: string;
}

export interface Grade {
  subject: string;
  score: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export interface FeeInfo {
  id: number;
  student_id: number;
  total_amount: number;
  paid_amount: number;
  status: string;
}

export interface PaymentHistory {
  id: number;
  fee_id: number;
  amount: number;
  date: string;
  method: string;
}

export interface StudentData {
  profile: StudentProfile;
  academic: Grade[];
  attendance: AttendanceRecord[];
}

export interface FeeData {
  fees: FeeInfo;
  history: PaymentHistory[];
}
