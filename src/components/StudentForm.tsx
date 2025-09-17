import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Save } from 'lucide-react';
import { Student } from '@/types';
import { toast } from '@/hooks/use-toast';

interface StudentFormProps {
  onAddStudent: (student: Omit<Student, 'id' | 'created_at'>) => void;
}

export default function StudentForm({ onAddStudent }: StudentFormProps) {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    age: 0,
    group: '',
    parent_id: '',
    subscription_type: 'squad' as Student['subscription_type'],
    duration: '',
    level: 0,
    category: 'First' as Student['category'],
    attendance_type: 'Offline' as Student['attendance_type'],
    subscription_start: '',
    subscription_end: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.name) {
      toast({
        title: "Missing Information",
        description: "Student ID and Name are required",
        variant: "destructive",
      });
      return;
    }

    onAddStudent({
      ...formData,
      is_active: true,
    });

    setFormData({
      student_id: '',
      name: '',
      age: 0,
      group: '',
      parent_id: '',
      subscription_type: 'squad',
      duration: '',
      level: 0,
      category: 'First',
      attendance_type: 'Offline',
      subscription_start: '',
      subscription_end: '',
      notes: '',
    });

    toast({
      title: "Student Added!",
      description: `${formData.name} has been registered successfully.`,
    });
  };

  return (
    <Card className="bg-gradient-card shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID *</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                placeholder="Enter student ID"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="Enter age"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                placeholder="Enter group (e.g., T9)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent ID</Label>
              <Input
                id="parent_id"
                value={formData.parent_id}
                onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                placeholder="Enter parent ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Enter duration (e.g., شهر, ٣ شهور)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                placeholder="Enter level"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Student['category']) => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First</SelectItem>
                  <SelectItem value="Second">Second</SelectItem>
                  <SelectItem value="Third">Third</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance_type">Attendance Type</Label>
              <Select
                value={formData.attendance_type}
                onValueChange={(value: Student['attendance_type']) => 
                  setFormData(prev => ({ ...prev, attendance_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter notes (optional)"
            />
          </div>
            
          <div className="space-y-2">
            <Label htmlFor="subscription_type">Subscription Type</Label>
            <Select
              value={formData.subscription_type}
              onValueChange={(value: Student['subscription_type']) => 
                setFormData(prev => ({ ...prev, subscription_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="squad">Squad</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="x">X Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" variant="gradient">
            <Save className="w-4 h-4" />
            Add Student
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}