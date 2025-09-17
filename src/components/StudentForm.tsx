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
    email: '',
    phone: '',
    class_name: '',
    subscription_type: 'Basic' as Student['subscription_type'],
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
      email: '',
      phone: '',
      class_name: '',
      subscription_type: 'Basic',
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class_name">Class</Label>
              <Input
                id="class_name"
                value={formData.class_name}
                onChange={(e) => setFormData(prev => ({ ...prev, class_name: e.target.value }))}
                placeholder="Enter class name"
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
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
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