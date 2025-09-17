export interface Student {
  id: string;
  student_id: string;
  name: string;
  email?: string;
  phone?: string;
  class_name?: string;
  subscription_type: 'Basic' | 'Premium' | 'VIP';
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