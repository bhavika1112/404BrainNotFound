import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  TrendingUp,
  Building2,
  GraduationCap,
  Award,
  Target,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface CareerNode {
  title: string;
  company: string;
  duration: string;
  skills: string[];
  year: string;
}

export function CareerPathVisualization() {
  const { alumni } = useApp();
  const [selectedAlumni, setSelectedAlumni] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  const industries = ['Tech', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Startup'];

  // Get industries from alumni organizations
  const getIndustry = (org: string = '') => {
    if (org.includes('Google') || org.includes('Microsoft') || org.includes('Amazon') || org.includes('Meta')) return 'Tech';
    if (org.includes('Goldman') || org.includes('Morgan') || org.includes('Capital')) return 'Finance';
    if (org.includes('Hospital') || org.includes('Health')) return 'Healthcare';
    if (org.includes('School') || org.includes('University')) return 'Education';
    if (org.includes('Consulting') || org.includes('Accenture')) return 'Consulting';
    return 'Other';
  };

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.currentOrganization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.currentRole?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || getIndustry(a.currentOrganization) === industryFilter;
    return matchesSearch && matchesIndustry && (a.experience && a.experience.length > 0);
  });

  const selectedAlumniData = alumni.find(a => a.id === selectedAlumni);

  const getCareerProgression = (experience: any[]) => {
    if (!experience || experience.length === 0) return [];
    
    return experience.reverse().map((exp, index) => ({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      skills: [],
      year: exp.duration.split(' - ')[0],
      isLast: index === experience.length - 1
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Career Path Visualization</h1>
        <p className="text-muted-foreground">
          Explore career trajectories of successful alumni to plan your own path
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paths</p>
                <p className="text-2xl font-semibold mt-1">
                  {alumni.filter(a => a.experience && a.experience.length > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Transitions</p>
                <p className="text-2xl font-semibold mt-1">
                  {(alumni.reduce((sum, a) => sum + (a.experience?.length || 0), 0) / alumni.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <ArrowRight className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Industries</p>
                <p className="text-2xl font-semibold mt-1">
                  {new Set(alumni.map(a => getIndustry(a.currentOrganization))).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Building2 className="w-6 h-6" style={{ color: '#C75B12' }} />
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
                  {new Set(alumni.flatMap(a => a.experience?.map(e => e.company) || [])).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Briefcase className="w-6 h-6" style={{ color: '#0D5C57' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
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
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
        >
          <option value="all">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      {/* Career Path Display */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alumni List */}
        <Card>
          <CardHeader>
            <CardTitle>Alumni Career Paths</CardTitle>
            <CardDescription>Select an alumni to view their career journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredAlumni.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No career paths found</p>
              </div>
            ) : (
              filteredAlumni.map(alumnus => (
                <div
                  key={alumnus.id}
                  onClick={() => setSelectedAlumni(alumnus.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedAlumni === alumnus.id
                      ? 'border-[#0F766E] bg-[#CDEDEA] bg-opacity-30'
                      : 'hover:border-[#0F766E]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alumnus.avatar && (
                      <img
                        src={alumnus.avatar}
                        alt={alumnus.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{alumnus.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alumnus.graduationYear}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#0F766E' }}>
                        {alumnus.currentRole}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {alumnus.currentOrganization}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge style={{ backgroundColor: '#FFD6B8', color: '#C75B12' }} className="text-xs">
                          {getIndustry(alumnus.currentOrganization)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alumnus.experience?.length || 0} transitions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Career Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Career Timeline</CardTitle>
            <CardDescription>
              {selectedAlumniData ? `${selectedAlumniData.name}'s career journey` : 'Select an alumni to view timeline'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAlumniData ? (
              <div className="space-y-6">
                {/* Current Position */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#CDEDEA' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0F766E' }}>
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{selectedAlumniData.currentRole}</h4>
                        <Badge style={{ backgroundColor: '#0F766E', color: '#ffffff' }}>Current</Badge>
                      </div>
                      <p className="font-medium text-sm">{selectedAlumniData.currentOrganization}</p>
                      {selectedAlumniData.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {selectedAlumniData.location}
                        </p>
                      )}
                      {selectedAlumniData.skills && selectedAlumniData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedAlumniData.skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Career Progression */}
                {selectedAlumniData.experience && selectedAlumniData.experience.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Career Progression
                    </h4>
                    <div className="relative space-y-4 pl-6 border-l-2 border-[#FAEBDD]">
                      {getCareerProgression(selectedAlumniData.experience).map((node, index) => (
                        <div key={index} className="relative">
                          {/* Timeline Dot */}
                          <div
                            className="absolute -left-[27px] w-4 h-4 rounded-full border-2 border-[#0F766E]"
                            style={{ backgroundColor: node.isLast ? '#0F766E' : '#ffffff' }}
                          />
                          
                          {/* Content */}
                          <div className="p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h5 className="font-semibold text-sm">{node.title}</h5>
                              <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="w-3 h-3" />
                                {node.duration}
                              </span>
                            </div>
                            <p className="text-sm flex items-center gap-1" style={{ color: '#0F766E' }}>
                              <Building2 className="w-3 h-3" />
                              {node.company}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedAlumniData.education && selectedAlumniData.education.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h4>
                    {selectedAlumniData.education.map((edu, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-white">
                        <p className="font-semibold text-sm">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{edu.year}</Badge>
                          {edu.field && (
                            <span className="text-xs text-muted-foreground">{edu.field}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {selectedAlumniData.achievements && selectedAlumniData.achievements.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {selectedAlumniData.achievements.slice(0, 3).map((achievement, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E07A2F' }} />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <TrendingUp className="w-16 h-16 mb-4 opacity-30" />
                <p>Select an alumni from the list to view their career path</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
