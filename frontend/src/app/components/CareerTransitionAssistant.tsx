import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Rocket,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Award,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CareerRecommendation {
  type: 'mentor' | 'skill' | 'job' | 'event' | 'connection';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
}

export function CareerTransitionAssistant() {
  const { currentUser, updateUser, alumni, jobs, events } = useApp();
  const { addNotification } = useNotifications();
  const [targetIndustry, setTargetIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);

  useEffect(() => {
    if (currentUser) {
      setCurrentSkills(currentUser.skills || []);
    }
  }, [currentUser]);

  const industries = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'Finance',
    'Consulting',
    'Marketing',
    'Sales',
    'Design',
    'Healthcare',
    'Education'
  ];

  const skillSuggestions: Record<string, string[]> = {
    'Software Engineering': ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
    'Data Science': ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics', 'Big Data', 'R'],
    'Product Management': ['Product Strategy', 'Agile', 'UX Design', 'Data Analysis', 'Leadership', 'Roadmapping'],
    'Finance': ['Financial Modeling', 'Excel', 'Bloomberg', 'Risk Analysis', 'Accounting', 'Trading'],
    'Consulting': ['Strategy', 'Problem Solving', 'PowerPoint', 'Client Management', 'Business Analysis'],
    'Marketing': ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Branding'],
    'Sales': ['CRM', 'Negotiation', 'Lead Generation', 'Salesforce', 'Communication', 'Closing'],
    'Design': ['Figma', 'Adobe Creative Suite', 'UI/UX', 'Prototyping', 'User Research', 'Design Systems'],
    'Healthcare': ['Patient Care', 'Medical Knowledge', 'EMR Systems', 'Healthcare Compliance', 'Diagnosis'],
    'Education': ['Curriculum Design', 'Teaching', 'Educational Technology', 'Assessment', 'Classroom Management']
  };

  const generateRecommendations = () => {
    if (!targetIndustry || !targetRole) {
      toast.error('Please select both target industry and role');
      return;
    }

    const recommendations: CareerRecommendation[] = [];

    // Find mentors in target industry
    const potentialMentors = alumni.filter(a => {
      const roleMatch = a.currentRole?.toLowerCase().includes(targetRole.toLowerCase());
      return roleMatch && a.id !== currentUser?.id;
    });

    if (potentialMentors.length > 0) {
      recommendations.push({
        type: 'mentor',
        title: `Connect with ${potentialMentors.length} ${targetIndustry} experts`,
        description: `${potentialMentors.slice(0, 3).map(m => m.name).join(', ')} and others can guide your transition`,
        priority: 'high',
        actionLabel: 'View Mentors'
      });
    }

    // Suggest skills to learn
    const requiredSkills = skillSuggestions[targetIndustry] || [];
    const missingSkills = requiredSkills.filter(skill => !currentSkills.includes(skill));
    
    if (missingSkills.length > 0) {
      recommendations.push({
        type: 'skill',
        title: `Learn ${missingSkills.length} essential skills for ${targetIndustry}`,
        description: `Focus on: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? ' and more' : ''}`,
        priority: 'high',
        actionLabel: 'View Skills'
      });
    }

    // Find relevant jobs
    const relevantJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(targetRole.toLowerCase()) ||
      job.description.toLowerCase().includes(targetIndustry.toLowerCase())
    );

    if (relevantJobs.length > 0) {
      recommendations.push({
        type: 'job',
        title: `${relevantJobs.length} ${targetRole} positions available`,
        description: `Opportunities at ${relevantJobs.slice(0, 2).map(j => j.company).join(', ')}`,
        priority: 'high',
        actionLabel: 'View Jobs'
      });
    }

    // Find relevant events
    const relevantEvents = events.filter(e => 
      e.title.toLowerCase().includes(targetIndustry.toLowerCase()) ||
      e.description.toLowerCase().includes(targetRole.toLowerCase()) ||
      e.type === 'Workshop' || e.type === 'Webinar'
    );

    if (relevantEvents.length > 0) {
      recommendations.push({
        type: 'event',
        title: `Attend ${relevantEvents.length} relevant events`,
        description: `Including "${relevantEvents[0].title}" and more`,
        priority: 'medium',
        actionLabel: 'View Events'
      });
    }

    // Suggest networking
    const industryAlumni = alumni.filter(a => {
      const inTargetIndustry = a.currentRole?.toLowerCase().includes(targetRole.toLowerCase()) ||
                               a.currentOrganization?.toLowerCase().includes(targetIndustry.toLowerCase());
      return inTargetIndustry && a.id !== currentUser?.id;
    });

    if (industryAlumni.length > 0) {
      recommendations.push({
        type: 'connection',
        title: `Network with ${industryAlumni.length} professionals`,
        description: `Build connections in ${targetIndustry} to accelerate your transition`,
        priority: 'medium',
        actionLabel: 'Start Networking'
      });
    }

    // Add general recommendation
    recommendations.push({
      type: 'skill',
      title: 'Build a transition portfolio',
      description: 'Create projects showcasing your new skills to potential employers',
      priority: 'medium',
      actionLabel: 'Get Started'
    });

    setRecommendations(recommendations);
    setShowRecommendations(true);

    // Send notification about new recommendations
    addNotification({
      type: 'system',
      title: 'Career Transition Plan Ready',
      message: `Generated ${recommendations.length} personalized recommendations for transitioning to ${targetIndustry}`,
      priority: 'high'
    });

    toast.success(`Generated ${recommendations.length} recommendations for your career transition!`);
  };

  const updateCareerGoal = () => {
    if (currentUser && targetIndustry && targetRole) {
      // In a real app, this would update the user's career goals in the backend
      toast.success('Career transition goal saved!');
      
      addNotification({
        type: 'system',
        title: 'Career Goal Updated',
        message: `Your transition to ${targetRole} in ${targetIndustry} has been saved`,
        priority: 'medium'
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mentor':
        return <Users className="w-5 h-5" />;
      case 'skill':
        return <BookOpen className="w-5 h-5" />;
      case 'job':
        return <Briefcase className="w-5 h-5" />;
      case 'event':
        return <GraduationCap className="w-5 h-5" />;
      case 'connection':
        return <Star className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: '#CDEDEA', color: '#0F766E' };
      case 'medium':
        return { bg: '#FFD6B8', color: '#C75B12' };
      default:
        return { bg: '#FFF1C1', color: '#8B8B8B' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Career Transition Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized recommendations when switching to a new career field
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Mentors</p>
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
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-2xl font-semibold mt-1">{jobs.filter(j => j.status === 'open').length}</p>
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
                <p className="text-sm text-muted-foreground">Learning Events</p>
                <p className="text-2xl font-semibold mt-1">{events.filter(e => e.type === 'Workshop' || e.type === 'Webinar').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Industries</p>
                <p className="text-2xl font-semibold mt-1">{industries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <Target className="w-6 h-6" style={{ color: '#0D5C57' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Transition Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Set Your Career Transition Goal
          </CardTitle>
          <CardDescription>
            Tell us where you want to go, and we'll create a personalized roadmap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetIndustry">Target Industry/Field *</Label>
              <select
                id="targetIndustry"
                className="w-full px-4 py-2 rounded-md border bg-input-background"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
              >
                <option value="">Select an industry...</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role/Position *</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Senior Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>

          {currentUser && (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFF1E4' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#E07A2F] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Current Profile</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.currentRole} at {currentUser.currentOrganization || 'N/A'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(currentUser.skills || []).slice(0, 5).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={generateRecommendations}
              disabled={!targetIndustry || !targetRole}
              className="flex-1 gap-2"
              style={{ backgroundColor: '#0F766E' }}
            >
              <Lightbulb className="w-4 h-4" />
              Generate Transition Plan
            </Button>
            <Button
              variant="outline"
              onClick={updateCareerGoal}
              disabled={!targetIndustry || !targetRole}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Personalized Transition Roadmap
            </CardTitle>
            <CardDescription>
              Follow these recommendations to successfully transition to {targetIndustry}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => {
              const colors = getPriorityColor(rec.priority);
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: '4px', borderLeftColor: colors.color }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: colors.bg, color: colors.color }}
                    >
                      {getIcon(rec.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge
                          variant="outline"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.color,
                            borderColor: colors.color
                          }}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rec.description}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        style={{ borderColor: colors.color, color: colors.color }}
                      >
                        {rec.actionLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Skill Gap Analysis */}
      {targetIndustry && skillSuggestions[targetIndustry] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Skill Gap Analysis
            </CardTitle>
            <CardDescription>
              Skills needed for {targetIndustry}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#0F766E' }} />
                  Skills You Have ({currentSkills.filter(s => skillSuggestions[targetIndustry].includes(s)).length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.filter(s => skillSuggestions[targetIndustry].includes(s)).map((skill, idx) => (
                    <Badge key={idx} style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: '#E07A2F' }} />
                  Skills to Learn ({skillSuggestions[targetIndustry].filter(s => !currentSkills.includes(s)).length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions[targetIndustry].filter(s => !currentSkills.includes(s)).map((skill, idx) => (
                    <Badge key={idx} variant="outline" style={{ borderColor: '#E07A2F', color: '#C75B12' }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFF1E4' }}>
                <p className="text-sm">
                  <strong>Completion Rate:</strong> You have{' '}
                  {Math.round((currentSkills.filter(s => skillSuggestions[targetIndustry].includes(s)).length / skillSuggestions[targetIndustry].length) * 100)}%
                  {' '}of the recommended skills for {targetIndustry}
                </p>
                <div className="mt-2 h-2 rounded-full bg-[#FAEBDD]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(currentSkills.filter(s => skillSuggestions[targetIndustry].includes(s)).length / skillSuggestions[targetIndustry].length) * 100}%`,
                      backgroundColor: '#0F766E'
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Success Stories
          </CardTitle>
          <CardDescription>
            Alumni who successfully made similar transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {alumni.slice(0, 2).map(alumnus => (
              <div key={alumnus.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  {alumnus.avatar && (
                    <img
                      src={alumnus.avatar}
                      alt={alumnus.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{alumnus.name}</h4>
                    <p className="text-sm font-medium" style={{ color: '#0F766E' }}>
                      {alumnus.currentRole}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alumnus.currentOrganization}
                    </p>
                    {alumnus.experience && alumnus.experience.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Transitioned from {alumnus.experience[0].title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
