import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentEvents() {
  const { events, registerForEvent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleRegister = (eventId: string, eventTitle: string) => {
    registerForEvent(eventId);
    toast.success(`Registered for ${eventTitle}`);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType && event.status === 'upcoming';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Campus Events</h1>
        <p className="text-muted-foreground">
          Participate in alumni events and networking opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
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
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-semibold mt-1">
                  {events.filter(e => e.status === 'upcoming').length}
                </p>
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

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
            <h3 className="mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back later for new events</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => {
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
  );
}
