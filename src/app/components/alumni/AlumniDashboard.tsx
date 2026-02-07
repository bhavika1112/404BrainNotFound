import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Briefcase, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  Users,
  Bell,
  ArrowRight
} from 'lucide-react';

interface AlumniDashboardProps {
  onNavigate: (view: string) => void;
}

export function AlumniDashboard({ onNavigate }: AlumniDashboardProps) {
  const { currentUser, jobs, events, mentorshipRequests } = useApp();

  const myJobs = jobs.filter(job => job.postedBy === currentUser?.name);
  const myMentorshipRequests = mentorshipRequests.filter(
    req => req.mentorName === currentUser?.name && req.status === 'pending'
  );
  const upcomingEvents = events.filter(e => e.status === 'upcoming').slice(0, 3);

  const stats = [
    {
      title: 'Jobs Posted',
      value: myJobs.length,
      icon: Briefcase,
      color: '#0F766E',
      description: 'Active job postings',
      action: () => onNavigate('jobs')
    },
    {
      title: 'Mentorship Requests',
      value: myMentorshipRequests.length,
      icon: UserCheck,
      color: '#E07A2F',
      description: 'Pending requests',
      action: () => onNavigate('mentorship')
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: '#1F8A7A',
      description: 'Events this month',
      action: () => onNavigate('events')
    },
    {
      title: 'Network Impact',
      value: myJobs.reduce((sum, job) => sum + (job.applicants || 0), 0),
      icon: TrendingUp,
      color: '#C75B12',
      description: 'Total job applicants'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">
          {currentUser?.currentRole} at {currentUser?.currentOrganization}
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
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Job Postings</CardTitle>
                <CardDescription>Jobs you've posted recently</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('jobs')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No job postings yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => onNavigate('jobs')}
                  >
                    Post a Job
                  </Button>
                </div>
              ) : (
                myJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-start justify-between p-3 rounded-lg" style={{ backgroundColor: '#FAEBDD' }}>
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{job.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {job.applicants || 0} applicants
                        </span>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                      {job.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mentorship Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mentorship Requests</CardTitle>
                <CardDescription>Students seeking your guidance</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('mentorship')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myMentorshipRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending mentorship requests</p>
                </div>
              ) : (
                myMentorshipRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="p-3 rounded-lg" style={{ backgroundColor: '#FFF1C1' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{request.studentName}</h4>
                        <p className="text-sm text-muted-foreground">{request.domain}</p>
                      </div>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{request.message}</p>
                  </div>
                ))
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
              <CardDescription>Alumni events and reunions</CardDescription>
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
                <div className="text-right">
                  <Badge variant="outline">{event.type}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.registeredCount} registered
                  </p>
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
          <CardDescription>Common tasks and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('jobs')}
            >
              <Briefcase className="w-6 h-6" />
              <span>Post a Job</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('events')}
            >
              <Calendar className="w-6 h-6" />
              <span>Register for Event</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex-col gap-2"
              onClick={() => onNavigate('mentorship')}
            >
              <Users className="w-6 h-6" />
              <span>View Mentorship</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
