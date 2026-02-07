import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  Users, 
  Search, 
  Briefcase, 
  GraduationCap, 
  Mail,
  MessageSquare,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentAlumniNetwork() {
  const { currentUser, alumni, addMentorshipRequest } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [selectedAlumni, setSelectedAlumni] = useState<string | null>(null);
  const [isMentorshipDialogOpen, setIsMentorshipDialogOpen] = useState(false);
  
  const [mentorshipRequest, setMentorshipRequest] = useState({
    domain: '',
    message: '',
  });

  const filteredAlumni = alumni.filter(alumnus => {
    const matchesSearch = alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumnus.currentOrganization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumnus.currentRole?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDomain === 'all' || alumnus.skills?.includes(filterDomain);
    return matchesSearch && matchesFilter;
  });

  const allSkills = Array.from(new Set(alumni.flatMap(a => a.skills || [])));

  const handleRequestMentorship = (alumniId: string, alumniName: string) => {
    setSelectedAlumni(alumniId);
    setIsMentorshipDialogOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAlumni || !currentUser) return;

    const alumnus = alumni.find(a => a.id === selectedAlumni);
    if (!alumnus) return;

    addMentorshipRequest({
      studentId: currentUser.id,
      studentName: currentUser.name,
      mentorId: selectedAlumni,
      mentorName: alumnus.name,
      domain: mentorshipRequest.domain,
      message: mentorshipRequest.message,
      status: 'pending',
    });

    setMentorshipRequest({ domain: '', message: '' });
    setIsMentorshipDialogOpen(false);
    setSelectedAlumni(null);
    toast.success('Mentorship request sent successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with alumni for mentorship and career guidance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alumni</p>
                <p className="text-2xl font-semibold mt-1">{alumni.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Users className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-semibold mt-1">
                  {new Set(alumni.map(a => a.currentOrganization)).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <Briefcase className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Mentors</p>
                <p className="text-2xl font-semibold mt-1">{alumni.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search alumni by name, company, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="px-4 py-2 rounded-md border bg-input-background"
          value={filterDomain}
          onChange={(e) => setFilterDomain(e.target.value)}
        >
          <option value="all">All Domains</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
            <h3 className="mb-2">No alumni found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((alumnus) => (
            <Card key={alumnus.id} className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: '#0F766E' }} />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#CDEDEA' }}
                  >
                    <span className="font-semibold" style={{ color: '#0F766E' }}>
                      {alumnus.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{alumnus.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Class of {alumnus.graduationYear}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm">{alumnus.currentRole}</p>
                  <p className="text-sm text-muted-foreground">{alumnus.currentOrganization}</p>
                </div>

                {alumnus.skills && alumnus.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2 text-muted-foreground">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {alumnus.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleRequestMentorship(alumnus.id, alumnus.name)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Request Mentorship
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Mentorship Request Dialog */}
      <Dialog open={isMentorshipDialogOpen} onOpenChange={setIsMentorshipDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a mentorship request to this alumni
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Area of Interest *</Label>
              <Input
                id="domain"
                placeholder="e.g., Software Development, Product Management"
                value={mentorshipRequest.domain}
                onChange={(e) => setMentorshipRequest({ ...mentorshipRequest, domain: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you'd like their mentorship..."
                value={mentorshipRequest.message}
                onChange={(e) => setMentorshipRequest({ ...mentorshipRequest, message: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsMentorshipDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
