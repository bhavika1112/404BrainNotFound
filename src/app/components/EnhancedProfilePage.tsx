import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Briefcase, 
  GraduationCap, 
  Calendar,
  Edit,
  Award,
  Heart,
  Globe,
  Linkedin,
  Github,
  Twitter,
  ExternalLink,
  Star,
  Languages,
  BookOpen
} from 'lucide-react';

export function EnhancedProfilePage() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and view your complete profile
        </p>
      </div>

      {/* Header Card with Cover and Avatar */}
      <Card className="overflow-hidden">
        <div 
          className="h-32 md:h-48"
          style={{ 
            background: currentUser.role === 'alumni' 
              ? 'linear-gradient(135deg, #0F766E 0%, #1F8A7A 100%)'
              : currentUser.role === 'student'
              ? 'linear-gradient(135deg, #E07A2F 0%, #D66A1F 100%)'
              : 'linear-gradient(135deg, #1F2933 0%, #2A2A2A 100%)'
          }}
        />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20">
            <div className="relative">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-white"
                />
              ) : (
                <div 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: '#CDEDEA' }}
                >
                  <span className="text-4xl md:text-5xl font-semibold" style={{ color: '#0F766E' }}>
                    {getInitials(currentUser.name)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="mb-1">{currentUser.name}</h2>
                  <p className="text-muted-foreground mb-2">
                    {currentUser.role === 'alumni' ? currentUser.currentRole : currentUser.department}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                      {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
                    </Badge>
                    {currentUser.role === 'alumni' && currentUser.currentOrganization && (
                      <Badge variant="secondary">{currentUser.currentOrganization}</Badge>
                    )}
                    {currentUser.role === 'student' && currentUser.batch && (
                      <Badge variant="secondary">Batch {currentUser.batch}</Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5" style={{ color: '#0F766E' }} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm break-all">{currentUser.email}</p>
                </div>
              </div>
              
              {currentUser.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5" style={{ color: '#0F766E' }} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm">{currentUser.phone}</p>
                  </div>
                </div>
              )}
              
              {currentUser.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5" style={{ color: '#0F766E' }} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-sm">{currentUser.location}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          {(currentUser.linkedin || currentUser.github || currentUser.twitter || currentUser.website) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentUser.linkedin && (
                  <a 
                    href={`https://${currentUser.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:underline"
                    style={{ color: '#0F766E' }}
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                
                {currentUser.github && (
                  <a 
                    href={`https://${currentUser.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:underline"
                    style={{ color: '#0F766E' }}
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                
                {currentUser.twitter && (
                  <a 
                    href={`https://${currentUser.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:underline"
                    style={{ color: '#0F766E' }}
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
                
                {currentUser.website && (
                  <a 
                    href={`https://${currentUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:underline"
                    style={{ color: '#0F766E' }}
                  >
                    <Globe className="w-5 h-5" />
                    <span>Website</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Languages */}
          {currentUser.languages && currentUser.languages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser.languages.map((language, index) => (
                    <Badge key={index} variant="secondary">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* About/Bio */}
          {currentUser.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{currentUser.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {currentUser.skills && currentUser.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience (Alumni only) */}
          {currentUser.role === 'alumni' && currentUser.experience && currentUser.experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.experience.map((exp, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex gap-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#FFD6B8' }}
                        >
                          <Briefcase className="w-5 h-5" style={{ color: '#E07A2F' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p style={{ color: '#8B8B8B' }}>{exp.company}</p>
                          <p className="text-sm" style={{ color: '#9CA3AF' }}>{exp.duration}</p>
                          {exp.description && (
                            <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {currentUser.education && currentUser.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.education.map((edu, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex gap-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#CDEDEA' }}
                        >
                          <GraduationCap className="w-5 h-5" style={{ color: '#0F766E' }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p style={{ color: '#8B8B8B' }}>{edu.institution}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm" style={{ color: '#9CA3AF' }}>{edu.year}</p>
                            {edu.field && (
                              <>
                                <span style={{ color: '#9CA3AF' }}>•</span>
                                <p className="text-sm" style={{ color: '#9CA3AF' }}>{edu.field}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {currentUser.achievements && currentUser.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentUser.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E07A2F' }} />
                      <span className="text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {currentUser.interests && currentUser.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Interests & Hobbies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, index) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>Your contribution to the Smart Alumni Connect community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {currentUser.role === 'alumni' ? (
                  <>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                          <Briefcase className="w-5 h-5" style={{ color: '#0F766E' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Jobs Posted</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                          <User className="w-5 h-5" style={{ color: '#E07A2F' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Mentorships</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                          <Calendar className="w-5 h-5" style={{ color: '#C75B12' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Events Attended</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                          <Briefcase className="w-5 h-5" style={{ color: '#0F766E' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Applications</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                          <User className="w-5 h-5" style={{ color: '#E07A2F' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Connections</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                          <Calendar className="w-5 h-5" style={{ color: '#C75B12' }} />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">0</p>
                          <p className="text-sm text-muted-foreground">Events Registered</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
