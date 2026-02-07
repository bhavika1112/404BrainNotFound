import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Upload, 
  Download, 
  Users, 
  Plus, 
  Search,
  Filter,
  FileText,
  CheckCircle,
  X,
  UserPlus,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminBatchManagement() {
  const { alumni, addAlumnus } = useApp();
  const { addNotification } = useNotifications();
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    batchYear: '',
    csvData: ''
  });

  // Get unique batch years from alumni
  const batchYears = [...new Set(alumni.map(a => a.graduationYear || a.batch).filter(Boolean))]
    .sort((a, b) => Number(b) - Number(a));

  // Filter alumni by batch
  const filteredAlumni = alumni.filter(alum => {
    const matchesBatch = selectedBatch === 'all' || 
                        alum.graduationYear === selectedBatch || 
                        alum.batch === selectedBatch;
    const matchesSearch = !searchQuery || 
                         alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alum.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alum.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  // Handle CSV upload
  const handleBulkUpload = () => {
    try {
      // Parse CSV data (simplified version)
      const lines = uploadData.csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      let successCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim());
        const alumnus: any = {
          id: Date.now().toString() + i,
          role: 'alumni',
          graduationYear: uploadData.batchYear,
          batch: uploadData.batchYear,
        };

        headers.forEach((header, index) => {
          const key = header.toLowerCase();
          if (key === 'name') alumnus.name = values[index];
          else if (key === 'email') alumnus.email = values[index];
          else if (key === 'phone') alumnus.phone = values[index];
          else if (key === 'company') alumnus.company = values[index];
          else if (key === 'position' || key === 'role' || key === 'currentrole') {
            alumnus.currentRole = values[index];
          }
          else if (key === 'department' || key === 'field') {
            alumnus.department = values[index];
            alumnus.field = values[index];
          }
          else if (key === 'location') alumnus.location = values[index];
          else if (key === 'linkedin') alumnus.linkedin = values[index];
          else if (key === 'skills') {
            alumnus.skills = values[index].split(';').map(s => s.trim());
          }
        });

        if (alumnus.name && alumnus.email) {
          addAlumnus(alumnus);
          successCount++;
        }
      }

      toast.success(`Successfully uploaded ${successCount} alumni from batch ${uploadData.batchYear}`);
      addNotification({
        type: 'user',
        title: 'Batch Upload Completed',
        message: `${successCount} alumni from batch ${uploadData.batchYear} have been added to the platform.`,
        priority: 'high'
      });

      setShowUploadDialog(false);
      setUploadData({ batchYear: '', csvData: '' });
    } catch (error) {
      toast.error('Error uploading batch. Please check your CSV format.');
    }
  };

  // Download template
  const downloadTemplate = () => {
    const template = `name,email,phone,company,currentRole,department,location,linkedin,skills
John Doe,john@example.com,+1234567890,Google,Software Engineer,Computer Science,San Francisco,linkedin.com/in/johndoe,JavaScript;React;Node.js
Jane Smith,jane@example.com,+1234567891,Microsoft,Product Manager,Business,Seattle,linkedin.com/in/janesmith,Product Management;Agile;Strategy`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni_batch_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  // Export batch data
  const exportBatchData = (batch: string) => {
    const batchAlumni = alumni.filter(a => 
      a.graduationYear === batch || a.batch === batch
    );

    const headers = ['Name', 'Email', 'Phone', 'Company', 'Current Role', 'Department', 'Location'];
    const csvData = [
      headers.join(','),
      ...batchAlumni.map(a => [
        a.name,
        a.email || '',
        a.phone || '',
        a.company || '',
        a.currentRole || '',
        a.department || '',
        a.location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch_${batch}_alumni.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Batch ${batch} data exported successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Batch-wise Alumni Management</h1>
        <p className="text-muted-foreground">
          Upload, manage, and organize alumni by graduation batch
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alumni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{alumni.length}</div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{batchYears.length}</div>
            <p className="text-xs text-muted-foreground">Graduation years</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{batchYears[0] || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {alumni.filter(a => a.graduationYear === batchYears[0]).length} alumni
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtered Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{filteredAlumni.length}</div>
            <p className="text-xs text-muted-foreground">Current selection</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alumni by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="gap-2"
                style={{ backgroundColor: '#0F766E' }}
              >
                <Upload className="w-4 h-4" />
                Upload Batch
              </Button>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni by Batch</CardTitle>
          <CardDescription>View and manage alumni organized by graduation year</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedBatch} onValueChange={setSelectedBatch}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="all">All Batches</TabsTrigger>
                {batchYears.map(year => (
                  <TabsTrigger key={year} value={year}>
                    Batch {year}
                  </TabsTrigger>
                ))}
              </TabsList>
              {selectedBatch !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportBatchData(selectedBatch)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {filteredAlumni.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="font-medium mb-2">No alumni found</h3>
                  <p className="text-sm">
                    {searchQuery 
                      ? 'Try adjusting your search query' 
                      : 'Upload a batch to get started'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredAlumni.map(alum => (
                    <div
                      key={alum.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#CDEDEA' }}
                      >
                        <span className="font-semibold" style={{ color: '#0F766E' }}>
                          {alum.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{alum.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alum.graduationYear || alum.batch}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alum.currentRole} at {alum.company || alum.currentOrganization}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alum.email} {alum.phone && `• ${alum.phone}`}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 text-right">
                        <Badge
                          style={{ backgroundColor: '#CDEDEA', color: '#0F766E' }}
                        >
                          {alum.department || alum.field || 'N/A'}
                        </Badge>
                        {alum.location && (
                          <span className="text-xs text-muted-foreground">
                            {alum.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Batch Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Statistics</CardTitle>
          <CardDescription>Overview of alumni distribution by batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batchYears.map(year => {
              const batchAlumni = alumni.filter(a => 
                a.graduationYear === year || a.batch === year
              );
              const percentage = (batchAlumni.length / alumni.length) * 100;

              return (
                <div key={year} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Batch {year}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {batchAlumni.length} alumni
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#0F766E' }}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#FAEBDD]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#0F766E'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upload Alumni Batch</CardTitle>
                  <CardDescription>
                    Upload multiple alumni records using CSV format
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUploadDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchYear">Batch/Graduation Year *</Label>
                <Input
                  id="batchYear"
                  type="text"
                  placeholder="e.g., 2024"
                  value={uploadData.batchYear}
                  onChange={(e) => setUploadData({ ...uploadData, batchYear: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvData">CSV Data *</Label>
                <textarea
                  id="csvData"
                  className="w-full min-h-[200px] p-3 border rounded-md font-mono text-sm"
                  placeholder="Paste your CSV data here or download the template to see the format..."
                  value={uploadData.csvData}
                  onChange={(e) => setUploadData({ ...uploadData, csvData: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Required columns: name, email. Optional: phone, company, currentRole, department, location, linkedin, skills
                </p>
              </div>

              <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFF1E4' }}>
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-[#E07A2F] flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">CSV Format Instructions:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>First row must contain column headers</li>
                      <li>Use comma (,) to separate values</li>
                      <li>Use semicolon (;) to separate multiple skills</li>
                      <li>Download the template for reference</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBulkUpload}
                  disabled={!uploadData.batchYear || !uploadData.csvData}
                  className="flex-1 gap-2"
                  style={{ backgroundColor: '#0F766E' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Upload Batch
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
