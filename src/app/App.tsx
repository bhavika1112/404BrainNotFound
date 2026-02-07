import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import { NewLandingPage } from './components/NewLandingPage';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { EnhancedProfilePage } from './components/EnhancedProfilePage';
import { Messages } from './components/Messages';

// Alumni Components
import { AlumniDashboard } from './components/alumni/AlumniDashboard';
import { AlumniJobs } from './components/alumni/AlumniJobs';
import { AlumniEvents } from './components/alumni/AlumniEvents';
import { AlumniMentorship } from './components/alumni/AlumniMentorship';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentJobs } from './components/student/StudentJobs';
import { StudentAlumniNetwork } from './components/student/StudentAlumniNetwork';
import { StudentEvents } from './components/student/StudentEvents';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminAnalytics } from './components/admin/AdminAnalytics';

function AppContent() {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Show landing page if not logged in and not on login page
  if (!currentUser && !showLogin) {
    return <NewLandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  // Show login page
  if (!currentUser && showLogin) {
    return <LoginPage />;
  }

  const renderContent = () => {
    // Alumni Views
    if (currentUser.role === 'alumni') {
      switch (currentView) {
        case 'dashboard':
          return <AlumniDashboard onNavigate={setCurrentView} />;
        case 'jobs':
          return <AlumniJobs />;
        case 'events':
          return <AlumniEvents />;
        case 'mentorship':
          return <AlumniMentorship />;
        case 'messages':
          return <Messages />;
        case 'profile':
          return <EnhancedProfilePage />;
        default:
          return <AlumniDashboard onNavigate={setCurrentView} />;
      }
    }

    // Student Views
    if (currentUser.role === 'student') {
      switch (currentView) {
        case 'dashboard':
          return <StudentDashboard onNavigate={setCurrentView} />;
        case 'jobs':
          return <StudentJobs />;
        case 'events':
          return <StudentEvents />;
        case 'network':
          return <StudentAlumniNetwork />;
        case 'messages':
          return <Messages />;
        case 'profile':
          return <EnhancedProfilePage />;
        default:
          return <StudentDashboard onNavigate={setCurrentView} />;
      }
    }

    // Admin Views
    if (currentUser.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard onNavigate={setCurrentView} />;
        case 'users':
          return <AdminUserManagement />;
        case 'jobs':
          return <AlumniJobs />;
        case 'events':
          return <AlumniEvents />;
        case 'analytics':
          return <AdminAnalytics />;
        default:
          return <AdminDashboard onNavigate={setCurrentView} />;
      }
    }

    return <AlumniDashboard onNavigate={setCurrentView} />;
  };

  return (
    <div className="min-h-screen">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AppProvider>
  );
}