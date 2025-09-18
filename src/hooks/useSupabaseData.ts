import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Student, AttendanceRecord } from '@/types';

export const useSupabaseData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students from Supabase
  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      const formattedStudents: Student[] = data.map(student => ({
        id: student.id,
        student_id: student.student_id,
        name: student.name,
        age: student.age,
        group: student.group_name,
        parent_id: student.parent_id,
        subscription_type: student.subscription_type as 'squad' | 'core' | 'x',
        duration: student.duration,
        level: student.level,
        category: student.category as 'First' | 'Second' | 'Third',
        attendance_type: student.attendance_type as 'Online' | 'Offline',
        subscription_start: student.subscription_start,
        subscription_end: student.subscription_end,
        notes: student.notes,
        is_active: student.is_active,
        created_at: student.created_at
      }));
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Load attendance from Supabase
  const loadAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedAttendance: AttendanceRecord[] = data.map(record => ({
        id: record.id,
        student_id: record.student_id,
        student_name: record.student_name,
        date: record.date,
        time: record.time,
        created_at: record.created_at,
        student: students.find(s => s.student_id === record.student_id) || {} as Student
      }));
      
      setAttendance(formattedAttendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  // Add student to Supabase
  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          student_id: studentData.student_id,
          name: studentData.name,
          age: studentData.age,
          group_name: studentData.group,
          parent_id: studentData.parent_id,
          subscription_type: studentData.subscription_type,
          duration: studentData.duration,
          level: studentData.level,
          category: studentData.category,
          attendance_type: studentData.attendance_type,
          subscription_start: studentData.subscription_start,
          subscription_end: studentData.subscription_end,
          notes: studentData.notes,
          is_active: studentData.is_active
        }])
        .select()
        .single();

      if (error) throw error;
      await loadStudents();
      return { success: true };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, error };
    }
  };

  // Add attendance record to Supabase
  const addAttendance = async (studentId: string, studentName: string) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{
          student_id: studentId,
          student_name: studentName
        }]);

      if (error) throw error;
      await loadAttendance();
      return { success: true };
    } catch (error) {
      console.error('Error adding attendance:', error);
      return { success: false, error };
    }
  };

  // Migrate data from localStorage to Supabase (one-time migration)
  const migrateFromLocalStorage = async () => {
    try {
      // Check if migration already happened
      const { data: existingStudents } = await supabase
        .from('students')
        .select('id')
        .limit(1);

      if (existingStudents && existingStudents.length > 0) {
        return; // Migration already done
      }

      // Get data from localStorage
      const localStudents = JSON.parse(localStorage.getItem('students') || '[]');
      const localAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');

      // Migrate students
      if (localStudents.length > 0) {
        const studentsToInsert = localStudents.map((student: any) => ({
          student_id: student.student_id,
          name: student.name,
          age: student.age,
          group_name: student.group,
          parent_id: student.parent_id,
          subscription_type: student.subscription_type,
          duration: student.duration,
          level: student.level,
          category: student.category,
          attendance_type: student.attendance_type,
          subscription_start: student.subscription_start,
          subscription_end: student.subscription_end,
          notes: student.notes,
          is_active: student.is_active
        }));

        await supabase.from('students').insert(studentsToInsert);
      }

      // Migrate attendance
      if (localAttendance.length > 0) {
        const attendanceToInsert = localAttendance.map((record: any) => ({
          student_id: record.student_id,
          student_name: record.student_name,
          date: record.date,
          time: record.time
        }));

        await supabase.from('attendance').insert(attendanceToInsert);
      }

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await migrateFromLocalStorage();
      await loadStudents();
      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      loadAttendance();
    }
  }, [students]);

  return {
    students,
    attendance,
    loading,
    addStudent,
    addAttendance,
    loadStudents,
    loadAttendance
  };
};