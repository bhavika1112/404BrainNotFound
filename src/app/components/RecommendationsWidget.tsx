import React from 'react';
import { useRecommendations } from '../context/RecommendationContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  Briefcase, 
  Calendar, 
  Users, 
  TrendingUp,
  ArrowRight,
  Target,
  Award
} from 'lucide-react';

export function RecommendationsWidget() {
  const { currentUser } = useApp();
  const { recommendations, getRecommendations } = useRecommendations();

  if (!currentUser) return null;

  const userRecommendations = getRecommendations(currentUser.role, currentUser.id).slice(0, 5);

  if (userRecommendations.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-5 h-5 text-[#E07A2F]" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-[#0F766E]" />;
      case 'alumni':
      case 'mentorship':
        return <Users className="w-5 h-5 text-[#1F8A7A]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-[#C75B12]" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'job':
        return 'Job';
      case 'event':
        return 'Event';
      case 'alumni':
        return 'Connect';
      case 'mentorship':
        return 'Mentorship';
      default:
        return 'Content';
    }
  };

  return (
    <Card className="border-2" style={{ borderColor: '#CDEDEA', backgroundColor: '#FFF1E4' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#E07A2F' }} />
            </div>
            <div>
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>
                Personalized suggestions based on your {currentUser.field || 'interests'}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Target className="w-3 h-3" />
            Smart Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {userRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg border-2 bg-white hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: '#FAEBDD' }}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {getIcon(rec.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-[#1F2933]">
                      {rec.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        backgroundColor: '#CDEDEA',
                        borderColor: '#0F766E',
                        color: '#0F766E',
                      }}
                    >
                      {getTypeLabel(rec.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#2A2A2A] mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-3 h-3 text-[#C75B12]" />
                    <p className="text-xs" style={{ color: '#C75B12' }}>
                      {rec.reason}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      <div className="flex-1 h-1.5 rounded-full bg-[#FAEBDD]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(rec.relevanceScore, 100)}%`,
                            backgroundColor: '#0F766E',
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#0F766E' }}>
                        {Math.round(rec.relevanceScore)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length > 5 && (
          <Button
            variant="ghost"
            className="w-full mt-4 gap-2"
            style={{ color: '#0F766E' }}
          >
            View All Recommendations
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
