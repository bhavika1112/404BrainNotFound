import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search,
  FileText,
  Send,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentJobs() {
  const { currentUser, jobs, applications, applyForJob } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: '',
  });

  const myApplications = applications.filter(app => app.studentId === currentUser?.id);
  const appliedJobIds = myApplications.map(app => app.jobId);
  
  const availableJobs = jobs.filter(job => 
    job.status === 'open' && !appliedJobIds.includes(job.id)
  );

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleApply = (jobId: string) => {
    setSelectedJob(jobId);
    setIsApplyDialogOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob || !currentUser) return;

    applyForJob({
      jobId: selectedJob,
      studentId: currentUser.id,
      studentName: currentUser.name,
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume,
      status: 'pending',
    });

    setApplicationData({ coverLetter: '', resume: '' });
    setIsApplyDialogOpen(false);
    setSelectedJob(null);
    toast.success('Application submitted successfully!');
  };

  const getJobForApplication = (jobId: string) => {
    return jobs.find(j => j.id === jobId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Job Opportunities</h1>
        <p className="text-muted-foreground">
          Browse and apply for jobs posted by alumni
        </p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">
            Available Jobs ({availableJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            My Applications ({myApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-4 py-2 rounded-md border bg-input-background"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No jobs available</h3>
                <p className="text-muted-foreground">Check back later for new opportunities</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <Badge variant="outline">{job.type}</Badge>
                        </CardDescription>
                      </div>
                      <Badge style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{job.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                        <span>Posted by {job.postedBy}</span>
                      </div>
                      <Button onClick={() => handleApply(job.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4 mt-6">
          {myApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 mb-4 opacity-50" style={{ color: '#8B8B8B' }} />
                <h3 className="mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">Start applying to jobs to see them here</p>
                <Button onClick={() => {}}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myApplications.map((app) => {
                const job = getJobForApplication(app.jobId);
                if (!job) return null;
                
                return (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle>{job.title}</CardTitle>
                            <Badge 
                              style={
                                app.status === 'accepted' ? { backgroundColor: '#CDEDEA', color: '#0F766E' } :
                                app.status === 'rejected' ? { backgroundColor: '#FFD6B8', color: '#C75B12' } :
                                app.status === 'reviewed' ? { backgroundColor: '#FFF1C1', color: '#C75B12' } :
                                { backgroundColor: '#FAEBDD', color: '#8B8B8B' }
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <Badge variant="outline">{job.type}</Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {app.coverLetter && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Cover Letter:</h4>
                          <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: '#FAEBDD' }}>
                            {app.coverLetter}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Applied on {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                        {app.status === 'accepted' && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Congratulations!
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
            <DialogDescription>
              Submit your application for this position
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position..."
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume/CV Link *</Label>
              <Input
                id="resume"
                placeholder="https://drive.google.com/your-resume"
                value={applicationData.resume}
                onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide a link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsApplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Application
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
