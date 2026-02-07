import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Users, 
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Building2,
  Calendar,
  Award,
  TrendingUp,
  Download,
  MessageCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function AlumniDirectory() {
  const { alumni, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    batch: 'all',
    company: 'all',
    field: 'all',
    location: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique filter options
  const batches = [...new Set(alumni.map(a => a.graduationYear || a.batch).filter(Boolean))].sort().reverse();
  const companies = [...new Set(alumni.map(a => a.currentOrganization || a.company).filter(Boolean))].sort();
  const fields = [...new Set(alumni.map(a => a.department || a.field).filter(Boolean))].sort();
  const locations = [...new Set(alumni.map(a => a.location).filter(Boolean))].sort();

  // Filter alumni
  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = !searchQuery || 
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.currentRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch = filters.batch === 'all' || 
      alum.graduationYear === filters.batch || 
      alum.batch === filters.batch;

    const matchesCompany = filters.company === 'all' || 
      alum.currentOrganization === filters.company || 
      alum.company === filters.company;

    const matchesField = filters.field === 'all' || 
      alum.department === filters.field || 
      alum.field === filters.field;

    const matchesLocation = filters.location === 'all' || 
      alum.location === filters.location;

    return matchesSearch && matchesBatch && matchesCompany && matchesField && matchesLocation;
  });

  const clearFilters = () => {
    setFilters({
      batch: 'all',
      company: 'all',
      field: 'all',
      location: 'all'
    });
    setSearchQuery('');
  };

  const exportDirectory = () => {
    const csv = [
      ['Name', 'Email', 'Company', 'Role', 'Batch', 'Location', 'LinkedIn'].join(','),
      ...filteredAlumni.map(a => [
        a.name,
        a.email || '',
        a.currentOrganization || a.company || '',
        a.currentRole || '',
        a.graduationYear || a.batch || '',
        a.location || '',
        a.linkedin || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni_directory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
              <Users className="w-5 h-5" style={{ color: '#0F766E' }} />
            </div>
            <div>
              <h1>Alumni Directory</h1>
              <p className="text-muted-foreground">
                Discover and connect with {alumni.length} alumni
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={exportDirectory}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alumni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{alumni.length}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{companies.length}</div>
            <p className="text-xs text-muted-foreground">Organizations represented</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">Graduation years</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{filteredAlumni.length}</div>
            <p className="text-xs text-muted-foreground">Matching criteria</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Batch Year</label>
              <Select
                value={filters.batch}
                onValueChange={(value) => setFilters({ ...filters, batch: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Select
                value={filters.company}
                onValueChange={(value) => setFilters({ ...filters, company: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Field/Department</label>
              <Select
                value={filters.field}
                onValueChange={(value) => setFilters({ ...filters, field: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
            >
              Clear Filters
            </Button>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alumni Grid/List */}
      {filteredAlumni.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="font-semibold mb-2">No alumni found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map(alum => (
            <Card key={alum.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={alum.avatar} />
                    <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                      {getInitials(alum.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{alum.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {alum.currentRole}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      Batch {alum.graduationYear || alum.batch}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  {alum.currentOrganization && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{alum.currentOrganization || alum.company}</span>
                    </div>
                  )}
                  {alum.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{alum.location}</span>
                    </div>
                  )}
                  {alum.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span className="truncate">{alum.department || alum.field}</span>
                    </div>
                  )}
                </div>

                {alum.skills && alum.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {alum.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {alum.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{alum.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  {alum.linkedin && (
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  )}
                  {alum.email && (
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    className="flex-1 gap-2"
                    style={{ backgroundColor: '#0F766E' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredAlumni.map(alum => (
                <div key={alum.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={alum.avatar} />
                      <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                        {getInitials(alum.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{alum.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {alum.graduationYear || alum.batch}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alum.currentRole} at {alum.currentOrganization || alum.company}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        {alum.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alum.location}
                          </span>
                        )}
                        {alum.department && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {alum.department || alum.field}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alum.linkedin && (
                        <Button variant="outline" size="sm">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {alum.email && (
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        style={{ backgroundColor: '#0F766E' }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
