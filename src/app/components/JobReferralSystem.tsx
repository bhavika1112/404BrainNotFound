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
  Briefcase, 
  UserPlus,
  Send,
  CheckCircle,
  TrendingUp,
  Award,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Star
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

interface Referral {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  referrerId: string;
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  candidateResume?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interviewed' | 'hired';
  createdAt: Date;
  bonus?: number;
}

export function JobReferralSystem() {
  const { jobs, alumni, currentUser } = useApp();
  const { addNotification } = useNotifications();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [showReferDialog, setShowReferDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [referralForm, setReferralForm] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    candidateLinkedIn: '',
    relationship: '',
    whyGoodFit: ''
  });

  if (!currentUser) return null;

  const handleReferCandidate = (job: any) => {
    setSelectedJob(job);
    setShowReferDialog(true);
  };

  const handleSubmitReferral = () => {
    if (!selectedJob || !referralForm.candidateName || !referralForm.candidateEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newReferral: Referral = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      referrerId: currentUser.id,
      referrerName: currentUser.name,
      candidateName: referralForm.candidateName,
      candidateEmail: referralForm.candidateEmail,
      status: 'pending',
      createdAt: new Date(),
      bonus: 1000 // Mock referral bonus
    };

    setReferrals([newReferral, ...referrals]);

    addNotification({
      type: 'job',
      title: 'Referral Submitted',
      message: `Your referral for ${referralForm.candidateName} has been submitted for ${selectedJob.title}`,
      priority: 'medium'
    });

    toast.success('Referral submitted successfully!');
    setShowReferDialog(false);
    setReferralForm({
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      candidateLinkedIn: '',
      relationship: '',
      whyGoodFit: ''
    });
    setSelectedJob(null);
  };

  const myReferrals = referrals.filter(r => r.referrerId === currentUser.id);
  const successfulReferrals = myReferrals.filter(r => r.status === 'hired');
  const totalBonusEarned = successfulReferrals.reduce((sum, r) => sum + (r.bonus || 0), 0);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: '#FFF1C1', color: '#C75B12', label: 'Pending Review' },
      accepted: { bg: '#CDEDEA', color: '#0F766E', label: 'Under Review' },
      interviewed: { bg: '#FFD6B8', color: '#D66A1F', label: 'Interviewed' },
      hired: { bg: '#CDEDEA', color: '#0D5C57', label: 'Hired!' },
      rejected: { bg: '#FAEBDD', color: '#8B8B8B', label: 'Not Selected' }
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
            <UserPlus className="w-5 h-5" style={{ color: '#E07A2F' }} />
          </div>
          <div>
            <h1>Job Referral System</h1>
            <p className="text-muted-foreground">
              Refer talented candidates and earn rewards
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{myReferrals.length}</div>
            <p className="text-xs text-muted-foreground">Candidates referred</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {myReferrals.length > 0 
                ? Math.round((successfulReferrals.length / myReferrals.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Hired candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Hires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{successfulReferrals.length}</div>
            <p className="text-xs text-muted-foreground">Candidates hired</p>
          </CardContent>
        </Card>
        <Card style={{ borderColor: '#0F766E' }} className="border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bonus Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-[#0F766E]">
              ${totalBonusEarned.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Referral rewards</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-2" style={{ borderColor: '#FFD6B8', backgroundColor: '#FFF1E4' }}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFD6B8' }}>
              <Award className="w-6 h-6" style={{ color: '#C75B12' }} />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Earn Rewards by Referring</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Refer qualified candidates for open positions</p>
                <p>• Earn up to $1,000-$5,000 per successful hire</p>
                <p>• Help grow your company and network simultaneously</p>
                <p>• Track all your referrals in one place</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Available Jobs for Referral */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Open Positions
            </CardTitle>
            <CardDescription>Refer candidates for these roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {jobs.filter(j => j.status === 'open').map(job => (
                <div
                  key={job.id}
                  className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold text-sm">{job.title}</h4>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <DollarSign className="w-3 h-3" />
                        $1,000 bonus
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleReferCandidate(job)}
                        style={{ backgroundColor: '#0F766E' }}
                      >
                        Refer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Referrals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Referrals</CardTitle>
            <CardDescription>Track your candidate referrals</CardDescription>
          </CardHeader>
          <CardContent>
            {myReferrals.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground mb-4">No referrals yet</p>
                <p className="text-sm text-muted-foreground">
                  Start referring qualified candidates to earn rewards
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReferrals.map(referral => (
                  <div
                    key={referral.id}
                    className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{referral.candidateName}</h4>
                          {getStatusBadge(referral.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {referral.jobTitle} at {referral.company}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {referral.createdAt.toLocaleDateString()}
                          </span>
                          {referral.bonus && (
                            <span className="flex items-center gap-1 text-[#0F766E] font-medium">
                              <DollarSign className="w-3 h-3" />
                              ${referral.bonus} potential bonus
                            </span>
                          )}
                        </div>
                      </div>
                      {referral.status === 'hired' && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#CDEDEA' }}>
                          <Star className="w-5 h-5" style={{ color: '#0F766E' }} />
                          <div className="text-sm">
                            <p className="font-semibold" style={{ color: '#0F766E' }}>
                              ${referral.bonus}
                            </p>
                            <p className="text-xs" style={{ color: '#0D5C57' }}>Earned</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for non-hired referrals */}
                    {referral.status !== 'hired' && referral.status !== 'rejected' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Application Progress</span>
                          <span>
                            {referral.status === 'pending' ? '25%' :
                             referral.status === 'accepted' ? '50%' :
                             referral.status === 'interviewed' ? '75%' : '100%'}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#FAEBDD]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: referral.status === 'pending' ? '25%' :
                                     referral.status === 'accepted' ? '50%' :
                                     referral.status === 'interviewed' ? '75%' : '100%',
                              backgroundColor: '#0F766E'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referral Dialog */}
      <Dialog open={showReferDialog} onOpenChange={setShowReferDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Refer a Candidate</DialogTitle>
            <DialogDescription>
              {selectedJob && `Refer someone for ${selectedJob.title} at ${selectedJob.company}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name *</Label>
              <Input
                id="candidateName"
                placeholder="Full name"
                value={referralForm.candidateName}
                onChange={(e) => setReferralForm({ ...referralForm, candidateName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidateEmail">Email Address *</Label>
              <Input
                id="candidateEmail"
                type="email"
                placeholder="email@example.com"
                value={referralForm.candidateEmail}
                onChange={(e) => setReferralForm({ ...referralForm, candidateEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidatePhone">Phone Number</Label>
              <Input
                id="candidatePhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={referralForm.candidatePhone}
                onChange={(e) => setReferralForm({ ...referralForm, candidatePhone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidateLinkedIn">LinkedIn Profile</Label>
              <Input
                id="candidateLinkedIn"
                placeholder="linkedin.com/in/..."
                value={referralForm.candidateLinkedIn}
                onChange={(e) => setReferralForm({ ...referralForm, candidateLinkedIn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Your Relationship</Label>
              <Input
                id="relationship"
                placeholder="e.g., Former colleague, Friend, etc."
                value={referralForm.relationship}
                onChange={(e) => setReferralForm({ ...referralForm, relationship: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyGoodFit">Why are they a good fit?</Label>
              <textarea
                id="whyGoodFit"
                className="w-full min-h-[100px] p-3 border rounded-md text-sm"
                placeholder="Explain why this candidate would be great for the role..."
                value={referralForm.whyGoodFit}
                onChange={(e) => setReferralForm({ ...referralForm, whyGoodFit: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReferral}
                className="flex-1 gap-2"
                style={{ backgroundColor: '#0F766E' }}
              >
                <Send className="w-4 h-4" />
                Submit Referral
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReferDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Referrers This Month
          </CardTitle>
          <CardDescription>Alumni making the most successful referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alumni.slice(0, 5).map((alum, index) => (
              <div
                key={alum.id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full font-semibold" 
                     style={{ 
                       backgroundColor: index === 0 ? '#FFD6B8' : '#FAEBDD',
                       color: index === 0 ? '#C75B12' : '#8B8B8B'
                     }}>
                  #{index + 1}
                </div>
                <Avatar>
                  <AvatarImage src={alum.avatar} />
                  <AvatarFallback style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                    {alum.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{alum.name}</p>
                  <p className="text-sm text-muted-foreground">{alum.currentRole}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Math.floor(Math.random() * 10) + 1}</p>
                  <p className="text-xs text-muted-foreground">successful referrals</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
