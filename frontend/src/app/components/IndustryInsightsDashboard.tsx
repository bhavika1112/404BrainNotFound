import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  MapPin,
  BarChart3,
  PieChart,
  Target,
  Award,
  Building2,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

interface IndustryData {
  name: string;
  alumniCount: number;
  topCompanies: string[];
  topRoles: string[];
  avgYearsExperience: number;
  salaryRange: string;
  growthRate: string;
  topSkills: string[];
  locations: string[];
}

export function IndustryInsightsDashboard() {
  const { alumni, jobs } = useApp();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Tech');

  const getIndustry = (org: string = '') => {
    const orgLower = org.toLowerCase();
    if (orgLower.includes('google') || orgLower.includes('microsoft') || 
        orgLower.includes('amazon') || orgLower.includes('meta') || 
        orgLower.includes('facebook') || orgLower.includes('netflix')) return 'Tech';
    if (orgLower.includes('goldman') || orgLower.includes('morgan') || 
        orgLower.includes('capital') || orgLower.includes('bank')) return 'Finance';
    if (orgLower.includes('hospital') || orgLower.includes('health') || 
        orgLower.includes('medical')) return 'Healthcare';
    if (orgLower.includes('school') || orgLower.includes('university') || 
        orgLower.includes('education')) return 'Education';
    if (orgLower.includes('consulting') || orgLower.includes('accenture') || 
        orgLower.includes('mckinsey') || orgLower.includes('bain')) return 'Consulting';
    return 'Other';
  };

  const industries = ['Tech', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Other'];

  const getIndustryData = (industry: string): IndustryData => {
    const industryAlumni = alumni.filter(a => getIndustry(a.currentOrganization) === industry);
    
    const companies = industryAlumni.map(a => a.currentOrganization).filter(Boolean) as string[];
    const topCompanies = [...new Set(companies)].slice(0, 5);
    
    const roles = industryAlumni.map(a => a.currentRole).filter(Boolean) as string[];
    const roleCounts = roles.reduce((acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topRoles = Object.entries(roleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([role]) => role);
    
    const allSkills = industryAlumni.flatMap(a => a.skills || []);
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill]) => skill);
    
    const locations = industryAlumni.map(a => a.location).filter(Boolean) as string[];
    const topLocations = [...new Set(locations)].slice(0, 5);
    
    const currentYear = new Date().getFullYear();
    const avgYearsExperience = industryAlumni.reduce((sum, a) => {
      const gradYear = parseInt(a.graduationYear || '0');
      return sum + (gradYear > 0 ? currentYear - gradYear : 0);
    }, 0) / (industryAlumni.length || 1);

    const salaryRanges: Record<string, string> = {
      Tech: '$120K - $250K',
      Finance: '$130K - $280K',
      Healthcare: '$90K - $180K',
      Education: '$60K - $120K',
      Consulting: '$110K - $230K',
      Other: '$70K - $150K'
    };

    const growthRates: Record<string, string> = {
      Tech: '+18%',
      Finance: '+12%',
      Healthcare: '+15%',
      Education: '+8%',
      Consulting: '+14%',
      Other: '+10%'
    };

    return {
      name: industry,
      alumniCount: industryAlumni.length,
      topCompanies,
      topRoles,
      avgYearsExperience: Math.round(avgYearsExperience),
      salaryRange: salaryRanges[industry] || '$80K - $160K',
      growthRate: growthRates[industry] || '+10%',
      topSkills,
      locations: topLocations
    };
  };

  const industryData = getIndustryData(selectedIndustry);
  
  // Get all industries data for comparison
  const allIndustriesData = industries.map(ind => ({
    name: ind,
    count: alumni.filter(a => getIndustry(a.currentOrganization) === ind).length
  })).sort((a, b) => b.count - a.count);

  // Get trending jobs in selected industry
  const industryJobs = jobs.filter(job => getIndustry(job.company) === selectedIndustry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Industry Insights Dashboard</h1>
        <p className="text-muted-foreground">
          Explore industry trends, top companies, and career opportunities
        </p>
      </div>

      {/* Industry Selection */}
      <div className="flex flex-wrap gap-2">
        {industries.map(industry => {
          const count = alumni.filter(a => getIndustry(a.currentOrganization) === industry).length;
          return (
            <Button
              key={industry}
              variant={selectedIndustry === industry ? 'default' : 'outline'}
              onClick={() => setSelectedIndustry(industry)}
              className="gap-2"
              style={selectedIndustry === industry ? { backgroundColor: '#0F766E' } : {}}
            >
              {industry}
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alumni</p>
                <p className="text-2xl font-semibold mt-1">{industryData.alumniCount}</p>
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
                <p className="text-sm text-muted-foreground">Avg. Experience</p>
                <p className="text-2xl font-semibold mt-1">{industryData.avgYearsExperience} yrs</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <Award className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <p className="text-xl font-semibold mt-1">{industryData.salaryRange}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-semibold mt-1 flex items-center gap-1" style={{ color: '#0F766E' }}>
                  {industryData.growthRate}
                  <ArrowUpRight className="w-5 h-5" />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#0D5C57' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Top Companies
            </CardTitle>
            <CardDescription>Leading employers in {selectedIndustry}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {industryData.topCompanies.length > 0 ? (
              industryData.topCompanies.map((company, index) => {
                const companyAlumni = alumni.filter(a => a.currentOrganization === company);
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                        <span className="font-semibold text-sm" style={{ color: '#0F766E' }}>
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{company}</p>
                        <p className="text-xs text-muted-foreground">
                          {companyAlumni.length} alumni
                        </p>
                      </div>
                    </div>
                    <Badge style={{ backgroundColor: '#FFD6B8', color: '#C75B12' }}>
                      {((companyAlumni.length / industryData.alumniCount) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Top Roles
            </CardTitle>
            <CardDescription>Most common positions in {selectedIndustry}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {industryData.topRoles.length > 0 ? (
              industryData.topRoles.map((role, index) => {
                const roleAlumni = alumni.filter(a => a.currentRole === role && getIndustry(a.currentOrganization) === selectedIndustry);
                const percentage = (roleAlumni.length / industryData.alumniCount) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{role}</p>
                      <span className="text-sm text-muted-foreground">
                        {roleAlumni.length} alumni
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#FAEBDD]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: '#0F766E'
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              In-Demand Skills
            </CardTitle>
            <CardDescription>Most sought-after skills in {selectedIndustry}</CardDescription>
          </CardHeader>
          <CardContent>
            {industryData.topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {industryData.topSkills.map((skill, index) => {
                  const skillCount = alumni.filter(a => 
                    getIndustry(a.currentOrganization) === selectedIndustry && 
                    a.skills?.includes(skill)
                  ).length;
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-2 text-sm"
                      style={{
                        backgroundColor: index < 3 ? '#CDEDEA' : '#FFF1E4',
                        color: index < 3 ? '#0F766E' : '#C75B12',
                        borderColor: index < 3 ? '#0F766E' : '#E07A2F'
                      }}
                    >
                      {skill}
                      <span className="ml-2 text-xs opacity-70">({skillCount})</span>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top Locations
            </CardTitle>
            <CardDescription>Where {selectedIndustry} alumni work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {industryData.locations.length > 0 ? (
              industryData.locations.map((location, index) => {
                const locationAlumni = alumni.filter(a => 
                  a.location === location && getIndustry(a.currentOrganization) === selectedIndustry
                );
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" style={{ color: '#E07A2F' }} />
                      <p className="font-medium text-sm">{location}</p>
                    </div>
                    <Badge variant="secondary">
                      {locationAlumni.length} alumni
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No location data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Industry Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Alumni Distribution Across Industries
          </CardTitle>
          <CardDescription>Compare alumni presence across different sectors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allIndustriesData.map((industry, index) => {
              const percentage = (industry.count / alumni.length) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{industry.name}</span>
                      <Badge variant="outline">{industry.count} alumni</Badge>
                    </div>
                    <span className="font-semibold" style={{ color: '#0F766E' }}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[#FAEBDD]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: index === 0 ? '#0F766E' : index === 1 ? '#1F8A7A' : '#E07A2F'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Opportunities */}
      {industryJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Current Opportunities in {selectedIndustry}
            </CardTitle>
            <CardDescription>Latest job postings from alumni</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {industryJobs.slice(0, 4).map(job => (
                <div key={job.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold">{job.title}</h4>
                    <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                      {job.type}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm" style={{ color: '#0F766E' }}>
                    {job.company}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      Posted by {job.postedBy}
                    </span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
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
