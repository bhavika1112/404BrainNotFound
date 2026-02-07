import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Rocket,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Link as LinkIcon,
  Plus,
  Search,
  Building2,
  Target,
  X,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Startup {
  id: string;
  name: string;
  founderName: string;
  founderId: string;
  description: string;
  industry: string;
  stage: 'Idea' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'IPO';
  fundingRaised: string;
  teamSize: number;
  founded: string;
  location: string;
  website?: string;
  lookingFor: string[];
  achievements: string[];
  technologies: string[];
}

export function AlumniStartupShowcase() {
  const { currentUser, alumni } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStartup, setNewStartup] = useState<Partial<Startup>>({
    lookingFor: [],
    achievements: [],
    technologies: []
  });

  // Mock startups data
  const [startups, setStartups] = useState<Startup[]>([
    {
      id: 's1',
      name: 'TechVenture AI',
      founderName: 'Sarah Johnson',
      founderId: 'a1',
      description: 'AI-powered platform for automating customer service using advanced NLP and machine learning',
      industry: 'AI/ML',
      stage: 'Series A',
      fundingRaised: '$5M',
      teamSize: 25,
      founded: '2023',
      location: 'San Francisco, CA',
      website: 'techventure.ai',
      lookingFor: ['Engineers', 'Product Manager', 'Investors'],
      achievements: [
        '10,000+ active users',
        'Featured in TechCrunch',
        'AWS Partner',
        'Y Combinator W23'
      ],
      technologies: ['Python', 'TensorFlow', 'React', 'AWS', 'Docker']
    },
    {
      id: 's2',
      name: 'HealthConnect',
      founderName: 'Emily Rodriguez',
      founderId: 'a3',
      description: 'Connecting patients with healthcare providers through intelligent matching and telemedicine',
      industry: 'HealthTech',
      stage: 'Seed',
      fundingRaised: '$2M',
      teamSize: 12,
      founded: '2024',
      location: 'Boston, MA',
      website: 'healthconnect.com',
      lookingFor: ['Healthcare Professionals', 'iOS Developer', 'Marketing Lead'],
      achievements: [
        '5,000+ patient-doctor connections',
        'Partnership with 3 major hospitals',
        'HIPAA Compliant'
      ],
      technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS']
    },
    {
      id: 's3',
      name: 'EduLearn Pro',
      founderName: 'Michael Chen',
      founderId: 'a2',
      description: 'Adaptive learning platform using AI to personalize education for K-12 students',
      industry: 'EdTech',
      stage: 'Series B',
      fundingRaised: '$15M',
      teamSize: 45,
      founded: '2022',
      location: 'Seattle, WA',
      website: 'edulearnpro.com',
      lookingFor: ['Content Creators', 'ML Engineers', 'Sales Team'],
      achievements: [
        '100,000+ students',
        'Used in 500+ schools',
        'Improved test scores by 35%',
        'Top 10 EdTech Startup 2025'
      ],
      technologies: ['Python', 'React', 'MongoDB', 'TensorFlow', 'Kubernetes']
    }
  ]);

  const industries = ['AI/ML', 'HealthTech', 'EdTech', 'FinTech', 'E-commerce', 'SaaS', 'CleanTech', 'Other'];
  const stages: Startup['stage'][] = ['Idea', 'Seed', 'Series A', 'Series B', 'Series C+', 'IPO'];

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         startup.founderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || startup.industry === filterIndustry;
    const matchesStage = filterStage === 'all' || startup.stage === filterStage;
    return matchesSearch && matchesIndustry && matchesStage;
  });

  const handleAddStartup = () => {
    if (!newStartup.name || !newStartup.description || !newStartup.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    const startup: Startup = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStartup.name,
      founderName: currentUser?.name || 'Unknown',
      founderId: currentUser?.id || '',
      description: newStartup.description,
      industry: newStartup.industry,
      stage: newStartup.stage || 'Idea',
      fundingRaised: newStartup.fundingRaised || '$0',
      teamSize: newStartup.teamSize || 1,
      founded: newStartup.founded || new Date().getFullYear().toString(),
      location: newStartup.location || currentUser?.location || '',
      website: newStartup.website,
      lookingFor: newStartup.lookingFor || [],
      achievements: newStartup.achievements || [],
      technologies: newStartup.technologies || []
    };

    setStartups([startup, ...startups]);
    setShowAddDialog(false);
    setNewStartup({ lookingFor: [], achievements: [], technologies: [] });
    toast.success('Startup added successfully!');
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Idea':
        return { bg: '#FFF1C1', color: '#8B8B8B' };
      case 'Seed':
        return { bg: '#FFD6B8', color: '#C75B12' };
      case 'Series A':
        return { bg: '#CDEDEA', color: '#0F766E' };
      case 'Series B':
      case 'Series C+':
        return { bg: '#CDEDEA', color: '#0D5C57' };
      case 'IPO':
        return { bg: '#CDEDEA', color: '#0F766E' };
      default:
        return { bg: '#FAEBDD', color: '#8B8B8B' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Alumni Startup Showcase</h1>
          <p className="text-muted-foreground">
            Discover and support startups founded by our alumni community
          </p>
        </div>
        {currentUser?.role === 'alumni' && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="gap-2"
            style={{ backgroundColor: '#0F766E' }}
          >
            <Plus className="w-4 h-4" />
            Add Your Startup
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Startups</p>
                <p className="text-2xl font-semibold mt-1">{startups.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Rocket className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-semibold mt-1">$22M+</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-semibold mt-1">
                  {startups.reduce((sum, s) => sum + s.teamSize, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Users className="w-6 h-6" style={{ color: '#C75B12' }} />
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
                  {new Set(startups.map(s => s.industry)).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Building2 className="w-6 h-6" style={{ color: '#0D5C57' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search startups by name, founder, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="px-4 py-2 rounded-md border bg-input-background"
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
        >
          <option value="all">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 rounded-md border bg-input-background"
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
        >
          <option value="all">All Stages</option>
          {stages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>

      {/* Startups Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredStartups.length === 0 ? (
          <div className="col-span-2">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Rocket className="w-16 h-16 mb-4 opacity-30" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No startups found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredStartups.map(startup => {
            const stageColors = getStageColor(startup.stage);
            const founder = alumni.find(a => a.id === startup.founderId);
            
            return (
              <Card key={startup.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-2" style={{ backgroundColor: stageColors.color }} />
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{startup.name}</CardTitle>
                        <Badge style={{ backgroundColor: stageColors.bg, color: stageColors.color }}>
                          {startup.stage}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Founded by {startup.founderName}
                      </CardDescription>
                    </div>
                    {founder?.avatar && (
                      <img
                        src={founder.avatar}
                        alt={startup.founderName}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{startup.description}</p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-lg" style={{ backgroundColor: '#FFF1E4' }}>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Funding</p>
                      <p className="font-semibold text-sm" style={{ color: '#0F766E' }}>
                        {startup.fundingRaised}
                      </p>
                    </div>
                    <div className="text-center border-x">
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="font-semibold text-sm" style={{ color: '#0F766E' }}>
                        {startup.teamSize}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="font-semibold text-sm" style={{ color: '#0F766E' }}>
                        {startup.founded}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{startup.industry}</Badge>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {startup.location}
                      </span>
                    </div>
                    {startup.website && (
                      <a
                        href={`https://${startup.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline"
                        style={{ color: '#0F766E' }}
                      >
                        <LinkIcon className="w-3 h-3" />
                        {startup.website}
                      </a>
                    )}
                  </div>

                  {/* Technologies */}
                  {startup.technologies.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2">Tech Stack</p>
                      <div className="flex flex-wrap gap-1">
                        {startup.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Looking For */}
                  {startup.lookingFor.length > 0 && (
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: '#CDEDEA', borderColor: '#0F766E' }}>
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: '#0F766E' }}>
                        <Target className="w-3 h-3" />
                        Currently Hiring
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {startup.lookingFor.map((role, idx) => (
                          <Badge key={idx} style={{ backgroundColor: '#ffffff', color: '#0F766E' }} className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {startup.achievements.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Key Achievements
                      </p>
                      <ul className="space-y-1">
                        {startup.achievements.slice(0, 3).map((achievement, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#0F766E' }} />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" style={{ backgroundColor: '#0F766E' }}>
                      Learn More
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Startup Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Add Your Startup</CardTitle>
                  <CardDescription>Share your venture with the alumni community</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startupName">Startup Name *</Label>
                  <Input
                    id="startupName"
                    placeholder="e.g., TechVenture AI"
                    value={newStartup.name || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <select
                    id="industry"
                    className="w-full px-4 py-2 rounded-md border bg-input-background"
                    value={newStartup.industry || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })}
                  >
                    <option value="">Select industry...</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] p-3 border rounded-md"
                  placeholder="Describe what your startup does..."
                  value={newStartup.description || ''}
                  onChange={(e) => setNewStartup({ ...newStartup, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <select
                    id="stage"
                    className="w-full px-4 py-2 rounded-md border bg-input-background"
                    value={newStartup.stage || 'Idea'}
                    onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value as Startup['stage'] })}
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding">Funding Raised</Label>
                  <Input
                    id="funding"
                    placeholder="e.g., $2M"
                    value={newStartup.fundingRaised || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, fundingRaised: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    placeholder="e.g., 10"
                    value={newStartup.teamSize || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, teamSize: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year</Label>
                  <Input
                    id="founded"
                    placeholder="e.g., 2024"
                    value={newStartup.founded || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, founded: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="e.g., mystartup.com"
                    value={newStartup.website || ''}
                    onChange={(e) => setNewStartup({ ...newStartup, website: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleAddStartup}
                className="w-full gap-2"
                style={{ backgroundColor: '#0F766E' }}
              >
                <CheckCircle className="w-4 h-4" />
                Add Startup
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
