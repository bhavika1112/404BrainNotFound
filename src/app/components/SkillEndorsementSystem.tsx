import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { 
  Award, 
  ThumbsUp, 
  Star, 
  TrendingUp,
  Plus,
  Search,
  CheckCircle,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface SkillEndorsement {
  skillName: string;
  endorsers: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  }>;
  count: number;
  level: 'beginner' | 'intermediate' | 'expert';
}

interface UserSkillProfile {
  userId: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  skills: SkillEndorsement[];
  totalEndorsements: number;
  topSkills: string[];
}

export function SkillEndorsementSystem() {
  const { currentUser, alumni, students } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock skill endorsements data
  const mockUserSkills: { [key: string]: UserSkillProfile } = {
    'a1': {
      userId: 'a1',
      userName: 'Sarah Johnson',
      userRole: 'Senior Software Engineer at Google',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: [
        {
          skillName: 'React',
          endorsers: [
            { id: 'a2', name: 'Michael Chen', role: 'Product Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
            { id: 'a3', name: 'Emily Rodriguez', role: 'Data Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
          ],
          count: 45,
          level: 'expert'
        },
        {
          skillName: 'Node.js',
          endorsers: [
            { id: 'a2', name: 'Michael Chen', role: 'Product Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
          ],
          count: 38,
          level: 'expert'
        },
        {
          skillName: 'TypeScript',
          endorsers: [
            { id: 'a3', name: 'Emily Rodriguez', role: 'Data Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
          ],
          count: 42,
          level: 'expert'
        },
        {
          skillName: 'Python',
          endorsers: [],
          count: 28,
          level: 'intermediate'
        },
        {
          skillName: 'AWS',
          endorsers: [],
          count: 35,
          level: 'expert'
        },
      ],
      totalEndorsements: 188,
      topSkills: ['React', 'TypeScript', 'Node.js']
    }
  };

  const [userSkills, setUserSkills] = useState(mockUserSkills);

  const allUsers = [...alumni, ...students].filter(u => u.id !== currentUser?.id);

  const filteredUsers = searchQuery
    ? allUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsers.slice(0, 10);

  const handleEndorseSkill = (userId: string, skillName: string) => {
    if (!currentUser) return;

    const userProfile = userSkills[userId];
    if (!userProfile) return;

    const updatedSkills = userProfile.skills.map(skill => {
      if (skill.skillName === skillName) {
        const alreadyEndorsed = skill.endorsers.some(e => e.id === currentUser.id);
        
        if (alreadyEndorsed) {
          toast.error('You have already endorsed this skill');
          return skill;
        }

        return {
          ...skill,
          endorsers: [
            ...skill.endorsers,
            {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.currentRole || currentUser.role || 'User',
              avatar: currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
            }
          ],
          count: skill.count + 1
        };
      }
      return skill;
    });

    setUserSkills({
      ...userSkills,
      [userId]: {
        ...userProfile,
        skills: updatedSkills,
        totalEndorsements: userProfile.totalEndorsements + 1
      }
    });

    toast.success(`You endorsed ${skillName} for ${userProfile.userName}`);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return '#0F766E';
      case 'intermediate':
        return '#1F8A7A';
      case 'beginner':
        return '#9CA3AF';
      default:
        return '#9CA3AF';
    }
  };

  const getSkillLevelBadge = (level: string) => {
    switch (level) {
      case 'expert':
        return { icon: Star, label: 'Expert', color: '#0F766E' };
      case 'intermediate':
        return { icon: TrendingUp, label: 'Intermediate', color: '#1F8A7A' };
      case 'beginner':
        return { icon: Target, label: 'Beginner', color: '#9CA3AF' };
      default:
        return { icon: Target, label: 'Beginner', color: '#9CA3AF' };
    }
  };

  const displayedUser = selectedUser && userSkills[selectedUser] 
    ? userSkills[selectedUser]
    : userSkills['a1']; // Default to first user for demonstration

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
            <Award className="w-5 h-5" style={{ color: '#0F766E' }} />
          </div>
          <div>
            <h1>Skill Endorsements</h1>
            <p className="text-muted-foreground">
              Build credibility through peer recognition
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Endorsements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {currentUser ? (userSkills[currentUser.id]?.totalEndorsements || 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">From community</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expert Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {currentUser 
                ? (userSkills[currentUser.id]?.skills.filter(s => s.level === 'expert').length || 0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Verified expertise</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Endorsed Others
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">0</div>
            <p className="text-xs text-muted-foreground">Contributions given</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {currentUser ? (userSkills[currentUser.id]?.topSkills.length || 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Most endorsed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Search & List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Find Users</CardTitle>
            <CardDescription>Search and endorse skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      selectedUser === user.id ? 'border-2 bg-[#FFF1E4]' : ''
                    }`}
                    style={selectedUser === user.id ? { borderColor: '#0F766E' } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.currentRole || user.role} {user.company && `at ${user.company}`}
                        </p>
                      </div>
                      {userSkills[user.id]?.totalEndorsements && (
                        <Badge variant="secondary" className="text-xs">
                          {userSkills[user.id].totalEndorsements}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Skill Profile */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={displayedUser.userAvatar} />
                <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                  {displayedUser.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{displayedUser.userName}</CardTitle>
                <CardDescription>{displayedUser.userRole}</CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <Award className="w-5 h-5" style={{ color: '#E07A2F' }} />
                  <span className="text-2xl font-semibold">
                    {displayedUser.totalEndorsements}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Total Endorsements</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Top Skills */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFF1E4' }}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5" style={{ color: '#E07A2F' }} />
                <h3 className="font-semibold">Top Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayedUser.topSkills.map(skill => (
                  <Badge
                    key={skill}
                    className="text-sm py-1 px-3"
                    style={{ backgroundColor: '#FFD6B8', color: '#C75B12' }}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* All Skills */}
            <div>
              <h3 className="font-semibold mb-4">All Skills</h3>
              <div className="space-y-4">
                {displayedUser.skills.map(skill => {
                  const levelBadge = getSkillLevelBadge(skill.level);
                  const LevelIcon = levelBadge.icon;
                  const hasEndorsed = skill.endorsers.some(e => e.id === currentUser?.id);

                  return (
                    <div
                      key={skill.skillName}
                      className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{skill.skillName}</h4>
                            <Badge
                              variant="outline"
                              className="text-xs gap-1"
                              style={{ borderColor: levelBadge.color, color: levelBadge.color }}
                            >
                              <LevelIcon className="w-3 h-3" />
                              {levelBadge.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{skill.count} endorsements</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleEndorseSkill(displayedUser.userId, skill.skillName)}
                          disabled={hasEndorsed || displayedUser.userId === currentUser?.id}
                          className="gap-2"
                          style={
                            hasEndorsed
                              ? { backgroundColor: '#CDEDEA', color: '#0F766E' }
                              : { backgroundColor: '#0F766E' }
                          }
                        >
                          {hasEndorsed ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Endorsed
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Endorse
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Endorsers */}
                      {skill.endorsers.length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">
                            Endorsed by:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {skill.endorsers.slice(0, 5).map(endorser => (
                              <div
                                key={endorser.id}
                                className="flex items-center gap-2 p-2 rounded-md text-xs"
                                style={{ backgroundColor: '#FAEBDD' }}
                              >
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={endorser.avatar} />
                                  <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E', fontSize: '10px' }}>
                                    {endorser.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{endorser.name}</span>
                              </div>
                            ))}
                            {skill.endorsers.length > 5 && (
                              <span className="text-xs text-muted-foreground self-center">
                                +{skill.endorsers.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-2" style={{ borderColor: '#0F766E', backgroundColor: '#FFF1E4' }}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#CDEDEA' }}
            >
              <Zap className="w-6 h-6" style={{ color: '#0F766E' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Build Your Professional Credibility</h3>
              <p className="text-sm text-muted-foreground">
                Endorse skills to help others shine and get endorsed to showcase your expertise
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
