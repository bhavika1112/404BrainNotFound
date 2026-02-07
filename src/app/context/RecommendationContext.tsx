import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';

interface Recommendation {
  id: string;
  type: 'job' | 'event' | 'alumni' | 'mentorship' | 'content';
  title: string;
  description: string;
  reason: string;
  relevanceScore: number;
  data: any;
  timestamp: Date;
}

interface RecommendationContextType {
  recommendations: Recommendation[];
  getRecommendations: (userRole: string, userId: string) => Recommendation[];
  refreshRecommendations: () => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export function RecommendationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, jobs, events, alumni, students, mentorshipRequests } = useApp();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Generate recommendations based on user profile, interests, field, and recent activities
  const generateRecommendations = () => {
    if (!currentUser) return [];

    const newRecommendations: Recommendation[] = [];
    const userField = currentUser.field || currentUser.department || '';
    const userSkills = currentUser.skills || [];
    const userInterests = currentUser.interests || [];

    // Job Recommendations (for students and alumni looking for opportunities)
    if (currentUser.role === 'student' || currentUser.role === 'alumni') {
      jobs.forEach(job => {
        let relevanceScore = 0;
        const reasons: string[] = [];

        // Match by field/department
        if (job.department?.toLowerCase().includes(userField.toLowerCase()) ||
            userField.toLowerCase().includes(job.department?.toLowerCase() || '')) {
          relevanceScore += 40;
          reasons.push(`Matches your field: ${userField}`);
        }

        // Match by skills
        const jobSkills = job.requirements?.toLowerCase().split(',') || [];
        const matchingSkills = userSkills.filter(skill =>
          jobSkills.some(jSkill => jSkill.includes(skill.toLowerCase()))
        );
        if (matchingSkills.length > 0) {
          relevanceScore += matchingSkills.length * 15;
          reasons.push(`${matchingSkills.length} skill match(es)`);
        }

        // Match by experience level
        if (currentUser.role === 'alumni' && job.experienceLevel === 'experienced') {
          relevanceScore += 20;
          reasons.push('Matches your experience level');
        } else if (currentUser.role === 'student' && 
                   (job.experienceLevel === 'entry' || job.experienceLevel === 'internship')) {
          relevanceScore += 20;
          reasons.push('Perfect for students');
        }

        // Match by location preference
        if (currentUser.location && job.location?.includes(currentUser.location)) {
          relevanceScore += 10;
          reasons.push('Near your location');
        }

        if (relevanceScore > 30) {
          newRecommendations.push({
            id: `job-${job.id}`,
            type: 'job',
            title: job.title,
            description: `${job.company} • ${job.location || 'Remote'}`,
            reason: reasons.join(' • '),
            relevanceScore,
            data: job,
            timestamp: new Date(),
          });
        }
      });
    }

    // Event Recommendations (for all users)
    events.forEach(event => {
      let relevanceScore = 0;
      const reasons: string[] = [];

      // Match by category and interests
      if (userInterests.some(interest =>
        event.title.toLowerCase().includes(interest.toLowerCase()) ||
        event.description?.toLowerCase().includes(interest.toLowerCase())
      )) {
        relevanceScore += 35;
        reasons.push('Matches your interests');
      }

      // Match by field
      if (event.title.toLowerCase().includes(userField.toLowerCase()) ||
          event.description?.toLowerCase().includes(userField.toLowerCase())) {
        relevanceScore += 30;
        reasons.push(`Related to ${userField}`);
      }

      // Boost upcoming events
      if (event.status === 'upcoming') {
        relevanceScore += 15;
        reasons.push('Happening soon');
      }

      // Popular events
      if (event.registeredCount > 50) {
        relevanceScore += 10;
        reasons.push('Highly popular');
      }

      if (relevanceScore > 30) {
        newRecommendations.push({
          id: `event-${event.id}`,
          type: 'event',
          title: event.title,
          description: `${new Date(event.date).toLocaleDateString()} • ${event.registeredCount} registered`,
          reason: reasons.join(' • '),
          relevanceScore,
          data: event,
          timestamp: new Date(),
        });
      }
    });

    // Alumni/Mentor Recommendations (for students)
    if (currentUser.role === 'student') {
      alumni.forEach(alum => {
        let relevanceScore = 0;
        const reasons: string[] = [];

        // Same field
        if (alum.field?.toLowerCase() === userField.toLowerCase() ||
            alum.department?.toLowerCase() === userField.toLowerCase()) {
          relevanceScore += 40;
          reasons.push(`Works in ${alum.field || alum.department}`);
        }

        // Same company interest
        if (currentUser.dreamCompanies?.some(company =>
          alum.company?.toLowerCase().includes(company.toLowerCase())
        )) {
          relevanceScore += 30;
          reasons.push(`Works at ${alum.company}`);
        }

        // Skill overlap
        const matchingSkills = userSkills.filter(skill =>
          alum.skills?.some(aSkill => aSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (matchingSkills.length > 0) {
          relevanceScore += matchingSkills.length * 10;
          reasons.push(`${matchingSkills.length} shared skill(s)`);
        }

        // Available for mentorship
        if (alum.mentorshipAvailable) {
          relevanceScore += 20;
          reasons.push('Available for mentorship');
        }

        if (relevanceScore > 35) {
          newRecommendations.push({
            id: `alumni-${alum.id}`,
            type: 'alumni',
            title: alum.name,
            description: `${alum.company || 'Alumni'} • ${alum.field || alum.department}`,
            reason: reasons.join(' • '),
            relevanceScore,
            data: alum,
            timestamp: new Date(),
          });
        }
      });
    }

    // Student Recommendations (for alumni mentors)
    if (currentUser.role === 'alumni' && currentUser.mentorshipAvailable) {
      students.forEach(student => {
        let relevanceScore = 0;
        const reasons: string[] = [];

        // Same field
        if (student.field?.toLowerCase() === userField.toLowerCase() ||
            student.department?.toLowerCase() === userField.toLowerCase()) {
          relevanceScore += 40;
          reasons.push(`Studying ${student.field || student.department}`);
        }

        // Skill overlap - can teach
        const matchingSkills = student.skills?.filter(skill =>
          userSkills.some(uSkill => uSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (matchingSkills && matchingSkills.length > 0) {
          relevanceScore += matchingSkills.length * 10;
          reasons.push('Can mentor in their interests');
        }

        if (relevanceScore > 30) {
          newRecommendations.push({
            id: `student-${student.id}`,
            type: 'mentorship',
            title: student.name,
            description: `${student.year || 'Student'} • ${student.field || student.department}`,
            reason: reasons.join(' • '),
            relevanceScore,
            data: student,
            timestamp: new Date(),
          });
        }
      });
    }

    // Sort by relevance score
    return newRecommendations.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 20);
  };

  const refreshRecommendations = () => {
    const newRecs = generateRecommendations();
    setRecommendations(newRecs);
  };

  const getRecommendations = (userRole: string, userId: string) => {
    return recommendations.filter(rec => {
      // Filter based on role-specific needs
      if (userRole === 'student') {
        return ['job', 'event', 'alumni', 'content'].includes(rec.type);
      } else if (userRole === 'alumni') {
        return ['job', 'event', 'mentorship', 'content'].includes(rec.type);
      }
      return true;
    });
  };

  // Refresh recommendations when user data or content changes
  useEffect(() => {
    if (currentUser) {
      refreshRecommendations();
    }
  }, [currentUser, jobs, events, alumni, students]);

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        getRecommendations,
        refreshRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
}
