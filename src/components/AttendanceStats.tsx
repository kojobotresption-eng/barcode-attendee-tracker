import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, Download, TrendingUp } from 'lucide-react';
import { AttendanceRecord, Student } from '@/types';
import * as XLSX from 'xlsx';
import { toast } from '@/hooks/use-toast';

interface AttendanceStatsProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

export default function AttendanceStats({ students, attendance }: AttendanceStatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(record => record.date === today);
  
  const totalStudents = students.filter(s => s.is_active).length;
  const presentToday = todayAttendance.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

  const exportToExcel = () => {
    const exportData = attendance.map(record => ({
      'Student ID': record.student_id,
      'Student Name': record.student_name,
      'Age': record.student.age || 'N/A',
      'Group': record.student.group || 'N/A',
      'Subscription Type': record.student.subscription_type,
      'Duration': record.student.duration || 'N/A',
      'Level': record.student.level || 'N/A',
      'Category': record.student.category || 'N/A',
      'Attendance Type': record.student.attendance_type || 'N/A',
      'Date': record.date,
      'Time': record.time,
      'Notes': record.student.notes || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

    // Auto-size columns
    const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet['!cols'] = Array(maxWidth).fill({ wch: 15 });

    XLSX.writeFile(workbook, `attendance_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful!",
      description: `${attendance.length} attendance records exported to Excel.`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">Active registrations</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <CalendarDays className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{presentToday}</div>
          <p className="text-xs text-muted-foreground">Attended today</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{attendanceRate}%</div>
          <p className="text-xs text-muted-foreground">Today's rate</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Export Data</CardTitle>
          <Download className="h-4 w-4 text-foreground" />
        </CardHeader>
        <CardContent>
          <Button 
            onClick={exportToExcel}
            variant="outline" 
            size="sm" 
            className="w-full"
            disabled={attendance.length === 0}
          >
            <Download className="w-4 h-4" />
            Excel Export
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}