import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export function AdminAnalytics() {
  const { alumni, students, jobs, events, applications, mentorshipRequests } = useApp();

  const monthlyData = [
    { month: 'Jan', alumni: 45, students: 120, jobs: 12, events: 3 },
    { month: 'Feb', alumni: 52, students: 135, jobs: 18, events: 5 },
    { month: 'Mar', alumni: 48, students: 142, jobs: 15, events: 4 },
    { month: 'Apr', alumni: 61, students: 156, jobs: 22, events: 6 },
    { month: 'May', alumni: 58, students: 168, jobs: 20, events: 7 },
    { month: 'Jun', alumni: 65, students: 175, jobs: 25, events: 8 },
  ];

  const jobTypeData = [
    { name: 'Full-time', value: jobs.filter(j => j.type === 'Full-time').length, color: '#0F766E' },
    { name: 'Part-time', value: jobs.filter(j => j.type === 'Part-time').length, color: '#1F8A7A' },
    { name: 'Internship', value: jobs.filter(j => j.type === 'Internship').length, color: '#E07A2F' },
    { name: 'Contract', value: jobs.filter(j => j.type === 'Contract').length, color: '#C75B12' },
  ];

  const applicationStatusData = [
    { name: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#FFF1C1' },
    { name: 'Reviewed', value: applications.filter(a => a.status === 'reviewed').length, color: '#FFD6B8' },
    { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#CDEDEA' },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#8B8B8B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Platform insights and engagement metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-semibold mt-1">87%</p>
                <p className="text-xs mt-2" style={{ color: '#0F766E' }}>+5% from last month</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Job Placement</p>
                <p className="text-2xl font-semibold mt-1">
                  {applications.filter(a => a.status === 'accepted').length}
                </p>
                <p className="text-xs mt-2" style={{ color: '#1F8A7A' }}>
                  {applications.length} total applications
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <Briefcase className="w-5 h-5" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Event Size</p>
                <p className="text-2xl font-semibold mt-1">
                  {Math.round(events.reduce((s, e) => s + e.registeredCount, 0) / events.length)}
                </p>
                <p className="text-xs mt-2" style={{ color: '#C75B12' }}>
                  {events.length} total events
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Calendar className="w-5 h-5" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Mentorships</p>
                <p className="text-2xl font-semibold mt-1">
                  {mentorshipRequests.filter(m => m.status === 'accepted').length}
                </p>
                <p className="text-xs mt-2" style={{ color: '#E07A2F' }}>
                  {mentorshipRequests.length} total requests
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FBC4AB' }}>
                <Users className="w-5 h-5" style={{ color: '#D66A1F' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Monthly user and activity growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAEBDD" />
                <XAxis dataKey="month" stroke="#8B8B8B" />
                <YAxis stroke="#8B8B8B" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="alumni" stroke="#0F766E" strokeWidth={2} />
                <Line type="monotone" dataKey="students" stroke="#E07A2F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Activity</CardTitle>
            <CardDescription>Jobs and events over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#FAEBDD" />
                <XAxis dataKey="month" stroke="#8B8B8B" />
                <YAxis stroke="#8B8B8B" />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#0F766E" />
                <Bar dataKey="events" fill="#E07A2F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Type Distribution</CardTitle>
            <CardDescription>Breakdown by employment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current application pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#FAEBDD" />
                <XAxis type="number" stroke="#8B8B8B" />
                <YAxis type="category" dataKey="name" stroke="#8B8B8B" />
                <Tooltip />
                <Bar dataKey="value" fill="#0F766E">
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Data-driven recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#CDEDEA' }}>
              <Activity className="w-5 h-5 mt-0.5" style={{ color: '#0F766E' }} />
              <div>
                <h4 className="font-medium">High Engagement</h4>
                <p className="text-sm text-muted-foreground">
                  Alumni engagement increased by 15% this month. Consider hosting more networking events.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFD6B8' }}>
              <Briefcase className="w-5 h-5 mt-0.5" style={{ color: '#E07A2F' }} />
              <div>
                <h4 className="font-medium">Job Market Trend</h4>
                <p className="text-sm text-muted-foreground">
                  Tech jobs see 40% more applications than other sectors. Encourage alumni to post diverse opportunities.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FFF1C1' }}>
              <Users className="w-5 h-5 mt-0.5" style={{ color: '#C75B12' }} />
              <div>
                <h4 className="font-medium">Mentorship Success</h4>
                <p className="text-sm text-muted-foreground">
                  85% of mentorship requests are accepted. Promote this feature to increase student-alumni connections.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
