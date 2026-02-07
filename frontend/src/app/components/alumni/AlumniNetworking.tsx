import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Mail,
  Linkedin,
  Github,
  Filter,
  MessageCircle,
  UserPlus
} from 'lucide-react';

export function AlumniNetworking() {
  const { alumni, currentUser, createConversation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');

  // Get unique batches from alumni
  const batches = Array.from(new Set(alumni.map(a => a.batch).filter(Boolean))).sort();
  
  // Get unique departments
  const departments = Array.from(new Set(alumni.map(a => a.department).filter(Boolean))).sort();
  
  // Get unique locations (cities)
  const locations = Array.from(
    new Set(alumni.map(a => a.location?.split(',')[0]?.trim()).filter(Boolean))
  ).sort();

  // Filter alumni based on selected filters and search
  const filteredAlumni = alumni.filter(alumnus => {
    // Don't show current user
    if (alumnus.id === currentUser?.id) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        alumnus.name.toLowerCase().includes(query) ||
        alumnus.currentRole?.toLowerCase().includes(query) ||
        alumnus.currentOrganization?.toLowerCase().includes(query) ||
        alumnus.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        alumnus.location?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Batch filter
    if (selectedBatch !== 'all' && alumnus.batch !== selectedBatch) {
      return false;
    }

    // Department filter
    if (selectedDepartment !== 'all' && alumnus.department !== selectedDepartment) {
      return false;
    }

    // Location filter
    if (selectedLocation !== 'all') {
      const alumLocation = alumnus.location?.split(',')[0]?.trim();
      if (alumLocation !== selectedLocation) return false;
    }

    // Tab filters
    if (selectedTab === 'batchmates' && alumnus.batch !== currentUser?.batch) {
      return false;
    }

    if (selectedTab === 'sameDept' && alumnus.department !== currentUser?.department) {
      return false;
    }

    if (selectedTab === 'sameLocation') {
      const currentLocation = currentUser?.location?.split(',')[0]?.trim();
      const alumLocation = alumnus.location?.split(',')[0]?.trim();
      if (alumLocation !== currentLocation) return false;
    }

    return true;
  });

  const handleConnect = (alumnus: any) => {
    createConversation(alumnus.id);
    alert(`Connection request sent to ${alumnus.name}! You can now message them.`);
  };

  const handleMessage = (alumnus: any) => {
    const conversationId = createConversation(alumnus.id);
    alert(`Opening chat with ${alumnus.name}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Alumni Network</h1>
        <p className="text-muted-foreground">
          Connect with fellow alumni, find batchmates, and expand your professional network
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
          <CardDescription>Find alumni by name, company, skills, batch, or location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, skills, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch} value={batch!}>
                      Batch {batch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept!}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedBatch !== 'all' || selectedDepartment !== 'all' || selectedLocation !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedBatch !== 'all' && (
                <Badge variant="secondary">
                  Batch {selectedBatch}
                  <button 
                    onClick={() => setSelectedBatch('all')}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedDepartment !== 'all' && (
                <Badge variant="secondary">
                  {selectedDepartment}
                  <button 
                    onClick={() => setSelectedDepartment('all')}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedLocation !== 'all' && (
                <Badge variant="secondary">
                  {selectedLocation}
                  <button 
                    onClick={() => setSelectedLocation('all')}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBatch('all');
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Filter Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Alumni</TabsTrigger>
          <TabsTrigger value="batchmates">My Batchmates</TabsTrigger>
          <TabsTrigger value="sameDept">Same Department</TabsTrigger>
          <TabsTrigger value="sameLocation">Same Location</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4 mt-6">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: '#0F766E' }} />
              <span className="font-medium">{filteredAlumni.length} Alumni Found</span>
            </div>
            {selectedTab === 'batchmates' && currentUser?.batch && (
              <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                Batch {currentUser.batch}
              </Badge>
            )}
          </div>

          {/* Alumni Cards Grid */}
          {filteredAlumni.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-2">No Alumni Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBatch('all');
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                    setSelectedTab('all');
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAlumni.map((alumnus) => (
                <Card key={alumnus.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={alumnus.avatar} 
                        alt={alumnus.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{alumnus.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {alumnus.currentRole}
                        </p>
                        <p className="text-sm font-medium" style={{ color: '#0F766E' }}>
                          {alumnus.currentOrganization}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>Batch {alumnus.batch || alumnus.graduationYear} • {alumnus.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{alumnus.location}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {alumnus.skills && alumnus.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {alumnus.skills.slice(0, 3).map((skill, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {alumnus.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{alumnus.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Gamification - Points & Badges */}
                    {alumnus.points && (
                      <div className="flex items-center gap-3 pt-2 border-t">
                        <div className="text-sm">
                          <span className="font-semibold" style={{ color: '#E07A2F' }}>
                            {alumnus.points}
                          </span>
                          <span className="text-muted-foreground"> points</span>
                        </div>
                        {alumnus.badges && alumnus.badges.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {alumnus.badges.length} badge{alumnus.badges.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        style={{ backgroundColor: '#0F766E' }}
                        onClick={() => handleConnect(alumnus)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleMessage(alumnus)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2 pt-2 border-t">
                      {alumnus.linkedin && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2"
                          onClick={() => window.open(`https://${alumnus.linkedin}`, '_blank')}
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {alumnus.github && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2"
                          onClick={() => window.open(`https://${alumnus.github}`, '_blank')}
                        >
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      {alumnus.email && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2"
                          onClick={() => window.location.href = `mailto:${alumnus.email}`}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
