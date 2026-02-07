import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  TrendingUp,
  ArrowRight,
  GraduationCap,
  CheckCircle
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
}

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { currentUser, jobs, events, applications, alumni } = useApp();

  const myApplications = applications.filter(app => app.studentId === currentUser?.id);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);
  const recentJobs = jobs.filter(j => j.status === 'open').slice(0, 5);

  const stats = [
    {
      title: 'Job Applications',
      value: myApplications.length,
      icon: Briefcase,
      color: '#0F766E',
      description: 'Total applications',
      action: () => onNavigate('jobs')
    },
    {
      title: 'Alumni Network',
      value: alumni.length,
      icon: Users,
      color: '#E07A2F',
      description: 'Available mentors',
      action: () => onNavigate('network')
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: '#1F8A7A',
      description: 'This month',
      action: () => onNavigate('events')
    },
    {
      title: 'Opportunities',
      value: jobs.filter(j => j.status === 'open').length,
      icon: TrendingUp,
      color: '#C75B12',
      description: 'Open positions'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Welcome, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">
          {currentUser?.department} • Batch {currentUser?.batch}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Job Opportunities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Opportunities</CardTitle>
                <CardDescription>Latest job postings from alumni</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('jobs')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No job postings available</p>
                </div>
              ) : (
                recentJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-3 rounded-lg cursor-pointer hover:shadow-sm transition-shadow" 
                    style={{ backgroundColor: '#FAEBDD' }}
                    onClick={() => onNavigate('jobs')}
                  >
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        by {job.postedBy}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your job applications</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('jobs')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No applications yet</p>
                  <Button 
                    className="mt-4" 
                    size="sm"
                    onClick={() => onNavigate('jobs')}
                  >
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                myApplications.slice(0, 5).map((app) => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div 
                      key={app.id} 
                      className="flex items-center justify-between p-3 rounded-lg" 
                      style={{ backgroundColor: '#FFF1C1' }}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{job?.title}</h4>
                        <p className="text-sm text-muted-foreground">{job?.company}</p>
                      </div>
                      <Badge 
                        style={
                          app.status === 'accepted' ? { backgroundColor: '#CDEDEA', color: '#0F766E' } :
                          app.status === 'rejected' ? { backgroundColor: '#FFD6B8', color: '#C75B12' } :
                          { backgroundColor: '#FFF1C1', color: '#C75B12' }
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Connect with alumni at these events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('events')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onNavigate('events')}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#CDEDEA' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#0F766E' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-semibold" style={{ color: '#0F766E' }}>
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.time} • {event.location}</p>
                </div>
                <Badge variant="outline">{event.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Alumni */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Featured Alumni</CardTitle>
              <CardDescription>Connect with successful alumni</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('network')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {alumni.slice(0, 3).map((alumnus) => (
              <div 
                key={alumnus.id} 
                className="p-4 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onNavigate('network')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#CDEDEA' }}
                  >
                    <span className="font-semibold" style={{ color: '#0F766E' }}>
                      {alumnus.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{alumnus.name}</h4>
                    <p className="text-xs text-muted-foreground">Class of {alumnus.graduationYear}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{alumnus.currentRole}</p>
                <p className="text-sm text-muted-foreground">{alumnus.currentOrganization}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {alumnus.skills?.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('jobs')}
            >
              <Briefcase className="w-6 h-6" />
              <span>Browse Jobs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('network')}
            >
              <GraduationCap className="w-6 h-6" />
              <span>Find Mentor</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('events')}
            >
              <Calendar className="w-6 h-6" />
              <span>Register for Event</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
