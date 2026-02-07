import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  Edit
} from 'lucide-react';

export function ProfilePage() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: '#CDEDEA' }}
              >
                <span className="text-3xl font-semibold" style={{ color: '#0F766E' }}>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="mb-1">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{currentUser.email}</p>
              <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
              </Badge>
              <Button variant="outline" className="w-full mt-6">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={currentUser.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={currentUser.email} readOnly />
              </div>
            </div>

            {currentUser.role === 'alumni' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input value={currentUser.graduationYear} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Organization</Label>
                    <Input value={currentUser.currentOrganization} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <Input value={currentUser.currentRole} readOnly />
                </div>
                {currentUser.skills && (
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {currentUser.role === 'student' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={currentUser.department} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Batch/Year</Label>
                  <Input value={currentUser.batch} readOnly />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {currentUser.role === 'alumni' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Contribution</CardTitle>
            <CardDescription>Impact you've made on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                    <Briefcase className="w-5 h-5" style={{ color: '#0F766E' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Jobs Posted</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                    <User className="w-5 h-5" style={{ color: '#E07A2F' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Mentorships</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#C75B12' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Events Attended</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentUser.role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                    <Briefcase className="w-5 h-5" style={{ color: '#0F766E' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                    <User className="w-5 h-5" style={{ color: '#E07A2F' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Connections</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#C75B12' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-sm text-muted-foreground">Events Registered</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
