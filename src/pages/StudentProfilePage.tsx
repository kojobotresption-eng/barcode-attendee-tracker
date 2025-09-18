import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudentProfile from '@/components/StudentProfile';
import { Student, AttendanceRecord } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [students] = useLocalStorage<Student[]>('students', []);
  const [attendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (studentId) {
      const foundStudent = students.find(s => s.student_id === studentId);
      setStudent(foundStudent || null);
    }
  }, [studentId, students]);

  if (!student) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The student with ID "{studentId}" could not be found.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <StudentProfile student={student} attendance={attendance} />;
};

export default StudentProfilePage;