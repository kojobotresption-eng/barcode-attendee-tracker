import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hash, UserCheck } from 'lucide-react';

interface ManualEntryProps {
  onSubmit: (studentId: string) => void;
}

export default function ManualEntry({ onSubmit }: ManualEntryProps) {
  const [studentId, setStudentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      onSubmit(studentId.trim());
      setStudentId('');
    }
  };

  return (
    <Card className="bg-gradient-card shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          Manual Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manual-student-id">Student ID</Label>
            <Input
              id="manual-student-id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID or scan barcode"
              className="text-lg"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            variant="gradient"
            disabled={!studentId.trim()}
          >
            <UserCheck className="w-4 h-4" />
            Mark Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}