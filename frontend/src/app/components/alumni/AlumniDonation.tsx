import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Heart, 
  GraduationCap, 
  Building2, 
  Microscope, 
  DollarSign,
  AlertCircle,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  CreditCard,
  Wallet,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

export function AlumniDonation() {
  const { currentUser, donations, addDonation, alumni, updateUser } = useApp();
  const [selectedTab, setSelectedTab] = useState('donate');
  
  // Donation form state
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [category, setCategory] = useState<'scholarship' | 'infrastructure' | 'research' | 'general' | 'emergency'>('general');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const categories = [
    {
      id: 'scholarship',
      name: 'Student Scholarships',
      icon: GraduationCap,
      color: '#0F766E',
      description: 'Support deserving students with financial aid'
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Development',
      icon: Building2,
      color: '#E07A2F',
      description: 'Improve campus facilities and buildings'
    },
    {
      id: 'research',
      name: 'Research & Innovation',
      icon: Microscope,
      color: '#1F8A7A',
      description: 'Fund cutting-edge research projects'
    },
    {
      id: 'general',
      name: 'General Alumni Fund',
      icon: Heart,
      color: '#C75B12',
      description: 'Support various university initiatives'
    },
    {
      id: 'emergency',
      name: 'Emergency Relief Fund',
      icon: AlertCircle,
      color: '#D66A1F',
      description: 'Help students and alumni in crisis'
    },
  ];

  // Calculate total donations
  const totalDonated = donations
    .filter(d => d.donorId === currentUser?.id)
    .reduce((sum, d) => sum + d.amount, 0);

  const myDonations = donations.filter(d => d.donorId === currentUser?.id);
  const allDonations = donations.filter(d => !d.anonymous);

  // Top donors (non-anonymous)
  const donorStats = donations
    .filter(d => !d.anonymous)
    .reduce((acc, donation) => {
      if (!acc[donation.donorId]) {
        acc[donation.donorId] = {
          donorName: donation.donorName,
          totalAmount: 0,
          donationCount: 0,
        };
      }
      acc[donation.donorId].totalAmount += donation.amount;
      acc[donation.donorId].donationCount += 1;
      return acc;
    }, {} as Record<string, { donorName: string; totalAmount: number; donationCount: number }>);

  const topDonors = Object.values(donorStats)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  const handleDonate = () => {
    const donationAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount);
    
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    if (!purpose.trim()) {
      toast.error('Please specify the purpose of your donation');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to make a donation');
      return;
    }

    // Add donation
    addDonation({
      donorId: currentUser.id,
      donorName: currentUser.name,
      amount: donationAmount,
      purpose: purpose.trim(),
      category,
      message: message.trim(),
      paymentMethod,
      anonymous: isAnonymous,
    });

    // Award gamification points and badge
    const pointsEarned = 100;
    const newPoints = (currentUser.points || 0) + pointsEarned;
    const currentBadges = currentUser.badges || [];
    const hasDonorBadge = currentBadges.includes('Active Donor');
    
    const newBadges = hasDonorBadge ? currentBadges : [...currentBadges, 'Active Donor'];
    const newActivities = [
      ...(currentUser.activities || []),
      {
        description: 'Make a donation',
        points: pointsEarned,
        date: new Date().toISOString().split('T')[0],
      }
    ];

    updateUser(currentUser.id, {
      points: newPoints,
      badges: newBadges,
      activities: newActivities,
    });

    // Show success message
    toast.success(
      `Thank you for your donation of ₹${donationAmount}! You earned ${pointsEarned} points${!hasDonorBadge ? ' and the "Active Donor" badge' : ''}.`,
      { duration: 5000 }
    );

    // Reset form
    setAmount('');
    setCustomAmount('');
    setPurpose('');
    setMessage('');
    setCategory('general');
    setIsAnonymous(false);
    setSelectedTab('history');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Alumni Donations</h1>
        <p className="text-muted-foreground">
          Support your alma mater and make a difference in students' lives
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Total Contributions
            </CardTitle>
            <DollarSign className="w-5 h-5" style={{ color: '#0F766E' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: '#0F766E' }}>
              ₹{totalDonated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {myDonations.length} donation{myDonations.length !== 1 ? 's' : ''} made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Community Impact
            </CardTitle>
            <Users className="w-5 h-5" style={{ color: '#E07A2F' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: '#E07A2F' }}>
              ₹{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total raised from alumni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Reward Points
            </CardTitle>
            <Award className="w-5 h-5" style={{ color: '#1F8A7A' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold" style={{ color: '#1F8A7A' }}>
              {currentUser?.points || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +100 points per donation
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donate">Make a Donation</TabsTrigger>
          <TabsTrigger value="history">My Donations</TabsTrigger>
          <TabsTrigger value="leaderboard">Top Donors</TabsTrigger>
        </TabsList>

        {/* Donate Tab */}
        <TabsContent value="donate" className="space-y-6">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose a Cause</CardTitle>
              <CardDescription>Select where you'd like your contribution to make an impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-current shadow-md' 
                          : 'border-border hover:border-current/50'
                      }`}
                      style={{ 
                        borderColor: isSelected ? cat.color : undefined,
                        backgroundColor: isSelected ? `${cat.color}10` : undefined
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: cat.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{cat.name}</h4>
                          <p className="text-sm text-muted-foreground">{cat.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-2 flex justify-end">
                          <CheckCircle className="w-5 h-5" style={{ color: cat.color }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Amount Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Amount</CardTitle>
              <CardDescription>Choose a preset amount or enter your own</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {predefinedAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? 'default' : 'outline'}
                    onClick={() => {
                      setAmount(preset.toString());
                      setCustomAmount('');
                    }}
                    className="h-auto py-4"
                    style={
                      amount === preset.toString()
                        ? { backgroundColor: '#0F766E' }
                        : undefined
                    }
                  >
                    ₹{preset}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Or enter custom amount</Label>
                <div className="relative">
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="₹ Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>Provide additional information about your contribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / Dedication *</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., In memory of John Doe, Support Engineering Students"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Optional Message</Label>
                <Textarea
                  id="message"
                  placeholder="Share your thoughts or why this cause matters to you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Credit / Debit Card</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="digital_wallet">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span>Digital Wallet</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span>UPI / Mobile Payment</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Make this donation anonymous
                </Label>
              </div>

              <Button 
                onClick={handleDonate} 
                className="w-full"
                size="lg"
                style={{ backgroundColor: '#0F766E' }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate {(customAmount || amount) && `₹${customAmount || amount}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                🎁 Earn 100 reward points + "Active Donor" badge for every donation
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
              <CardDescription>Track your contributions and impact</CardDescription>
            </CardHeader>
            <CardContent>
              {myDonations.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold mb-2">No Donations Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Make your first contribution to support your alma mater
                  </p>
                  <Button onClick={() => setSelectedTab('donate')}>
                    Make a Donation
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myDonations.map((donation) => {
                    const cat = categories.find(c => c.id === donation.category);
                    const Icon = cat?.icon || Heart;
                    return (
                      <div 
                        key={donation.id} 
                        className="p-4 rounded-lg border"
                        style={{ backgroundColor: '#FFF1E4' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: cat?.color ? `${cat.color}20` : '#FAEBDD' }}
                            >
                              <Icon className="w-5 h-5" style={{ color: cat?.color || '#0F766E' }} />
                            </div>
                            <div>
                              <h4 className="font-semibold">{donation.purpose}</h4>
                              <p className="text-sm text-muted-foreground">{cat?.name}</p>
                              {donation.message && (
                                <p className="text-sm mt-1 italic">"{donation.message}"</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-semibold" style={{ color: '#0F766E' }}>
                              ₹{donation.amount}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{donation.paymentMethod.replace('_', ' ')}</Badge>
                          {donation.anonymous && <Badge variant="outline">Anonymous</Badge>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>Recognizing our most generous alumni contributors</CardDescription>
            </CardHeader>
            <CardContent>
              {topDonors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No public donations yet. Be the first to contribute!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topDonors.map((donor, index) => {
                    const isCurrentUser = donor.donorName === currentUser?.name;
                    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                    const rankColor = index < 3 ? rankColors[index] : '#0F766E';
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isCurrentUser ? 'bg-[#CDEDEA]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg"
                            style={{ 
                              backgroundColor: `${rankColor}20`,
                              color: rankColor 
                            }}
                          >
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {donor.donorName}
                              {isCurrentUser && <span className="ml-2 text-sm text-muted-foreground">(You)</span>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {donor.donationCount} donation{donor.donationCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold" style={{ color: '#0F766E' }}>
                            ₹{donor.totalAmount.toLocaleString()}
                          </div>
                          {index < 3 && (
                            <Badge 
                              style={{ 
                                backgroundColor: `${rankColor}20`,
                                color: rankColor,
                                borderColor: rankColor
                              }}
                              variant="outline"
                            >
                              {index === 0 ? '🥇 Top Donor' : index === 1 ? '🥈 2nd Place' : '🥉 3rd Place'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
