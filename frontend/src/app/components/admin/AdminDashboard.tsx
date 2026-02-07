import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  UserCheck,
  AlertCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { alumni, students, jobs, events, applications, mentorshipRequests } = useApp();

  const stats = [
    {
      title: 'Total Alumni',
      value: alumni.length,
      icon: Users,
      color: '#0F766E',
      description: 'Registered alumni',
      change: '+12% from last month',
      action: () => onNavigate('users')
    },
    {
      title: 'Total Students',
      value: students.length,
      icon: UserCheck,
      color: '#1F8A7A',
      description: 'Active students',
      change: '+8% from last month',
      action: () => onNavigate('users')
    },
    {
      title: 'Job Postings',
      value: jobs.length,
      icon: Briefcase,
      color: '#E07A2F',
      description: `${jobs.filter(j => j.status === 'open').length} open positions`,
      change: '+5 new this week',
      action: () => onNavigate('jobs')
    },
    {
      title: 'Active Events',
      value: events.filter(e => e.status === 'upcoming').length,
      icon: Calendar,
      color: '#C75B12',
      description: 'Upcoming events',
      change: `${events.reduce((s, e) => s + e.registeredCount, 0)} registrations`,
      action: () => onNavigate('events')
    },
  ];

  const recentActivity = [
    { type: 'job', text: 'New job posted: Frontend Developer at Google', time: '2 hours ago' },
    { type: 'application', text: '15 new job applications submitted', time: '4 hours ago' },
    { type: 'event', text: 'Annual Alumni Reunion reached 150 registrations', time: '6 hours ago' },
    { type: 'mentorship', text: '3 new mentorship requests pending', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage the alumni engagement platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={stat.action}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs mt-2" style={{ color: stat.color }}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FAEBDD' }}>
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-xl font-semibold">{applications.length}</p>
                </div>
                <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                  {applications.filter(a => a.status === 'pending').length} pending
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF1C1' }}>
                <div>
                  <p className="text-sm text-muted-foreground">Mentorship Requests</p>
                  <p className="text-xl font-semibold">{mentorshipRequests.length}</p>
                </div>
                <Badge style={{ backgroundColor: '#FFD6B8', color: '#E07A2F' }}>
                  {mentorshipRequests.filter(m => m.status === 'pending').length} pending
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#CDEDEA' }}>
                <div>
                  <p className="text-sm text-muted-foreground">Event Registrations</p>
                  <p className="text-xl font-semibold">
                    {events.reduce((sum, e) => sum + e.registeredCount, 0)}
                  </p>
                </div>
                <Badge style={{ backgroundColor: '#0F766E', color: '#ffffff' }}>
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg border">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#FAEBDD' }}
                  >
                    {activity.type === 'job' && <Briefcase className="w-4 h-4" style={{ color: '#E07A2F' }} />}
                    {activity.type === 'application' && <TrendingUp className="w-4 h-4" style={{ color: '#E07A2F' }} />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4" style={{ color: '#E07A2F' }} />}
                    {activity.type === 'mentorship' && <UserCheck className="w-4 h-4" style={{ color: '#E07A2F' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Job Postings</CardTitle>
                <CardDescription>Most popular opportunities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('jobs')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs
                .sort((a, b) => (b.applicants || 0) - (a.applicants || 0))
                .slice(0, 5)
                .map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{job.title}</h4>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{job.applicants || 0}</p>
                      <p className="text-xs text-muted-foreground">applicants</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Popular Events</CardTitle>
                <CardDescription>Highest registration</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('events')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .sort((a, b) => b.registeredCount - a.registeredCount)
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{event.registeredCount}</p>
                      <p className="text-xs text-muted-foreground">registered</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('users')}
            >
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('jobs')}
            >
              <Briefcase className="w-6 h-6" />
              <span>Review Jobs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('events')}
            >
              <Calendar className="w-6 h-6" />
              <span>Manage Events</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('analytics')}
            >
              <BarChart3 className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
