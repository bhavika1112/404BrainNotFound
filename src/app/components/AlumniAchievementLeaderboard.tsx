import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Award,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  UserPlus,
  Target,
  Zap,
  Crown,
  Medal,
  Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  userId: string;
  type: 'mentorship' | 'referrals' | 'events' | 'networking' | 'contributions';
  title: string;
  description: string;
  points: number;
  earnedAt: Date;
  icon: any;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  userCompany: string;
  totalPoints: number;
  rank: number;
  achievements: Achievement[];
  badges: string[];
  streak: number;
}

export function AlumniAchievementLeaderboard() {
  const { alumni, currentUser } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'alltime'>('month');

  // Mock leaderboard data with achievements
  const mockLeaderboard: LeaderboardEntry[] = alumni.map((alum, index) => {
    const basePoints = Math.floor(Math.random() * 500) + 100;
    const achievements: Achievement[] = [
      {
        id: '1',
        userId: alum.id,
        type: 'mentorship',
        title: 'Master Mentor',
        description: 'Mentored 10+ students',
        points: 100,
        earnedAt: new Date(),
        icon: Users
      },
      {
        id: '2',
        userId: alum.id,
        type: 'referrals',
        title: 'Talent Scout',
        description: 'Successful job referrals',
        points: 80,
        earnedAt: new Date(),
        icon: UserPlus
      },
      {
        id: '3',
        userId: alum.id,
        type: 'networking',
        title: 'Super Connector',
        description: 'Connected with 50+ alumni',
        points: 60,
        earnedAt: new Date(),
        icon: MessageCircle
      }
    ];

    return {
      userId: alum.id,
      userName: alum.name,
      userAvatar: alum.avatar || '',
      userRole: alum.currentRole || 'Alumni',
      userCompany: alum.currentOrganization || alum.company || '',
      totalPoints: basePoints,
      rank: index + 1,
      achievements: achievements,
      badges: ['Top Mentor', 'Community Star', 'Referral Champion'],
      streak: Math.floor(Math.random() * 30) + 1
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  const topThree = mockLeaderboard.slice(0, 3);
  const restOfLeaderboard = mockLeaderboard.slice(3, 10);

  const currentUserRank = mockLeaderboard.find(entry => entry.userId === currentUser?.id);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6" style={{ color: '#FFD700' }} />;
    if (rank === 2) return <Medal className="w-6 h-6" style={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <Medal className="w-6 h-6" style={{ color: '#CD7F32' }} />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    const styles = [
      { bg: '#FFD6B8', color: '#C75B12', border: '#E07A2F' }, // Gold
      { bg: '#E5E7EB', color: '#6B7280', border: '#9CA3AF' }, // Silver
      { bg: '#FED7AA', color: '#C2410C', border: '#EA580C' }  // Bronze
    ];
    return styles[rank - 1] || { bg: '#FAEBDD', color: '#8B8B8B', border: '#B0B0B0' };
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'mentorship':
        return Users;
      case 'referrals':
        return UserPlus;
      case 'events':
        return Target;
      case 'networking':
        return MessageCircle;
      case 'contributions':
        return Heart;
      default:
        return Star;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
            <Trophy className="w-5 h-5" style={{ color: '#E07A2F' }} />
          </div>
          <div>
            <h1>Achievement Leaderboard</h1>
            <p className="text-muted-foreground">
              Top contributors to the alumni community
            </p>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedPeriod} onValueChange={(v: any) => setSelectedPeriod(v)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Your Rank Card */}
      {currentUserRank && (
        <Card className="border-2" style={{ borderColor: '#0F766E', backgroundColor: '#FFF1E4' }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl"
                   style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                #{currentUserRank.rank}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Your Current Rank</h3>
                <p className="text-sm text-muted-foreground">
                  {currentUserRank.totalPoints} points • {currentUserRank.streak} day streak
                </p>
                <div className="flex gap-2 mt-2">
                  {currentUserRank.badges.slice(0, 2).map(badge => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="w-5 h-5" style={{ color: '#E07A2F' }} />
                  <span className="text-2xl font-semibold">{currentUserRank.streak}</span>
                </div>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top Contributors</CardTitle>
          <CardDescription>Leading the way in community engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[topThree[1], topThree[0], topThree[2]].map((entry, displayIndex) => {
              if (!entry) return null;
              const actualRank = entry.rank;
              const rankStyle = getRankBadge(actualRank);
              const height = actualRank === 1 ? 'h-64' : actualRank === 2 ? 'h-56' : 'h-48';

              return (
                <div
                  key={entry.userId}
                  className={`relative ${displayIndex === 1 ? 'md:order-1' : displayIndex === 0 ? 'md:order-0 md:self-end' : 'md:order-2 md:self-end'}`}
                >
                  <Card className={`${height} border-2 hover:shadow-lg transition-all`}
                        style={{ borderColor: rankStyle.border }}>
                    <CardContent className="pt-6 flex flex-col items-center justify-between h-full">
                      <div className="text-center">
                        {getRankIcon(actualRank)}
                        <div className="relative mt-4 mb-3">
                          <Avatar className="w-20 h-20 border-4" style={{ borderColor: rankStyle.border }}>
                            <AvatarImage src={entry.userAvatar} />
                            <AvatarFallback style={{ backgroundColor: rankStyle.bg, color: rankStyle.color }}>
                              {entry.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                               style={{ backgroundColor: rankStyle.bg, color: rankStyle.color, border: `2px solid ${rankStyle.border}` }}>
                            {actualRank}
                          </div>
                        </div>
                        <h3 className="font-semibold">{entry.userName}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{entry.userRole}</p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Trophy className="w-4 h-4" style={{ color: rankStyle.color }} />
                          <span className="font-semibold text-lg">{entry.totalPoints}</span>
                          <span className="text-xs text-muted-foreground">pts</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {entry.badges.slice(0, 2).map(badge => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rest of Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard Rankings</CardTitle>
          <CardDescription>Top 10 alumni by contribution points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {restOfLeaderboard.map(entry => (
              <div
                key={entry.userId}
                className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold"
                     style={{ backgroundColor: '#FAEBDD', color: '#8B8B8B' }}>
                  #{entry.rank}
                </div>
                <Avatar>
                  <AvatarImage src={entry.userAvatar} />
                  <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                    {entry.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{entry.userRole}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" style={{ color: '#E07A2F' }} />
                    <span className="text-sm font-medium">{entry.streak}d</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{entry.totalPoints}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { type: 'mentorship', title: 'Mentorship', icon: Users, color: '#0F766E', count: 156 },
          { type: 'referrals', title: 'Job Referrals', icon: UserPlus, color: '#1F8A7A', count: 89 },
          { type: 'networking', title: 'Networking', icon: MessageCircle, color: '#E07A2F', count: 234 },
          { type: 'events', title: 'Event Participation', icon: Target, color: '#D66A1F', count: 178 },
          { type: 'contributions', title: 'Contributions', icon: Heart, color: '#C75B12', count: 92 },
          { type: 'skills', title: 'Skill Endorsements', icon: Award, color: '#0D5C57', count: 312 }
        ].map(category => {
          const Icon = category.icon;
          return (
            <Card key={category.type} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: `${category.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} achievements
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total points awarded</span>
                  <span className="font-semibold" style={{ color: category.color }}>
                    {category.count * 10}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* How Points Work */}
      <Card className="border-2" style={{ borderColor: '#CDEDEA' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: '#0F766E' }} />
            How to Earn Points
          </CardTitle>
          <CardDescription>Contribute to the community and climb the leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { action: 'Mentor a student', points: 50, icon: Users },
              { action: 'Successful job referral', points: 100, icon: UserPlus },
              { action: 'Attend an event', points: 20, icon: Target },
              { action: 'Post a success story', points: 30, icon: Star },
              { action: 'Connect with 10 alumni', points: 25, icon: MessageCircle },
              { action: 'Endorse skills', points: 5, icon: Award },
              { action: 'Weekly login streak', points: 10, icon: Flame },
              { action: 'Post a job opportunity', points: 40, icon: Briefcase }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.action} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                  </div>
                  <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                    +{item.points} pts
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
