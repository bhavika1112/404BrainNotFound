import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserRole, useApp } from '../context/AppContext';
import { GraduationCap, Users, Shield } from 'lucide-react';

export function LoginPage() {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    graduationYear: '',
    currentOrganization: '',
    currentRole: '',
    department: '',
    batch: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginPassword, selectedRole);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: registerData.name,
      email: registerData.email,
      role: selectedRole,
      ...(selectedRole === 'alumni' ? {
        graduationYear: registerData.graduationYear,
        currentOrganization: registerData.currentOrganization,
        currentRole: registerData.currentRole,
      } : {
        department: registerData.department,
        batch: registerData.batch,
      })
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#0F766E' }}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2" style={{ color: '#1F2933' }}>Smart Alumni Connect</h1>
          <p className="text-muted-foreground">Connecting alumni, students, and institutions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Welcome back! Please sign in to continue.' : 'Join our alumni network today.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={selectedRole === 'student' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('student')}
                        className="flex flex-col h-auto py-3"
                      >
                        <Users className="w-5 h-5 mb-1" />
                        <span className="text-xs">Student</span>
                      </Button>
                      <Button
                        type="button"
                        variant={selectedRole === 'alumni' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('alumni')}
                        className="flex flex-col h-auto py-3"
                      >
                        <GraduationCap className="w-5 h-5 mb-1" />
                        <span className="text-xs">Alumni</span>
                      </Button>
                      <Button
                        type="button"
                        variant={selectedRole === 'admin' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('admin')}
                        className="flex flex-col h-auto py-3"
                      >
                        <Shield className="w-5 h-5 mb-1" />
                        <span className="text-xs">Admin</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Register as</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={selectedRole === 'student' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('student')}
                        className="flex flex-col h-auto py-3"
                      >
                        <Users className="w-5 h-5 mb-1" />
                        <span className="text-xs">Student</span>
                      </Button>
                      <Button
                        type="button"
                        variant={selectedRole === 'alumni' ? 'default' : 'outline'}
                        onClick={() => setSelectedRole('alumni')}
                        className="flex flex-col h-auto py-3"
                      >
                        <GraduationCap className="w-5 h-5 mb-1" />
                        <span className="text-xs">Alumni</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      placeholder="John Doe"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>

                  {selectedRole === 'alumni' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="graduation-year">Graduation Year</Label>
                        <Input
                          id="graduation-year"
                          placeholder="2020"
                          value={registerData.graduationYear}
                          onChange={(e) => setRegisterData({ ...registerData, graduationYear: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Current Organization</Label>
                        <Input
                          id="organization"
                          placeholder="Google"
                          value={registerData.currentOrganization}
                          onChange={(e) => setRegisterData({ ...registerData, currentOrganization: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Current Role</Label>
                        <Input
                          id="role"
                          placeholder="Software Engineer"
                          value={registerData.currentRole}
                          onChange={(e) => setRegisterData({ ...registerData, currentRole: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="Computer Science"
                          value={registerData.department}
                          onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="batch">Batch/Year</Label>
                        <Input
                          id="batch"
                          placeholder="2024"
                          value={registerData.batch}
                          onChange={(e) => setRegisterData({ ...registerData, batch: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
