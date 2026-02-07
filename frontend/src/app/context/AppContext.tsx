import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'alumni' | 'student' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  graduationYear?: string;
  currentOrganization?: string;
  currentRole?: string;
  skills?: string[]
  department?: string;
  batch?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
    field?: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  achievements?: string[];
  interests?: string[];
  languages?: string[];
  // Gamification fields
  points?: number;
  badges?: string[];
  activities?: Array<{
    description: string;
    points: number;
    date: string;
  }>;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: string;
  applicants?: number;
  status?: 'open' | 'closed';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
  registeredCount: number;
  maxCapacity?: number;
  organizer: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  domain: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  resume?: string;
  coverLetter?: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface Conversation {
  id: string;
  participants: string[]; // user IDs
  participantNames: string[];
  participantRoles: UserRole[];
  participantAvatars: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  purpose: string;
  category: 'scholarship' | 'infrastructure' | 'research' | 'general' | 'emergency';
  message?: string;
  date: string;
  paymentMethod: string;
  anonymous: boolean;
}

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  register: (userData: Partial<User>) => void;
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string) => void;
  mentorshipRequests: MentorshipRequest[];
  addMentorshipRequest: (request: Omit<MentorshipRequest, 'id' | 'requestDate'>) => void;
  updateMentorshipStatus: (id: string, status: 'accepted' | 'rejected') => void;
  applications: Application[];
  applyForJob: (application: Omit<Application, 'id' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  alumni: User[];
  students: User[];
  addAlumnus: (alumnus: Partial<User>) => void;
  addStudent: (student: Partial<User>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updateUserStatus: (id: string, status: 'approved' | 'rejected') => void;
  conversations: Conversation[];
  messages: Message[];
  createConversation: (otherUserId: string) => string;
  sendMessage: (conversationId: string, content: string) => void;
  markMessagesAsRead: (conversationId: string) => void;
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockAlumni: User[] = [
  {
    id: 'a1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'alumni',
    graduationYear: '2018',
    currentOrganization: 'Google',
    currentRole: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with 8+ years of experience building scalable web applications. Love mentoring junior developers and contributing to open-source projects.',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahj',
    website: 'sarahjohnson.dev',
    batch: '2018',
    department: 'Computer Science',
    points: 340,
    badges: ['Top Mentor', 'Community Star', 'Networking Pro'],
    activities: [
      { description: 'Accept mentorship request', points: 50, date: '2026-02-05' },
      { description: 'Post a job opportunity', points: 40, date: '2026-02-01' },
      { description: 'Attend an event', points: 30, date: '2026-01-28' },
      { description: 'Accept mentorship request', points: 50, date: '2026-01-20' },
      { description: 'Post a job opportunity', points: 40, date: '2026-01-15' },
      { description: 'Network with alumni', points: 20, date: '2026-01-10' },
      { description: 'Make a donation', points: 100, date: '2026-01-05' },
      { description: 'Network with alumni', points: 20, date: '2026-01-01' },
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        year: '2020',
        field: 'Machine Learning'
      },
      {
        degree: 'Bachelor of Technology',
        institution: 'University Name',
        year: '2018',
        field: 'Computer Science'
      }
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        duration: '2021 - Present',
        description: 'Leading development of cloud infrastructure tools'
      },
      {
        title: 'Software Engineer',
        company: 'Facebook',
        duration: '2018 - 2021',
        description: 'Built features for News Feed and Messaging platform'
      }
    ],
    achievements: [
      'Google Cloud Certified Professional',
      'Published 3 research papers on distributed systems',
      'Won Best Innovation Award 2024',
      'Mentored 15+ junior engineers'
    ],
    interests: ['Machine Learning', 'Cloud Computing', 'Open Source', 'Photography', 'Hiking'],
    languages: ['English', 'Spanish', 'French']
  },
  {
    id: 'a2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'alumni',
    graduationYear: '2019',
    currentOrganization: 'Microsoft',
    currentRole: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'UX Design', 'Data Analysis', 'Leadership'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    phone: '+1 (206) 555-0456',
    location: 'Seattle, WA',
    bio: 'Product leader focused on building user-centric products that make a difference. Expert in Agile methodologies and cross-functional team leadership.',
    linkedin: 'linkedin.com/in/michaelchen',
    twitter: 'twitter.com/michaelchen',
    batch: '2019',
    department: 'Computer Science',
    points: 280,
    badges: ['Active Donor', 'Community Star'],
    activities: [
      { description: 'Make a donation', points: 100, date: '2026-02-03' },
      { description: 'Organize an event', points: 60, date: '2026-01-25' },
      { description: 'Post a job opportunity', points: 40, date: '2026-01-20' },
      { description: 'Attend an event', points: 30, date: '2026-01-15' },
      { description: 'Accept mentorship request', points: 50, date: '2026-01-10' },
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'Harvard Business School',
        year: '2021',
        field: 'Business Administration'
      },
      {
        degree: 'Bachelor of Engineering',
        institution: 'University Name',
        year: '2019',
        field: 'Computer Science'
      }
    ],
    experience: [
      {
        title: 'Product Manager',
        company: 'Microsoft',
        duration: '2022 - Present',
        description: 'Managing Azure DevOps product line'
      },
      {
        title: 'Associate Product Manager',
        company: 'Google',
        duration: '2019 - 2022',
        description: 'Worked on Google Workspace products'
      }
    ],
    achievements: [
      'Launched 5 successful products',
      'Increased user engagement by 45%',
      'Certified Scrum Master',
      'Speaker at Product Management conferences'
    ],
    interests: ['Product Design', 'Entrepreneurship', 'Tennis', 'Reading', 'Travel'],
    languages: ['English', 'Mandarin', 'Japanese']
  },
  {
    id: 'a3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'alumni',
    graduationYear: '2020',
    currentOrganization: 'Amazon',
    currentRole: 'Data Scientist',
    skills: ['Machine Learning', 'Python', 'SQL', 'TensorFlow', 'Statistics', 'Big Data'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    phone: '+1 (650) 555-0789',
    location: 'Palo Alto, CA',
    bio: 'Data scientist passionate about using AI/ML to solve real-world problems. Specialized in natural language processing and recommendation systems.',
    linkedin: 'linkedin.com/in/emilyrodriguez',
    github: 'github.com/emilyrod',
    website: 'emilyrodriguez.ai',
    batch: '2020',
    department: 'Computer Science',
    points: 210,
    badges: ['Top Mentor'],
    activities: [
      { description: 'Accept mentorship request', points: 50, date: '2026-02-06' },
      { description: 'Accept mentorship request', points: 50, date: '2026-02-02' },
      { description: 'Post a job opportunity', points: 40, date: '2026-01-30' },
      { description: 'Attend an event', points: 30, date: '2026-01-22' },
      { description: 'Post a job opportunity', points: 40, date: '2026-01-12' },
    ],
    education: [
      {
        degree: 'Ph.D. in Data Science',
        institution: 'MIT',
        year: '2022',
        field: 'Artificial Intelligence'
      },
      {
        degree: 'Bachelor of Science',
        institution: 'University Name',
        year: '2020',
        field: 'Computer Science & Mathematics'
      }
    ],
    experience: [
      {
        title: 'Senior Data Scientist',
        company: 'Amazon',
        duration: '2023 - Present',
        description: 'Building ML models for product recommendations'
      },
      {
        title: 'Data Scientist',
        company: 'Netflix',
        duration: '2020 - 2023',
        description: 'Developed personalization algorithms'
      }
    ],
    achievements: [
      'Published 8 papers in top AI conferences',
      'AWS Certified Machine Learning Specialist',
      'Kaggle Grandmaster',
      'Built ML models serving 100M+ users'
    ],
    interests: ['AI Research', 'Data Visualization', 'Yoga', 'Painting', 'Cooking'],
    languages: ['English', 'Spanish', 'Portuguese']
  },
  {
    id: 'a4',
    name: 'David Thompson',
    email: 'david@example.com',
    role: 'alumni',
    graduationYear: '2018',
    currentOrganization: 'Tesla',
    currentRole: 'Engineering Manager',
    skills: ['Leadership', 'Embedded Systems', 'C++', 'Python', 'IoT'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    phone: '+1 (650) 555-0321',
    location: 'Palo Alto, CA',
    bio: 'Engineering leader specializing in autonomous systems and electric vehicles.',
    linkedin: 'linkedin.com/in/davidthompson',
    github: 'github.com/dthompson',
    batch: '2018',
    department: 'Electrical Engineering',
    points: 195,
    badges: ['Community Star', 'Networking Pro'],
    activities: [
      { description: 'Organize an event', points: 60, date: '2026-02-04' },
      { description: 'Attend an event', points: 30, date: '2026-01-25' },
      { description: 'Network with alumni', points: 20, date: '2026-01-18' },
      { description: 'Post a job opportunity', points: 40, date: '2026-01-12' },
      { description: 'Network with alumni', points: 20, date: '2026-01-08' },
      { description: 'Attend an event', points: 30, date: '2026-01-05' },
    ],
    education: [
      {
        degree: 'Bachelor of Engineering',
        institution: 'University Name',
        year: '2018',
        field: 'Electrical Engineering'
      }
    ],
    experience: [
      {
        title: 'Engineering Manager',
        company: 'Tesla',
        duration: '2022 - Present',
        description: 'Leading autonomous driving software team'
      },
      {
        title: 'Senior Software Engineer',
        company: 'Apple',
        duration: '2018 - 2022',
        description: 'Developed embedded systems for consumer electronics'
      }
    ],
    achievements: [
      'Led team that shipped Autopilot 3.0',
      'Patent holder - 3 autonomous driving patents',
      'Speaker at Embedded Systems Conference'
    ],
    interests: ['Autonomous Vehicles', 'Robotics', 'Cycling', 'Photography'],
    languages: ['English', 'German']
  },
  {
    id: 'a5',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    role: 'alumni',
    graduationYear: '2021',
    currentOrganization: 'Meta',
    currentRole: 'UX Designer',
    skills: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaP',
    phone: '+1 (408) 555-0987',
    location: 'San Francisco, CA',
    bio: 'User experience designer passionate about creating inclusive and accessible products.',
    linkedin: 'linkedin.com/in/priyapatel',
    website: 'priyapatel.design',
    batch: '2021',
    department: 'Design',
    points: 160,
    badges: ['Top Mentor'],
    activities: [
      { description: 'Accept mentorship request', points: 50, date: '2026-02-01' },
      { description: 'Attend an event', points: 30, date: '2026-01-28' },
      { description: 'Accept mentorship request', points: 50, date: '2026-01-18' },
      { description: 'Attend an event', points: 30, date: '2026-01-10' },
    ],
    education: [
      {
        degree: 'Bachelor of Design',
        institution: 'University Name',
        year: '2021',
        field: 'User Experience Design'
      }
    ],
    experience: [
      {
        title: 'UX Designer',
        company: 'Meta',
        duration: '2023 - Present',
        description: 'Designing experiences for Instagram Reels'
      },
      {
        title: 'Product Designer',
        company: 'Airbnb',
        duration: '2021 - 2023',
        description: 'Worked on host experience and booking flows'
      }
    ],
    achievements: [
      'Redesigned Instagram messaging - 20% engagement increase',
      'Winner of Awwwards - Best UX 2024',
      'Mentor to 10+ design students'
    ],
    interests: ['UI/UX Design', 'Accessibility', 'Traveling', 'Art', 'Podcasts'],
    languages: ['English', 'Hindi', 'Gujarati']
  },
  {
    id: 'a6',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'alumni',
    graduationYear: '2019',
    currentOrganization: 'Goldman Sachs',
    currentRole: 'Quantitative Analyst',
    skills: ['Python', 'R', 'Financial Modeling', 'Machine Learning', 'Risk Analysis'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    phone: '+1 (212) 555-0654',
    location: 'New York, NY',
    bio: 'Quantitative analyst specializing in algorithmic trading and risk management.',
    linkedin: 'linkedin.com/in/jameswilson',
    batch: '2019',
    department: 'Mathematics',
    points: 130,
    badges: ['Active Donor'],
    activities: [
      { description: 'Make a donation', points: 100, date: '2026-01-30' },
      { description: 'Attend an event', points: 30, date: '2026-01-15' },
    ],
    education: [
      {
        degree: 'Master of Science',
        institution: 'Columbia University',
        year: '2021',
        field: 'Financial Engineering'
      },
      {
        degree: 'Bachelor of Science',
        institution: 'University Name',
        year: '2019',
        field: 'Applied Mathematics'
      }
    ],
    experience: [
      {
        title: 'Quantitative Analyst',
        company: 'Goldman Sachs',
        duration: '2021 - Present',
        description: 'Developing trading algorithms and risk models'
      },
      {
        title: 'Data Analyst',
        company: 'JPMorgan Chase',
        duration: '2019 - 2021',
        description: 'Financial data analysis and reporting'
      }
    ],
    achievements: [
      'CFA Level III Candidate',
      'Published research on algorithmic trading',
      'Top performer in quantitative team 2024'
    ],
    interests: ['Finance', 'Chess', 'Running', 'Jazz Music'],
    languages: ['English', 'French']
  },
];

const mockStudents: User[] = [
  {
    id: 's1',
    name: 'Alex Kumar',
    email: 'alex@student.com',
    role: 'student',
    department: 'Computer Science',
    batch: '2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    phone: '+1 (555) 123-4567',
    location: 'Campus Dorm, University Name',
    bio: 'Aspiring software engineer passionate about full-stack development and artificial intelligence. Looking for internship opportunities and mentorship.',
    linkedin: 'linkedin.com/in/alexkumar',
    github: 'github.com/alexk',
    skills: ['Python', 'Java', 'React', 'Node.js', 'SQL'],
    education: [
      {
        degree: 'Bachelor of Technology',
        institution: 'University Name',
        year: '2024',
        field: 'Computer Science'
      }
    ],
    achievements: [
      'Dean\'s List - Fall 2023',
      'Won University Hackathon 2023',
      'President of Coding Club',
      'Published article in university tech magazine'
    ],
    interests: ['Web Development', 'AI/ML', 'Competitive Programming', 'Gaming', 'Music'],
    languages: ['English', 'Hindi', 'Tamil']
  },
  {
    id: 's2',
    name: 'Priya Sharma',
    email: 'priya@student.com',
    role: 'student',
    department: 'Information Technology',
    batch: '2025',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    phone: '+1 (555) 234-5678',
    location: 'University Campus',
    bio: 'Enthusiastic IT student with a keen interest in cybersecurity and cloud computing. Active member of Women in Tech community.',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyas',
    website: 'priyasharma.tech',
    skills: ['Python', 'Cybersecurity', 'AWS', 'JavaScript', 'Linux'],
    education: [
      {
        degree: 'Bachelor of Technology',
        institution: 'University Name',
        year: '2025',
        field: 'Information Technology'
      }
    ],
    achievements: [
      'Google Cloud Certified Associate',
      'Winner of Cyber Security CTF Competition',
      'Vice President of Tech Society',
      'Completed 50+ online certifications'
    ],
    interests: ['Cybersecurity', 'Cloud Computing', 'Photography', 'Blogging', 'Traveling'],
    languages: ['English', 'Hindi', 'Punjabi']
  },
];

const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for a talented Frontend Developer to join our team.',
    requirements: ['React', '3+ years experience', 'TypeScript'],
    postedBy: 'Sarah Johnson',
    postedDate: '2026-02-01',
    applicants: 15,
    status: 'open'
  },
  {
    id: 'j2',
    title: 'Data Science Intern',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Internship',
    description: 'Summer internship opportunity for aspiring data scientists.',
    requirements: ['Python', 'Machine Learning', 'Statistics'],
    postedBy: 'Emily Rodriguez',
    postedDate: '2026-02-03',
    applicants: 22,
    status: 'open'
  },
  {
    id: 'j3',
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Full-time',
    description: 'Join our product team to build innovative solutions.',
    requirements: ['5+ years experience', 'Agile methodology', 'Technical background'],
    postedBy: 'Michael Chen',
    postedDate: '2026-01-28',
    applicants: 8,
    status: 'open'
  },
];

const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Annual Alumni Reunion 2026',
    date: '2026-03-15',
    time: '10:00 AM',
    location: 'Main Campus Auditorium',
    description: 'Join us for our annual alumni reunion with networking and activities.',
    type: 'Reunion',
    registeredCount: 156,
    maxCapacity: 300,
    organizer: 'Alumni Association',
    status: 'upcoming'
  },
  {
    id: 'e2',
    title: 'Career Guidance Webinar',
    date: '2026-02-20',
    time: '6:00 PM',
    location: 'Online - Zoom',
    description: 'Expert alumni share insights on career transitions and growth.',
    type: 'Webinar',
    registeredCount: 89,
    organizer: 'Career Services',
    status: 'upcoming'
  },
  {
    id: 'e3',
    title: 'Tech Talk: AI & Machine Learning',
    date: '2026-02-10',
    time: '3:00 PM',
    location: 'Engineering Building Room 301',
    description: 'Alumni experts discuss the latest in AI and ML technologies.',
    type: 'Workshop',
    registeredCount: 45,
    maxCapacity: 50,
    organizer: 'CS Department',
    status: 'upcoming'
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [alumni, setAlumni] = useState<User[]>(mockAlumni);
  const [students, setStudents] = useState<User[]>(mockStudents);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login logic
    if (role === 'alumni') {
      const alumniUser = alumni.find(a => a.email === email) || {
        id: 'a1',
        name: 'Demo Alumni',
        email,
        role: 'alumni',
        graduationYear: '2020',
        currentOrganization: 'Tech Corp',
        currentRole: 'Software Engineer',
        skills: ['React', 'Node.js'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
      };
      setCurrentUser(alumniUser);
    } else if (role === 'student') {
      const studentUser = students.find(s => s.email === email) || {
        id: 's1',
        name: 'Demo Student',
        email,
        role: 'student',
        department: 'Computer Science',
        batch: '2024',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student'
      };
      setCurrentUser(studentUser);
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin1',
        name: 'Admin User',
        email,
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'student',
      ...userData,
    };
    
    if (newUser.role === 'alumni') {
      setAlumni([...alumni, newUser]);
    } else if (newUser.role === 'student') {
      setStudents([...students, newUser]);
    }
    
    setCurrentUser(newUser);
  };

  const addJob = (job: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...job,
      id: Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
    };
    setJobs([newJob, ...jobs]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents([newEvent, ...events]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(event => event.id === id ? { ...event, ...updates } : event));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const registerForEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, registeredCount: event.registeredCount + 1 } 
        : event
    ));
  };

  const addMentorshipRequest = (request: Omit<MentorshipRequest, 'id' | 'requestDate'>) => {
    const newRequest: MentorshipRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setMentorshipRequests([newRequest, ...mentorshipRequests]);
  };

  const updateMentorshipStatus = (id: string, status: 'accepted' | 'rejected') => {
    setMentorshipRequests(mentorshipRequests.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const applyForJob = (application: Omit<Application, 'id' | 'appliedDate'>) => {
    const newApplication: Application = {
      ...application,
      id: Math.random().toString(36).substr(2, 9),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setApplications([newApplication, ...applications]);
    
    // Update job applicants count
    setJobs(jobs.map(job => 
      job.id === application.jobId 
        ? { ...job, applicants: (job.applicants || 0) + 1 } 
        : job
    ));
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  const addAlumnus = (alumnus: Partial<User>) => {
    const newAlumnus: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: alumnus.name || '',
      email: alumnus.email || '',
      role: 'alumni',
      ...alumnus,
    };
    setAlumni([...alumni, newAlumnus]);
  };

  const addStudent = (student: Partial<User>) => {
    const newStudent: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: student.name || '',
      email: student.email || '',
      role: 'student',
      ...student,
    };
    setStudents([...students, newStudent]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setAlumni(alumni.map(a => a.id === id ? { ...a, ...updates } : a));
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateUserStatus = (id: string, status: 'approved' | 'rejected') => {
    // In a real app, this would update user approval status
    console.log(`User ${id} status updated to ${status}`);
  };

  const createConversation = (otherUserId: string) => {
    const newConversationId = Math.random().toString(36).substr(2, 9);
    const newConversation: Conversation = {
      id: newConversationId,
      participants: [currentUser!.id, otherUserId],
      participantNames: [currentUser!.name, 'Other User'],
      participantRoles: [currentUser!.role, 'student'],
      participantAvatars: [currentUser!.avatar, 'https://api.dicebear.com/7.x/avataaars/svg?seed=OtherUser'],
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
    };
    setConversations([newConversation, ...conversations]);
    return newConversationId;
  };

  const sendMessage = (conversationId: string, content: string) => {
    const newMessageId = Math.random().toString(36).substr(2, 9);
    const newMessage: Message = {
      id: newMessageId,
      conversationId,
      senderId: currentUser!.id,
      senderName: currentUser!.name,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages([newMessage, ...messages]);
    
    // Update conversation last message
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: content, lastMessageTime: new Date().toISOString() } 
        : conv
    ));
  };

  const markMessagesAsRead = (conversationId: string) => {
    setMessages(messages.map(msg => 
      msg.conversationId === conversationId ? { ...msg, read: true } : msg
    ));
    
    // Update conversation unread count
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 } 
        : conv
    ));
  };

  const addDonation = (donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    setDonations([newDonation, ...donations]);
  };

  const value: AppContextType = {
    currentUser,
    login,
    logout,
    register,
    jobs,
    addJob,
    updateJob,
    deleteJob,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    mentorshipRequests,
    addMentorshipRequest,
    updateMentorshipStatus,
    applications,
    applyForJob,
    updateApplicationStatus,
    alumni,
    students,
    addAlumnus,
    addStudent,
    updateUser,
    updateUserStatus,
    conversations,
    messages,
    createConversation,
    sendMessage,
    markMessagesAsRead,
    donations,
    addDonation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}