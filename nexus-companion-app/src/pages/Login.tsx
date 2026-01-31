// Mock data/types
type Role = 'parent' | 'student' | null;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, GraduationCap } from 'lucide-react';
import { useNexus } from '@/context/NexusContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useNexus();

  const handleLogin = (role: 'parent' | 'student') => {
    login(role);
    if (role === 'parent') {
        navigate('/parent');
    } else if (role === 'student') {
        navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-600/20 p-3 rounded-full mb-4 w-fit">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-xl">
              N
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">NEXUS Companion</CardTitle>
          <CardDescription className="text-slate-400">Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2 border-slate-700 hover:bg-slate-800 hover:text-white"
            onClick={() => handleLogin('parent')}
          >
            <User className="h-6 w-6" />
            <span className="text-lg">I am a Parent</span>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2 border-slate-700 hover:bg-slate-800 hover:text-white"
            onClick={() => handleLogin('student')}
          >
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg">I am a Student</span>
          </Button>
          
          <div className="pt-4 text-center text-xs text-slate-500">
            RTA Smart Traffic Systems © 2026
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
