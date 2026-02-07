import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Coffee, 
  Calendar,
  Clock,
  Video,
  Phone,
  MessageCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Users,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface CoffeeChat {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  meetingType: 'virtual' | 'in-person' | 'phone';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  createdAt: Date;
}

export function VirtualCoffeeChat() {
  const { currentUser, alumni, students } = useApp();
  const { addNotification } = useNotifications();
  const [chats, setChats] = useState<CoffeeChat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestForm, setRequestForm] = useState({
    topic: '',
    date: '',
    time: '',
    duration: 30,
    meetingType: 'virtual' as const,
    message: ''
  });

  if (!currentUser) return null;

  const availableUsers = currentUser.role === 'student' ? alumni : students;
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.currentRole?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestChat = (user: any) => {
    setSelectedUser(user);
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    if (!selectedUser || !requestForm.topic || !requestForm.date || !requestForm.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newChat: CoffeeChat = {
      id: Math.random().toString(36).substr(2, 9),
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar || '',
      recipientId: selectedUser.id,
      recipientName: selectedUser.name,
      recipientAvatar: selectedUser.avatar || '',
      topic: requestForm.topic,
      date: requestForm.date,
      time: requestForm.time,
      duration: requestForm.duration,
      meetingType: requestForm.meetingType,
      status: 'pending',
      message: requestForm.message,
      createdAt: new Date()
    };

    setChats([newChat, ...chats]);
    
    // Notify recipient
    addNotification({
      type: 'message',
      title: 'Coffee Chat Request',
      message: `${currentUser.name} wants to connect over coffee to discuss "${requestForm.topic}"`,
      priority: 'medium'
    });

    toast.success(`Coffee chat request sent to ${selectedUser.name}`);
    setShowRequestDialog(false);
    setRequestForm({
      topic: '',
      date: '',
      time: '',
      duration: 30,
      meetingType: 'virtual',
      message: ''
    });
    setSelectedUser(null);
  };

  const handleUpdateStatus = (chatId: string, status: 'accepted' | 'declined') => {
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, status } : chat
    ));

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      addNotification({
        type: 'message',
        title: `Coffee Chat ${status === 'accepted' ? 'Accepted' : 'Declined'}`,
        message: `${chat.recipientName} ${status === 'accepted' ? 'accepted' : 'declined'} your coffee chat request`,
        priority: status === 'accepted' ? 'high' : 'low'
      });

      toast.success(
        status === 'accepted' 
          ? 'Coffee chat accepted! Check your calendar.'
          : 'Coffee chat declined.'
      );
    }
  };

  const myChats = chats.filter(
    chat => chat.requesterId === currentUser.id || chat.recipientId === currentUser.id
  );

  const pendingRequests = myChats.filter(
    chat => chat.recipientId === currentUser.id && chat.status === 'pending'
  );

  const upcomingChats = myChats.filter(
    chat => chat.status === 'accepted' && new Date(chat.date) >= new Date()
  );

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: '#FFF1C1', color: '#C75B12', label: 'Pending' },
      accepted: { bg: '#CDEDEA', color: '#0F766E', label: 'Accepted' },
      declined: { bg: '#FAEBDD', color: '#8B8B8B', label: 'Declined' },
      completed: { bg: '#FFD6B8', color: '#0D5C57', label: 'Completed' }
    };
    const style = styles[status as keyof typeof styles] || styles.pending;
    return (
      <Badge style={{ backgroundColor: style.bg, color: style.color }}>
        {style.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
            <Coffee className="w-5 h-5" style={{ color: '#C75B12' }} />
          </div>
          <div>
            <h1>Virtual Coffee Chats</h1>
            <p className="text-muted-foreground">
              Connect with {currentUser.role === 'student' ? 'alumni' : 'students'} over virtual coffee
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{upcomingChats.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled meetings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{myChats.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {myChats.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Successful chats</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Available for Coffee
            </CardTitle>
            <CardDescription>Request a chat with alumni or students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredUsers.slice(0, 10).map(user => (
                  <div
                    key={user.id}
                    className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.currentRole || user.department}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => handleRequestChat(user)}
                      style={{ backgroundColor: '#0F766E' }}
                    >
                      <Coffee className="w-4 h-4" />
                      Request Chat
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Coffee Chats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Coffee Chats</CardTitle>
            <CardDescription>Your scheduled and past conversations</CardDescription>
          </CardHeader>
          <CardContent>
            {myChats.length === 0 ? (
              <div className="text-center py-12">
                <Coffee className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground mb-4">No coffee chats yet</p>
                <p className="text-sm text-muted-foreground">
                  Start by requesting a chat with someone from the list
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myChats.map(chat => {
                  const isRequester = chat.requesterId === currentUser.id;
                  const otherPerson = isRequester 
                    ? { name: chat.recipientName, avatar: chat.recipientAvatar }
                    : { name: chat.requesterName, avatar: chat.requesterAvatar };

                  return (
                    <div
                      key={chat.id}
                      className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={otherPerson.avatar} />
                          <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                            {otherPerson.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-semibold">{otherPerson.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Topic: {chat.topic}
                              </p>
                            </div>
                            {getStatusBadge(chat.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(chat.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {chat.time} ({chat.duration} min)
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {getMeetingIcon(chat.meetingType)}
                              {chat.meetingType.charAt(0).toUpperCase() + chat.meetingType.slice(1)}
                            </div>
                          </div>

                          {chat.message && (
                            <div className="p-2 rounded bg-muted text-sm mb-3">
                              <p className="italic">"{chat.message}"</p>
                            </div>
                          )}

                          {/* Actions for recipient with pending request */}
                          {!isRequester && chat.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(chat.id, 'accepted')}
                                className="gap-2"
                                style={{ backgroundColor: '#0F766E' }}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(chat.id, 'declined')}
                                className="gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Decline
                              </Button>
                            </div>
                          )}

                          {/* Show meeting link for accepted chats */}
                          {chat.status === 'accepted' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <Video className="w-4 h-4" />
                              Join Meeting
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Request Coffee Chat
            </DialogTitle>
            <DialogDescription>
              Schedule a virtual coffee chat with {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="What would you like to discuss?"
                value={requestForm.topic}
                onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={requestForm.date}
                  onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={requestForm.time}
                  onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={requestForm.duration}
                onChange={(e) => setRequestForm({ ...requestForm, duration: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <div className="flex gap-2">
                {[
                  { value: 'virtual', label: 'Virtual', icon: Video },
                  { value: 'phone', label: 'Phone', icon: Phone },
                  { value: 'in-person', label: 'In-Person', icon: Coffee }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={requestForm.meetingType === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRequestForm({ ...requestForm, meetingType: value as any })}
                    className="gap-2 flex-1"
                    style={requestForm.meetingType === value ? { backgroundColor: '#0F766E' } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <textarea
                id="message"
                className="w-full min-h-[80px] p-3 border rounded-md text-sm"
                placeholder="Add a personal message..."
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitRequest}
                className="flex-1 gap-2"
                style={{ backgroundColor: '#0F766E' }}
              >
                <CheckCircle className="w-4 h-4" />
                Send Request
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="border-2" style={{ borderColor: '#FFD6B8', backgroundColor: '#FFF1E4' }}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
              <Sparkles className="w-6 h-6" style={{ color: '#C75B12' }} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Why Coffee Chats?</h3>
              <p className="text-sm text-muted-foreground">
                Virtual coffee chats are perfect for networking, seeking advice, exploring career paths, or just getting to know fellow community members in a casual, low-pressure setting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
