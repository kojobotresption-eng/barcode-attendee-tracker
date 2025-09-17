import { Student } from '@/types';

export const parseStudentCSV = (csvText: string): Student[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      const values = line.split(',');
      
      // Handle CSV parsing with proper field mapping
      const studentId = values[0]?.trim() || '';
      const group = values[1]?.trim() || '';
      const parentId = values[2]?.trim() || '';
      const name = values[3]?.trim() || '';
      const age = parseInt(values[4]?.trim()) || 0;
      const subscriptionType = (values[5]?.trim() || 'squad') as 'squad' | 'core' | 'x';
      const duration = values[6]?.trim() || '';
      const level = parseInt(values[7]?.trim()) || 0;
      const category = (values[8]?.trim() || 'First') as 'First' | 'Second' | 'Third';
      const attendanceType = (values[9]?.trim() || 'Offline') as 'Online' | 'Offline';
      const subscriptionStart = values[10]?.trim() || '';
      const subscriptionEnd = values[11]?.trim() || '';
      const notes = values[12]?.trim() || '';

      return {
        id: `student_${index}`,
        student_id: studentId,
        name: name,
        age: age > 0 ? age : undefined,
        group: group,
        parent_id: parentId,
        subscription_type: subscriptionType,
        duration: duration,
        level: level,
        category: category,
        attendance_type: attendanceType,
        subscription_start: subscriptionStart || undefined,
        subscription_end: subscriptionEnd || undefined,
        notes: notes || undefined,
        is_active: true,
        created_at: new Date().toISOString(),
      } as Student;
    })
    .filter(student => student.student_id && student.name); // Filter out invalid entries
};

export const loadStudentsFromCSV = async (): Promise<Student[]> => {
  try {
    const response = await fetch('/data/students.csv');
    const csvText = await response.text();
    return parseStudentCSV(csvText);
  } catch (error) {
    console.error('Error loading students from CSV:', error);
    return [];
  }
};