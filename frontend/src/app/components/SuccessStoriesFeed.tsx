import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  Award, 
  Users,
  MessageCircle,
  Target,
  Trophy,
  Zap,
  Heart,
  BookOpen,
  Briefcase,
  Calendar,
  ThumbsUp,
  Share2,
  CheckCircle
} from 'lucide-react';

interface SuccessStory {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar: string;
  title: string;
  story: string;
  category: 'career' | 'entrepreneurship' | 'education' | 'personal';
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  featured: boolean;
}

const mockSuccessStories: SuccessStory[] = [
  {
    id: '1',
    authorId: 'a1',
    authorName: 'Sarah Johnson',
    authorRole: 'Senior Software Engineer',
    authorCompany: 'Google',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    title: 'From Campus to FAANG: My Journey to Google',
    story: `When I graduated in 2018, I never imagined I'd be working at Google. The journey wasn't easy - it took 3 rounds of interviews, countless hours of preparation, and valuable mentorship from our alumni network. 

What made the difference? First, I focused on building strong fundamentals in data structures and algorithms. Second, I actively participated in open-source projects which gave me real-world experience. Third, and most importantly, I leveraged the alumni mentorship program where senior engineers guided me through the technical interview process.

To all students out there - believe in yourself, stay persistent, and don't hesitate to reach out for help. Our alumni community is here to support you!`,
    category: 'career',
    tags: ['FAANG', 'Software Engineering', 'Interview Tips', 'Career Growth'],
    likes: 234,
    comments: 45,
    shares: 67,
    timestamp: new Date('2026-01-15'),
    featured: true
  },
  {
    id: '2',
    authorId: 'a2',
    authorName: 'Michael Chen',
    authorRole: 'Product Manager',
    authorCompany: 'Microsoft',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    title: 'Transitioning from Engineering to Product Management',
    story: `Making the switch from software engineering to product management was one of the best decisions of my career. After 3 years as an engineer, I realized my passion lay in understanding user needs and driving product strategy.

The transition wasn't straightforward. I spent evenings learning about product frameworks, user research, and business strategy. I took on PM-like responsibilities in my engineering role, volunteering to write product specs and participate in user interviews.

The MBA helped, but what really mattered was building a portfolio of product thinking. I documented every product decision I influenced, every user problem I solved. When Microsoft came calling, I had a compelling story to tell.

My advice: Don't wait for permission to start thinking like a PM. Start where you are!`,
    category: 'career',
    tags: ['Product Management', 'Career Transition', 'MBA', 'Leadership'],
    likes: 189,
    comments: 32,
    shares: 54,
    timestamp: new Date('2026-01-20'),
    featured: true
  },
  {
    id: '3',
    authorId: 'a3',
    authorName: 'Emily Rodriguez',
    authorRole: 'Data Scientist',
    authorCompany: 'Amazon',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    title: 'PhD Journey: From Campus to Cutting-Edge AI Research',
    story: `Pursuing a PhD while working full-time seemed impossible, but it was the most rewarding experience of my career. I spent 4 years balancing research at MIT with my work at Amazon, focusing on natural language processing and recommendation systems.

The key was finding alignment between my PhD research and my work projects. My dissertation on personalization algorithms directly contributed to improving Amazon's recommendation engine. This symbiotic relationship made both my research and work more impactful.

I published 8 papers, filed 3 patents, and built ML models now serving over 100 million users. The journey taught me that you don't have to choose between academia and industry - you can excel at both!

Special thanks to our alumni mentors who guided me through research proposals and paper submissions.`,
    category: 'education',
    tags: ['PhD', 'Research', 'Machine Learning', 'AI', 'Academia'],
    likes: 312,
    comments: 58,
    shares: 89,
    timestamp: new Date('2026-01-25'),
    featured: false
  }
];

export function SuccessStoriesFeed() {
  const { currentUser, alumni } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stories, setStories] = useState<SuccessStory[]>(mockSuccessStories);

  const categories = [
    { value: 'all', label: 'All Stories', icon: BookOpen },
    { value: 'career', label: 'Career', icon: Briefcase },
    { value: 'entrepreneurship', label: 'Entrepreneurship', icon: Zap },
    { value: 'education', label: 'Education', icon: Award },
    { value: 'personal', label: 'Personal Growth', icon: Heart },
  ];

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(s => s.category === selectedCategory);

  const handleLike = (storyId: string) => {
    setStories(stories.map(story =>
      story.id === storyId ? { ...story, likes: story.likes + 1 } : story
    ));
  };

  const handleShare = (storyId: string) => {
    setStories(stories.map(story =>
      story.id === storyId ? { ...story, shares: story.shares + 1 } : story
    ));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
            <Trophy className="w-5 h-5" style={{ color: '#E07A2F' }} />
          </div>
          <div>
            <h1>Success Stories</h1>
            <p className="text-muted-foreground">
              Inspiring journeys from our alumni community
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stories.length}</div>
            <p className="text-xs text-muted-foreground">Published by alumni</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stories.reduce((sum, s) => sum + s.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Community engagement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Featured Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stories.filter(s => s.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">Highlighted by admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {new Set(stories.map(s => s.authorId)).size}
            </div>
            <p className="text-xs text-muted-foreground">Sharing their journey</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.value;
              return (
                <Button
                  key={cat.value}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.value)}
                  className="gap-2"
                  style={isSelected ? { backgroundColor: '#0F766E' } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Featured Story */}
      {filteredStories.some(s => s.featured) && (
        <Card className="border-2" style={{ borderColor: '#FFD6B8', backgroundColor: '#FFF1E4' }}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" style={{ color: '#E07A2F' }} />
              <Badge style={{ backgroundColor: '#E07A2F', color: 'white' }}>
                Featured Story
              </Badge>
            </div>
            {filteredStories
              .filter(s => s.featured)
              .slice(0, 1)
              .map(story => (
                <div key={story.id}>
                  <CardTitle className="text-2xl mb-2">{story.title}</CardTitle>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={story.authorAvatar} />
                      <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                        {story.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{story.authorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {story.authorRole} at {story.authorCompany}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {story.story}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {story.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleLike(story.id)}
                    >
                      <Heart className="w-4 h-4" style={{ color: '#E07A2F' }} />
                      {story.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {story.comments}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleShare(story.id)}
                    >
                      <Share2 className="w-4 h-4" />
                      {story.shares}
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTimestamp(story.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
          </CardHeader>
        </Card>
      )}

      {/* All Stories */}
      <div className="space-y-4">
        {filteredStories
          .filter(s => !s.featured)
          .map(story => (
            <Card key={story.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={story.authorAvatar} />
                      <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                        {story.authorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{story.authorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {story.authorRole} at {story.authorCompany}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(story.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {story.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line line-clamp-4 mb-4">
                  {story.story}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleLike(story.id)}
                  >
                    <Heart className="w-4 h-4" />
                    {story.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {story.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleShare(story.id)}
                  >
                    <Share2 className="w-4 h-4" />
                    {story.shares}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 ml-auto"
                  >
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {currentUser?.role === 'alumni' && (
        <Card className="border-2" style={{ borderColor: '#0F766E' }}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#CDEDEA' }}
              >
                <Sparkles className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Share Your Success Story</h3>
                <p className="text-sm text-muted-foreground">
                  Inspire students and fellow alumni with your journey
                </p>
              </div>
              <Button style={{ backgroundColor: '#0F766E' }} className="gap-2">
                <Plus className="w-4 h-4" />
                Write Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
