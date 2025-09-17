export interface Student {
  id: string;
  student_id: string; // ID from CSV
  name: string; // الاسم
  age?: number; // العمر
  group: string; // الجروب
  parent_id?: string; // ولي الامر
  subscription_type: 'squad' | 'core' | 'x'; // الباقة
  duration: string; // المدة
  level: number; // المستوي
  category: 'First' | 'Second' | 'Third'; // الفئة
  attendance_type: 'Online' | 'Offline'; // نوع الحضور
  subscription_start?: string; // بداية الاشتراك
  subscription_end?: string; // نهاية الاشتراك
  notes?: string; // Notes
  is_active: boolean;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  time: string;
  created_at: string;
}

export interface AttendanceRecord extends Attendance {
  student: Student;
}