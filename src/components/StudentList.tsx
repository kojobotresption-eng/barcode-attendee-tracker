import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, GraduationCap, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { Student } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface StudentListProps {
  students: Student[];
  onToggleActive: (studentId: string) => void;
}

export default function StudentList({ students, onToggleActive }: StudentListProps) {
  const navigate = useNavigate();
  const activeStudents = students.filter(s => s.is_active);
  const inactiveStudents = students.filter(s => !s.is_active);

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-gradient-primary text-primary-foreground';
      case 'squad': return 'bg-accent text-accent-foreground';
      case 'x': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleToggleActive = (student: Student) => {
    onToggleActive(student.id);
    toast({
      title: student.is_active ? "Student Deactivated" : "Student Activated",
      description: `${student.name} has been ${student.is_active ? 'deactivated' : 'activated'}.`,
    });
  };

  const StudentCard = ({ student }: { student: Student }) => (
    <div
      key={student.id}
      className={`p-4 rounded-lg border transition-smooth hover:shadow-soft ${
        student.is_active ? 'bg-background' : 'bg-muted/50 opacity-75'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{student.name}</h4>
            <Badge className={getSubscriptionColor(student.subscription_type)}>
              {student.subscription_type}
            </Badge>
            {!student.is_active && (
              <Badge variant="outline" className="text-muted-foreground">
                Inactive
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            ID: {student.student_id}
          </p>
          
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              Group: {student.group || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              Age: {student.age || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              Category: {student.category || 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/student/${student.student_id}`)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4" />
            Profile
          </Button>
          <Button
            onClick={() => handleToggleActive(student)}
            variant={student.is_active ? "outline" : "success"}
            size="sm"
          >
            {student.is_active ? (
              <>
                <ToggleLeft className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="w-4 h-4" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gradient-card shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Registered Students ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students registered yet</p>
              <p className="text-sm">Add students using the form above</p>
            </div>
          ) : (
            <>
              {activeStudents.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-3">
                    Active Students ({activeStudents.length})
                  </h5>
                  <div className="space-y-3">
                    {activeStudents.map(student => (
                      <StudentCard key={student.id} student={student} />
                    ))}
                  </div>
                </div>
              )}
              
              {inactiveStudents.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-3">
                    Inactive Students ({inactiveStudents.length})
                  </h5>
                  <div className="space-y-3">
                    {inactiveStudents.map(student => (
                      <StudentCard key={student.id} student={student} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}