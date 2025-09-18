import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Clock, BarChart3, Users, QrCode, Download } from 'lucide-react';
import { Student, AttendanceRecord } from '@/types';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useState } from 'react';

interface StudentProfileProps {
  student: Student;
  attendance: AttendanceRecord[];
}

export default function StudentProfile({ student, attendance }: StudentProfileProps) {
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const generateQRCode = async () => {
    try {
      const qrData = `STUDENT:${student.student_id}:${student.name}`;
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `QR_${student.name}_${student.student_id}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };
  
  // Filter attendance for this student
  const studentAttendance = attendance
    .filter(record => record.student_id === student.student_id)
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-gradient-primary text-primary-foreground';
      case 'squad': return 'bg-accent text-accent-foreground';
      case 'x': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDateWithDay = (date: string) => {
    const dateObj = new Date(date);
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = days[dateObj.getDay()];
    return `${dayName}, ${dateObj.toLocaleDateString('ar-EG')}`;
  };

  const formatTime = (time: string) => {
    const timeObj = new Date(`2000-01-01T${time}`);
    return timeObj.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate attendance statistics
  const totalAttendance = studentAttendance.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyAttendance = studentAttendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
  }).length;

  const last7Days = studentAttendance.filter(record => {
    const recordDate = new Date(record.date);
    const daysDiff = (new Date().getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-muted-foreground">Student Profile & Attendance History</p>
            </div>
          </div>
        </div>
        <Button onClick={generateQRCode} variant="default">
          <QrCode className="w-4 h-4 mr-2" />
          إنشاء QR Code
        </Button>
      </div>

      {/* QR Code Section */}
      {qrCodeUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code للطالب
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <img src={qrCodeUrl} alt="QR Code" className="mx-auto border rounded-lg" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              يمكن مسح هذا الكود لتسجيل حضور الطالب
            </p>
            <Button onClick={downloadQRCode} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              تحميل QR Code
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-card shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                <p className="text-lg font-mono">{student.student_id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg">{student.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription Type</label>
                <div className="mt-1">
                  <Badge className={getSubscriptionColor(student.subscription_type)}>
                    {student.subscription_type.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p>{student.age || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Group</label>
                  <p>{student.group || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Level</label>
                  <p>{student.level || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{student.category || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Attendance Type</label>
                <p>{student.attendance_type || 'N/A'}</p>
              </div>

              {student.subscription_start && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subscription Period</label>
                  <p className="text-sm">
                    {new Date(student.subscription_start).toLocaleDateString('ar-EG')} - 
                    {student.subscription_end ? new Date(student.subscription_end).toLocaleDateString('ar-EG') : 'Open'}
                  </p>
                </div>
              )}

              {student.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm">{student.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant={student.is_active ? "default" : "secondary"}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Statistics */}
          <Card className="bg-gradient-card shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Attendance Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{totalAttendance}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <div className="text-2xl font-bold text-accent-foreground">{monthlyAttendance}</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/10">
                  <div className="text-2xl font-bold">{last7Days}</div>
                  <div className="text-xs text-muted-foreground">Last 7 Days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-medium h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Complete Attendance History ({studentAttendance.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {studentAttendance.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance records found</p>
                    <p className="text-sm">Attendance will appear here once recorded</p>
                  </div>
                ) : (
                  studentAttendance.map((record, index) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border transition-smooth hover:shadow-soft"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <div className="text-lg font-bold text-primary">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {formatDateWithDay(record.date)}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {formatTime(record.time)}
                            <span className="text-xs">
                              ({new Date(record.created_at).toLocaleString('ar-EG')})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          Present
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Record #{studentAttendance.length - index}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}