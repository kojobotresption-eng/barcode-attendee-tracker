import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import ManualEntry from '@/components/ManualEntry';
import StudentForm from '@/components/StudentForm';
import AttendanceStats from '@/components/AttendanceStats';
import AttendanceList from '@/components/AttendanceList';
import StudentList from '@/components/StudentList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Scan, Users, BarChart3, Calendar, CheckCircle } from 'lucide-react';
import { Student, AttendanceRecord } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { loadStudentsFromCSV } from '@/utils/csvParser';

const Index = () => {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [isScannerActive, setIsScannerActive] = useState(false);

  // Load real students data from CSV on first load
  useEffect(() => {
    if (students.length === 0) {
      loadStudentsFromCSV().then(csvStudents => {
        if (csvStudents.length > 0) {
          setStudents(csvStudents);
          toast({
            title: "Students Loaded!",
            description: `${csvStudents.length} students imported from CSV data.`,
          });
        }
      });
    }
  }, [students.length, setStudents]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'created_at'>) => {
    // Check if student ID already exists
    if (students.some(s => s.student_id === studentData.student_id)) {
      toast({
        title: "Duplicate Student ID",
        description: "A student with this ID already exists.",
        variant: "destructive",
      });
      return;
    }

    const newStudent: Student = {
      ...studentData,
      id: generateId(),
      created_at: new Date().toISOString(),
    };

    setStudents(prev => [...prev, newStudent]);
  };

  const handleToggleStudentActive = (studentId: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, is_active: !student.is_active }
          : student
      )
    );
  };

  const handleAttendanceEntry = (scannedId: string) => {
    const student = students.find(s => s.student_id === scannedId && s.is_active);
    
    if (!student) {
      toast({
        title: "Student Not Found",
        description: `Student ID ${scannedId} is not registered or inactive.`,
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0];

    // Check for duplicate attendance today
    const existingAttendance = attendance.find(
      record => record.student_id === scannedId && record.date === today
    );

    if (existingAttendance) {
      toast({
        title: "Already Registered",
        description: `${student.name} already attended today at ${existingAttendance.time}.`,
        variant: "destructive",
      });
      return;
    }

    // Record attendance
    const newAttendance: AttendanceRecord = {
      id: generateId(),
      student_id: scannedId,
      student_name: student.name,
      date: today,
      time: currentTime,
      created_at: new Date().toISOString(),
      student: student,
    };

    setAttendance(prev => [...prev, newAttendance]);
    
    toast({
      title: "Attendance Recorded!",
      description: `${student.name} marked present at ${currentTime}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Attendance System
              </h1>
              <p className="text-muted-foreground">QR/Barcode scanning with Excel export</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <AttendanceStats students={students} attendance={attendance} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <QRScanner
                onScan={handleAttendanceEntry}
                isActive={isScannerActive}
                onToggle={() => setIsScannerActive(!isScannerActive)}
              />
              <ManualEntry onSubmit={handleAttendanceEntry} />
              <AttendanceList attendance={attendance} />
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <AttendanceList attendance={attendance} />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <StudentForm onAddStudent={handleAddStudent} />
              <StudentList
                students={students}
                onToggleActive={handleToggleStudentActive}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendance
                      .slice(-5)
                      .reverse()
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-2 rounded bg-background/50"
                        >
                          <span className="font-medium">{record.student_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {record.date} at {record.time}
                          </span>
                        </div>
                      ))}
                    {attendance.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No attendance records yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-medium">
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['squad', 'core', 'x'].map((type) => {
                      const count = students.filter(s => s.subscription_type === type && s.is_active).length;
                      const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium capitalize">{type}</span>
                            <span className="text-sm text-muted-foreground">{count} students</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                type === 'core' ? 'bg-gradient-primary' :
                                type === 'squad' ? 'bg-accent' : 'bg-muted-foreground'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;