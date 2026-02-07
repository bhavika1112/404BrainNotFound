import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Briefcase, 
  Calendar, 
  Users, 
  LayoutDashboard,
  UserCheck,
  Settings,
  BarChart3,
  MessageCircle
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const alumniMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'mentorship', label: 'Mentorship', icon: UserCheck },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Opportunities', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'network', label: 'Alumni Network', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'jobs', label: 'Job Management', icon: Briefcase },
    { id: 'events', label: 'Event Management', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const menuItems = 
    currentUser.role === 'alumni' ? alumniMenuItems :
    currentUser.role === 'student' ? studentMenuItems :
    adminMenuItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: '#0F766E' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold" style={{ color: '#1F2933' }}>Smart Alumni Connect</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* User Avatar - Click to view profile */}
          <div 
            onClick={() => onNavigate('profile')}
            className="cursor-pointer hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full md:hidden">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p>{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <p className="text-xs font-normal px-2 py-1 rounded-full inline-block mt-1" style={{ 
                    backgroundColor: '#CDEDEA', 
                    color: '#0F766E' 
                  }}>
                    {currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout Button - Visible on desktop */}
          <Button 
            variant="outline" 
            onClick={logout}
            className="hidden md:flex gap-2 border-2"
            style={{ borderColor: '#E07A2F', color: '#E07A2F' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.id} onClick={() => onNavigate(item.id)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}