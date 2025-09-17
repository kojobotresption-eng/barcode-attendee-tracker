import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';
import { AttendanceRecord } from '@/types';

interface AttendanceListProps {
  attendance: AttendanceRecord[];
}

export default function AttendanceList({ attendance }: AttendanceListProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance
    .filter(record => record.date === today)
    .sort((a, b) => b.time.localeCompare(a.time));

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-gradient-primary text-primary-foreground';
      case 'squad': return 'bg-accent text-accent-foreground';
      case 'x': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Today's Attendance ({todayAttendance.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {todayAttendance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No attendance recorded today</p>
              <p className="text-sm">Start scanning QR codes to track attendance</p>
            </div>
          ) : (
            todayAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border transition-smooth hover:shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{record.student_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ID: {record.student_id}
                      {record.student.group && ` • Group: ${record.student.group}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getSubscriptionColor(record.student.subscription_type)}>
                    {record.student.subscription_type}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {record.time}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}