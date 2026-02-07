import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { GraduationCap, Users, Briefcase, Calendar, Heart, TrendingUp, Award, Target } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function NewLandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF1E4 0%, #FAEBDD 50%, #CDEDEA 100%)' }}>
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#0F766E' }}
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: '#1F2933' }}>
            Smart Alumni Connect
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8" style={{ color: '#2A2A2A' }}>
            A centralized platform strengthening relationships between alumni, students, and educational institutions
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="text-lg px-8 py-6"
            style={{ backgroundColor: '#0F766E' }}
          >
            Get Started
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="border-2" style={{ borderColor: '#CDEDEA' }}>
            <CardContent className="pt-6 text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#CDEDEA' }}
              >
                <Users className="w-6 h-6" style={{ color: '#0F766E' }} />
              </div>
              <p className="text-3xl font-semibold mb-1" style={{ color: '#1F2933' }}>1000+</p>
              <p className="text-sm" style={{ color: '#8B8B8B' }}>Alumni Members</p>
            </CardContent>
          </Card>
          
          <Card className="border-2" style={{ borderColor: '#FFD6B8' }}>
            <CardContent className="pt-6 text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#FFD6B8' }}
              >
                <Briefcase className="w-6 h-6" style={{ color: '#E07A2F' }} />
              </div>
              <p className="text-3xl font-semibold mb-1" style={{ color: '#1F2933' }}>500+</p>
              <p className="text-sm" style={{ color: '#8B8B8B' }}>Job Opportunities</p>
            </CardContent>
          </Card>
          
          <Card className="border-2" style={{ borderColor: '#FFF1C1' }}>
            <CardContent className="pt-6 text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#FFF1C1' }}
              >
                <Calendar className="w-6 h-6" style={{ color: '#C75B12' }} />
              </div>
              <p className="text-3xl font-semibold mb-1" style={{ color: '#1F2933' }}>200+</p>
              <p className="text-sm" style={{ color: '#8B8B8B' }}>Events Hosted</p>
            </CardContent>
          </Card>
          
          <Card className="border-2" style={{ borderColor: '#CDEDEA' }}>
            <CardContent className="pt-6 text-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#CDEDEA' }}
              >
                <Award className="w-6 h-6" style={{ color: '#1F8A7A' }} />
              </div>
              <p className="text-3xl font-semibold mb-1" style={{ color: '#1F2933' }}>95%</p>
              <p className="text-sm" style={{ color: '#8B8B8B' }}>Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={{ color: '#1F2933' }}>
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#CDEDEA' }}
                >
                  <Users className="w-6 h-6" style={{ color: '#0F766E' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Alumni Networking</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Connect with fellow alumni, share opportunities, and give back to your alma mater through mentorship and guidance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FFD6B8' }}
                >
                  <Briefcase className="w-6 h-6" style={{ color: '#E07A2F' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Job Opportunities</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Access exclusive job postings and internships shared by alumni. Apply directly and track your applications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FFF1C1' }}
                >
                  <Calendar className="w-6 h-6" style={{ color: '#1F8A7A' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Events & Reunions</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Participate in college events, webinars, workshops, and annual reunions. Stay connected with your community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FFD6B8' }}
                >
                  <Heart className="w-6 h-6" style={{ color: '#C75B12' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Mentorship Program</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Students receive guidance from experienced alumni mentors in their field of interest through structured programs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#CDEDEA' }}
                >
                  <Target className="w-6 h-6" style={{ color: '#0D5C57' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Career Growth</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Track your professional development journey and access valuable career resources and guidance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:shadow-lg transition-shadow" style={{ borderColor: '#FFD6B8' }}>
              <CardContent className="p-8">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#FFF1C1' }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: '#1F8A7A' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2933' }}>Platform Analytics</h3>
                <p style={{ color: '#8B8B8B' }}>
                  Admins gain comprehensive insights into engagement metrics, participation trends, and platform health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card 
          className="border-2 overflow-hidden"
          style={{ borderColor: '#0F766E' }}
        >
          <CardContent 
            className="p-12 text-center"
            style={{ 
              background: 'linear-gradient(135deg, #0F766E 0%, #1F8A7A 100%)'
            }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Join our vibrant community of alumni and students. Connect, collaborate, and grow together.
            </p>
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6"
              style={{ backgroundColor: 'white', color: '#0F766E' }}
            >
              Sign In / Register
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t" style={{ borderColor: '#9CA3AF' }}>
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm" style={{ color: '#8B8B8B' }}>
            © 2026 Smart Alumni Connect. All rights reserved. | Demo Platform
          </p>
        </div>
      </div>
    </div>
  );
}
