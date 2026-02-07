import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  CheckCircle,
  Filter,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export function AlumniEvents() {
  const { currentUser, events, addEvent, registerForEvent } = useApp();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'Webinar',
    maxCapacity: '',
    organizer: currentUser?.name || ''
  });

  const handleRegister = (eventId: string, eventTitle: string) => {
    registerForEvent(eventId);
    toast.success(`Registered for ${eventTitle}`);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.status === 'completed');

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.description) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Add the event
    addEvent({
      ...newEvent,
      registeredCount: 0,
      maxCapacity: newEvent.maxCapacity ? parseInt(newEvent.maxCapacity) : undefined,
      status: 'upcoming'
    });
    
    // Send notification to admin
    addNotification({
      type: 'event',
      title: 'New Event Created',
      message: `${currentUser?.name} created a new event: "${newEvent.title}" on ${new Date(newEvent.date).toLocaleDateString()}`,
      priority: 'high'
    });
    
    toast.success('Event created successfully! Admin has been notified.');
    setShowCreateDialog(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'Webinar',
      maxCapacity: '',
      organizer: currentUser?.name || ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Alumni Events</h1>
        <p className="text-muted-foreground">
          Connect with fellow alumni and participate in campus events
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="px-4 py-2 rounded-md border bg-input-background"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Reunion">Reunion</option>
          <option value="Webinar">Webinar</option>
          <option value="Workshop">Workshop</option>
          <option value="Networking">Networking</option>
        </select>
        <select
          className="px-4 py-2 rounded-md border bg-input-background"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-semibold mt-1">{upcomingEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <CalendarIcon className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-semibold mt-1">
                  {events.filter(e => {
                    const eventDate = new Date(e.date);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && 
                           eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <Clock className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-semibold mt-1">
                  {events.reduce((sum, e) => sum + e.registeredCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Users className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarIcon className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
              <h3 className="mb-2">No upcoming events</h3>
              <p className="text-muted-foreground">Check back later for new events</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => {
              const isFull = event.maxCapacity && event.registeredCount >= event.maxCapacity;
              const fillPercentage = event.maxCapacity 
                ? (event.registeredCount / event.maxCapacity) * 100 
                : 0;

              return (
                <Card key={event.id} className="overflow-hidden">
                  <div 
                    className="h-2" 
                    style={{ 
                      background: `linear-gradient(to right, #0F766E ${fillPercentage}%, #FAEBDD ${fillPercentage}%)` 
                    }}
                  />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge style={{ backgroundColor: '#E07A2F', color: '#ffffff' }}>
                            {event.type}
                          </Badge>
                          {isFull && (
                            <Badge variant="destructive">Full</Badge>
                          )}
                        </div>
                        <CardTitle>{event.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {event.registeredCount} registered
                          {event.maxCapacity && ` / ${event.maxCapacity} capacity`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button 
                        className="flex-1"
                        disabled={isFull}
                        onClick={() => handleRegister(event.id, event.title)}
                      >
                        {isFull ? 'Event Full' : 'Register Now'}
                      </Button>
                      <Button variant="outline">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="mb-4">Past Events</h2>
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{event.type}</Badge>
                        <Badge variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.registeredCount} attended
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Event Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Event</h2>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  className="px-4 py-2 rounded-md border bg-input-background"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="Reunion">Reunion</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>
              <div>
                <Label>Max Capacity</Label>
                <Input
                  type="number"
                  value={newEvent.maxCapacity}
                  onChange={(e) => setNewEvent({ ...newEvent, maxCapacity: e.target.value })}
                />
              </div>
              <div>
                <Label>Organizer</Label>
                <Input
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button
                className="w-full"
                onClick={handleAddEvent}
              >
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Button */}
      <div className="mt-6">
        <Button
          className="w-full"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Event
        </Button>
      </div>
    </div>
  );
}