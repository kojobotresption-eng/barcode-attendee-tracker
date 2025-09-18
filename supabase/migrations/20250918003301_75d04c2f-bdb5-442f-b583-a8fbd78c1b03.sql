-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER,
  group_name TEXT NOT NULL,
  parent_id TEXT,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('squad', 'core', 'x')),
  duration TEXT NOT NULL,
  level INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('First', 'Second', 'Third')),
  attendance_type TEXT NOT NULL CHECK (attendance_type IN ('Online', 'Offline')),
  subscription_start DATE,
  subscription_end DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now)
CREATE POLICY "Students are viewable by everyone" 
ON public.students 
FOR SELECT 
USING (true);

CREATE POLICY "Students can be inserted by everyone" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Students can be updated by everyone" 
ON public.students 
FOR UPDATE 
USING (true);

CREATE POLICY "Attendance is viewable by everyone" 
ON public.attendance 
FOR SELECT 
USING (true);

CREATE POLICY "Attendance can be inserted by everyone" 
ON public.attendance 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);