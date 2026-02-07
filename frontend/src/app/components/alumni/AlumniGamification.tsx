import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Activity,
  Medal,
  Star,
  Flame,
  Target,
  Gift,
  Download
} from 'lucide-react';

export function AlumniGamification() {
  const { currentUser, alumni } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate leaderboard - sort alumni by points
  const leaderboard = [...alumni]
    .filter(a => (a.points || 0) > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .map((alumni, index) => ({
      ...alumni,
      rank: index + 1
    }));

  const currentUserRank = leaderboard.findIndex(a => a.id === currentUser?.id) + 1;

  // Badge definitions
  const badgeDefinitions = [
    {
      name: 'Top Mentor',
      icon: Award,
      color: '#0F766E',
      description: 'Awarded for mentoring 5+ students',
      requirement: 'Mentor 5 or more students'
    },
    {
      name: 'Active Donor',
      icon: Gift,
      color: '#E07A2F',
      description: 'Awarded for making donations to the alumni fund',
      requirement: 'Make a donation'
    },
    {
      name: 'Community Star',
      icon: Star,
      color: '#1F8A7A',
      description: 'Awarded for active participation in events',
      requirement: 'Attend or organize 3+ events'
    },
    {
      name: 'Networking Pro',
      icon: Activity,
      color: '#C75B12',
      description: 'Awarded for connecting with many alumni',
      requirement: 'Connect with 10+ alumni'
    },
  ];

  // Points guide
  const pointsGuide = [
    { activity: 'Accept mentorship request', points: 50, icon: Award },
    { activity: 'Post a job opportunity', points: 40, icon: Briefcase },
    { activity: 'Attend an event', points: 30, icon: Calendar },
    { activity: 'Organize an event', points: 60, icon: Users },
    { activity: 'Make a donation', points: 100, icon: Gift },
    { activity: 'Network with alumni', points: 20, icon: Activity },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: Trophy, color: '#FFD700' };
    if (rank === 2) return { icon: Medal, color: '#C0C0C0' };
    if (rank === 3) return { icon: Medal, color: '#CD7F32' };
    return { icon: Target, color: '#0F766E' };
  };

  const downloadCertificate = () => {
    // Mock certificate download
    alert('Certificate downloaded! In a real app, this would generate a PDF certificate.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Alumni Rewards & Recognition</h1>
        <p className="text-muted-foreground">
          Earn points, unlock badges, and climb the leaderboard through active engagement
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Points
                </CardTitle>
                <Flame className="w-5 h-5" style={{ color: '#E07A2F' }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{currentUser?.points || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentUserRank > 0 ? `Rank #${currentUserRank}` : 'Not ranked yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Badges Earned
                </CardTitle>
                <Award className="w-5 h-5" style={{ color: '#1F8A7A' }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{currentUser?.badges?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {4 - (currentUser?.badges?.length || 0)} badges remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Activities
                </CardTitle>
                <TrendingUp className="w-5 h-5" style={{ color: '#0F766E' }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{currentUser?.activities?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep up the great work!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Points Guide */}
          <Card>
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
              <CardDescription>Participate in activities to earn points and climb the leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pointsGuide.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF1E4' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FAEBDD' }}>
                          <Icon className="w-5 h-5" style={{ color: '#0F766E' }} />
                        </div>
                        <span>{item.activity}</span>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        +{item.points} pts
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* My Badges */}
          {currentUser?.badges && currentUser.badges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Badges</CardTitle>
                <CardDescription>Your earned achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentUser.badges.map((badgeName, index) => {
                    const badgeInfo = badgeDefinitions.find(b => b.name === badgeName);
                    if (!badgeInfo) return null;
                    const Icon = badgeInfo.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-lg border">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${badgeInfo.color}20` }}>
                          <Icon className="w-6 h-6" style={{ color: badgeInfo.color }} />
                        </div>
                        <div>
                          <div className="font-semibold">{badgeInfo.name}</div>
                          <div className="text-sm text-muted-foreground">{badgeInfo.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button 
                  onClick={downloadCertificate} 
                  className="w-full mt-4"
                  style={{ backgroundColor: '#0F766E' }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Achievement Certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Leaderboard</CardTitle>
              <CardDescription>Top contributing alumni this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((alumni) => {
                  const { icon: RankIcon, color: rankColor } = getRankIcon(alumni.rank);
                  const isCurrentUser = alumni.id === currentUser?.id;
                  
                  return (
                    <div 
                      key={alumni.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${isCurrentUser ? 'bg-[#CDEDEA]' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10">
                          <RankIcon className="w-6 h-6" style={{ color: rankColor }} />
                        </div>
                        <img 
                          src={alumni.avatar} 
                          alt={alumni.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">
                            {alumni.name}
                            {isCurrentUser && <span className="ml-2 text-sm text-muted-foreground">(You)</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {alumni.currentRole} at {alumni.currentOrganization}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold" style={{ color: '#0F766E' }}>
                          {alumni.points} pts
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {alumni.badges?.length || 0} badges
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Badges</CardTitle>
              <CardDescription>Complete activities to unlock these prestigious badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {badgeDefinitions.map((badge, index) => {
                  const Icon = badge.icon;
                  const isEarned = currentUser?.badges?.includes(badge.name);
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-6 rounded-lg border ${isEarned ? '' : 'opacity-50'}`}
                      style={{ backgroundColor: isEarned ? `${badge.color}10` : '#F9FAFB' }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${badge.color}20` }}
                        >
                          <Icon className="w-8 h-8" style={{ color: badge.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">
                            {badge.name}
                            {isEarned && <Badge className="ml-2" style={{ backgroundColor: badge.color }}>Earned</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{badge.description}</div>
                          <div className="text-xs text-muted-foreground">
                            <strong>Requirement:</strong> {badge.requirement}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your engagement history</CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser?.activities && currentUser.activities.length > 0 ? (
                <div className="space-y-3">
                  {currentUser.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#FFF1E4' }}>
                      <div>
                        <div className="font-medium">{activity.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No activities yet. Start engaging to earn points!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import these for the points guide icons
import { Briefcase, Calendar, Users } from 'lucide-react';
