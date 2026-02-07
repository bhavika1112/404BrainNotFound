import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  Send, 
  Search,
  User,
  Plus,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export function Messages() {
  const { currentUser, alumni, students, conversations, messages, createConversation, sendMessage, markMessagesAsRead } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  if (!currentUser) return null;

  // Get list of users to chat with (alumni can chat with students and vice versa)
  const availableUsers = currentUser.role === 'alumni' 
    ? students 
    : currentUser.role === 'student' 
    ? alumni 
    : [...alumni, ...students];

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartConversation = (userId: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.participants.includes(userId) && conv.participants.includes(currentUser.id)
    );

    if (existingConv) {
      setSelectedConversation(existingConv.id);
    } else {
      const newConvId = createConversation(userId);
      setSelectedConversation(newConvId);
    }
    setIsNewChatOpen(false);
    setSearchQuery('');
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedConversation) {
      sendMessage(selectedConversation, messageInput);
      setMessageInput('');
    }
  };

  const selectedConvData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages
    .filter(m => m.conversationId === selectedConversation)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getOtherUserInfo = (conv: typeof conversations[0]) => {
    const otherUserId = conv.participants.find(id => id !== currentUser.id);
    const otherUser = [...alumni, ...students].find(u => u.id === otherUserId);
    return otherUser || { 
      name: conv.participantNames.find(n => n !== currentUser.name) || 'Unknown', 
      avatar: conv.participantAvatars.find((_, i) => conv.participants[i] !== currentUser.id) || '',
      role: conv.participantRoles.find(r => r !== currentUser.role) || 'student'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Connect and communicate with {currentUser.role === 'alumni' ? 'students' : 'alumni'}
          </p>
        </div>
        
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ backgroundColor: '#0F766E' }}>
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
              <DialogDescription>
                Select a {currentUser.role === 'alumni' ? 'student' : 'alumni member'} to start chatting
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStartConversation(user.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.role === 'alumni' ? user.currentRole : user.department}
                        </p>
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground mb-4">No conversations yet</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsNewChatOpen(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Start a conversation
                  </Button>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => {
                    const otherUser = getOtherUserInfo(conv);
                    return (
                      <div key={conv.id}>
                        <div
                          onClick={() => {
                            setSelectedConversation(conv.id);
                            markMessagesAsRead(conv.id);
                          }}
                          className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
                            selectedConversation === conv.id 
                              ? 'bg-muted' 
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <Avatar>
                            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                            <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                              {getInitials(otherUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium truncate">{otherUser.name}</p>
                              {conv.unreadCount > 0 && (
                                <Badge 
                                  className="ml-2" 
                                  style={{ backgroundColor: '#E07A2F' }}
                                >
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage || 'No messages yet'}
                            </p>
                            {conv.lastMessageTime && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                  {formatTime(conv.lastMessageTime)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation && selectedConvData ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  {(() => {
                    const otherUser = getOtherUserInfo(selectedConvData);
                    return (
                      <>
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                          <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{otherUser.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {otherUser.role === 'alumni' 
                              ? (otherUser as any).currentRole || 'Alumni' 
                              : (otherUser as any).department || 'Student'}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[480px] p-4">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-muted-foreground">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversationMessages.map((msg) => {
                        const isCurrentUser = msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-[#0F766E] text-white'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="break-words">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-white/70' : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      style={{ backgroundColor: '#0F766E' }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a conversation from the list or start a new one
                </p>
                <Button 
                  onClick={() => setIsNewChatOpen(true)}
                  className="gap-2"
                  style={{ backgroundColor: '#0F766E' }}
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
