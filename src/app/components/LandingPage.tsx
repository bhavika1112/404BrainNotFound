import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Briefcase, Calendar, Heart, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser, users } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<'alumni' | 'student' | 'admin' | null>(null);

  const handleLogin = (role: 'alumni' | 'student' | 'admin') => {
    // Find a user with the selected role for demo purposes
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      navigate(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF1E4] via-[#FAEBDD] to-[#CDEDEA]">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <GraduationCap className="w-20 h-20 text-[#0F766E]" />
          </div>
          <h1 className="text-5xl font-bold text-[#1F2933] mb-4">
            Smart Alumni Connect
          </h1>
          <p className="text-xl text-[#2A2A2A] max-w-2xl mx-auto">
            A centralized platform strengthening relationships between alumni, students, and educational institutions
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <Users className="w-12 h-12 text-[#0F766E] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Alumni Networking</h3>
            <p className="text-[#8B8B8B]">Connect with fellow alumni, share opportunities, and give back to your alma mater</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <Briefcase className="w-12 h-12 text-[#E07A2F] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Job Opportunities</h3>
            <p className="text-[#8B8B8B]">Access exclusive job postings and internships shared by alumni</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <Calendar className="w-12 h-12 text-[#1F8A7A] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Events & Reunions</h3>
            <p className="text-[#8B8B8B]">Participate in college events, webinars, and annual reunions</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <Heart className="w-12 h-12 text-[#C75B12] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Mentorship Program</h3>
            <p className="text-[#8B8B8B]">Students receive guidance from experienced alumni mentors</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <TrendingUp className="w-12 h-12 text-[#0D5C57] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Career Growth</h3>
            <p className="text-[#8B8B8B]">Track your professional development and access career resources</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FFD6B8]">
            <GraduationCap className="w-12 h-12 text-[#1F8A7A] mb-4" />
            <h3 className="text-xl font-semibold text-[#1F2933] mb-2">Platform Analytics</h3>
            <p className="text-[#8B8B8B]">Admins gain insights into engagement and participation metrics</p>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-10 border-2 border-[#0F766E]">
            <h2 className="text-3xl font-semibold text-center text-[#1F2933] mb-8">
              Choose Your Role to Continue
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => handleLogin('alumni')}
                className="group relative p-8 bg-gradient-to-br from-[#0F766E] to-[#1F8A7A] rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-white">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Alumni</h3>
                  <p className="text-sm text-[#CDEDEA]">Share opportunities & mentor students</p>
                </div>
              </button>

              <button
                onClick={() => handleLogin('student')}
                className="group relative p-8 bg-gradient-to-br from-[#E07A2F] to-[#D66A1F] rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-white">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Student</h3>
                  <p className="text-sm text-[#FFF1C1]">Explore jobs & connect with alumni</p>
                </div>
              </button>

              <button
                onClick={() => handleLogin('admin')}
                className="group relative p-8 bg-gradient-to-br from-[#1F2933] to-[#2A2A2A] rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-white">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Admin</h3>
                  <p className="text-sm text-[#B0B0B0]">Manage platform & view analytics</p>
                </div>
              </button>
            </div>

            <p className="text-center text-sm text-[#8B8B8B] mt-8">
              Demo Platform - Click any role to explore the system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
