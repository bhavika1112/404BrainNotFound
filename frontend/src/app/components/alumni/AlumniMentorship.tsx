import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  UserCheck, 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  Mail,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

export function AlumniMentorship() {
  const { currentUser, mentorshipRequests, updateMentorshipStatus, students } = useApp();
  
  const myRequests = mentorshipRequests.filter(req => req.mentorName === currentUser?.name);
  const pendingRequests = myRequests.filter(req => req.status === 'pending');
  const acceptedRequests = myRequests.filter(req => req.status === 'accepted');
  const rejectedRequests = myRequests.filter(req => req.status === 'rejected');

  const handleAccept = (requestId: string, studentName: string) => {
    updateMentorshipStatus(requestId, 'accepted');
    toast.success(`Accepted mentorship request from ${studentName}`);
  };

  const handleReject = (requestId: string) => {
    updateMentorshipStatus(requestId, 'rejected');
    toast.success('Request declined');
  };

  const getStudent = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Mentorship</h1>
        <p className="text-muted-foreground">
          Guide students and share your professional experience
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold mt-1">{pendingRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF1C1' }}>
                <Clock className="w-5 h-5" style={{ color: '#C75B12' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold mt-1">{acceptedRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#CDEDEA' }}>
                <UserCheck className="w-5 h-5" style={{ color: '#0F766E' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-semibold mt-1">{myRequests.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD6B8' }}>
                <MessageSquare className="w-5 h-5" style={{ color: '#E07A2F' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impact Score</p>
                <p className="text-2xl font-semibold mt-1">{acceptedRequests.length * 10}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FBC4AB' }}>
                <Check className="w-5 h-5" style={{ color: '#D66A1F' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({acceptedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No pending requests</h3>
                <p className="text-muted-foreground text-center">
                  You're all caught up! New mentorship requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map((request) => {
                const student = getStudent(request.studentId);
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#CDEDEA' }}>
                            <span className="font-semibold" style={{ color: '#0F766E' }}>
                              {request.studentName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{request.studentName}</CardTitle>
                            <CardDescription className="flex flex-col gap-1 mt-1">
                              <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Interested in: {request.domain}
                              </span>
                              {student && (
                                <span className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {student.department} • Batch {student.batch}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge style={{ backgroundColor: '#FFF1C1', color: '#C75B12' }}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Message:</h4>
                        <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: '#FAEBDD' }}>
                          {request.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">
                          Requested on {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            onClick={() => handleAccept(request.id, request.studentName)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4 mt-6">
          {acceptedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No active mentorships</h3>
                <p className="text-muted-foreground text-center">
                  Accept pending requests to start mentoring students
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {acceptedRequests.map((request) => {
                const student = getStudent(request.studentId);
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#CDEDEA' }}>
                          <span className="font-semibold" style={{ color: '#0F766E' }}>
                            {request.studentName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{request.studentName}</CardTitle>
                          <CardDescription>{request.domain}</CardDescription>
                        </div>
                        <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {student && (
                        <div className="text-sm space-y-1">
                          <p className="text-muted-foreground">
                            {student.department} • Batch {student.batch}
                          </p>
                          <p className="text-muted-foreground">{student.email}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-3 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {rejectedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No history</h3>
                <p className="text-muted-foreground">Declined requests will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rejectedRequests.map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{request.studentName}</CardTitle>
                        <CardDescription>{request.domain}</CardDescription>
                      </div>
                      <Badge variant="secondary">Declined</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
